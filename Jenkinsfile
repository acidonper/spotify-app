node("nodejs") {

    echo "Executing CI for application ${APP_NAME}: Git server (${GIT_URL}) and branch (${GIT_BRANCH})"

    stage("Clone application sources") {
        sh "git config --global credential.helper 'cache --timeout 7200'"
        git branch: GIT_BRANCH, url: GIT_URL
    }

    stage("Build the Project") {
            sh 'npm install'
            // sh 'npm run build:live' 

            if (BUILD_PROJECT) {
                // in case we had a build project, it means we need to save the target
                sh 'mkdir target; tar --exclude=".git" --exclude="./node_modules" -cvf target/archive.tar ./ || [[ $? -eq 1 ]]'
                //sh 'rsync -av . target --exclude=node_modules --exclude=.git || [[ $? -eq 1 ]]'
                stash name: "app-binary", includes: "dist/*,target/*"
            }
    }

    stage('Unit testing') {
        echo "Unit Testing"
        // sh 'npm test'
    }

    stage('QA - Static Analysis') {
        echo "QA - Static Analysis Testing"
        // def scannerHome = tool 'sonar-scanner-tool'
        // withSonarQubeEnv('sonar') {
        //     sh "${scannerHome}/bin/sonar-runner"
        // }
    } 

    echo "Executing Openshift CD for application ${APP_NAME}"

    stage("Openshift build in ${BUILD_PROJECT}") {

        openshift.withCluster() {

            openshift.withProject(BUILD_PROJECT) {
                if (!openshift.selector( "bc/${APP_NAME}").exists()) {
                    echo "Creating build for application ${APP_NAME}"
                    openshift.newBuild("--name=${APP_NAME}", "--image-stream=${BASE_IMAGE}", "--binary", "--to=${APP_NAME}:${BUILD_TAG}")
                }

                if (BASE_IMAGE.contains('nodejs') || BASE_IMAGE.contains('nginx')) {
                    echo "Building from archive"
                    unstash name: "app-binary"
                    openshift.selector("bc", APP_NAME).startBuild("--from-archive=target/archive.tar", "--wait")
                }

                def pkg = readJSON file: 'package.json'
                def version = pkg.version
                def versionRelease = version+"-${BUILD_NUMBER}"

                echo "Tag image ${APP_NAME}:${BUILD_TAG} as ${APP_NAME}:${version}"
                openshift.tag("${BUILD_PROJECT}/${APP_NAME}:${BUILD_TAG}", "${BUILD_PROJECT}/${APP_NAME}:${version}")

            }   
        }
    }

    echo "Cloning environment variables from a private repository"

    stage("Clone application environment variables") {

        dir('spotify-app-exercise-envs'){
            git branch: "master", credentialsId: GIT_CREDS_ENVS, url: GIT_URL_ENVS
        }

    }

    stage("Openshift deploy in ${BUILD_PROJECT}") {

        openshift.withCluster() {
            openshift.withProject(BUILD_PROJECT) {

                echo "Creating configmap from envs"
                apply = openshift.apply(openshift.raw("create configmap ${APP_NAME} --dry-run --from-env-file=./spotify-app-exercise-envs/${DEPLOY_TAG}/configmap --output=yaml").actions[0].out)
                
                echo "Creating secret from envs"
                apply = openshift.apply(openshift.raw("create secret generic ${APP_NAME} --dry-run --from-env-file=./spotify-app-exercise-envs/${DEPLOY_TAG}/secret --output=yaml").actions[0].out)

                echo "Tag image ${APP_NAME}:${BUILD_TAG} as ${APP_NAME}:${DEPLOY_TAG}"
                openshift.tag("${BUILD_PROJECT}/${APP_NAME}:${BUILD_TAG}", "${BUILD_PROJECT}/${APP_NAME}:${DEPLOY_TAG}")
                
                def dc = openshift.selector( "dc/${APP_NAME}")

                if (!dc.exists()) {
                    echo "####################### Creating deployment for application ${APP_NAME} #######################\n"
                    openshift.newApp("--image-stream=${BUILD_PROJECT}/${APP_NAME}:${DEPLOY_TAG}","--name=${APP_NAME}").narrow('svc').expose()
                    openshift.set("triggers", "dc/${APP_NAME}", "--from-config", "--remove")
                    openshift.set("triggers", "dc/${APP_NAME}", "--manual")
                    openshift.set("probe", "dc/${APP_NAME}", "--liveness", "--get-url=http://:8080/")
                    openshift.set("probe", "dc/${APP_NAME}", "--readiness", "--get-url=http://:8080/health")
                    echo "####################### Setting  secret/${APP_NAME} in dc/${APP_NAME} #######################\n"
                    openshift.set("env", "--from=secret/${APP_NAME}", "dc/${APP_NAME}")
                    echo "####################### Setting  configmap/${APP_NAME} in dc/${APP_NAME} #######################\n"
                    openshift.set("env", "--from=configmap/${APP_NAME}", "dc/${APP_NAME}")
                } else {
                    echo "####################### DC exists, rolling out latest version of Deployment #######################\n"
                    dc.rollout().latest()
                }

                // Wait for the DC to be deployed 
                dc.rollout().status()
                
                dc = openshift.selector( "dc/${APP_NAME}")

                def deployment = dc.object()
                def pkg = readJSON file: 'package.json'
                def version = pkg.version
                def versionRelease = version+"-${BUILD_NUMBER}"

                echo "####################### Setting version ${version} in Deployment #######################\n ${deployment}"
                deployment.metadata.labels['current-version'] = version
                
                // Change the DC SA if needed.
                if (SA != "default"){
                    echo "####################### Changing DC SA ${SA} #######################\n ${deployment}"
                    deployment.spec.template.spec.serviceAccountName = SA
                }
                
                openshift.apply(deployment)

                echo "####################### Rolling out latest version of Deployment #######################\n ${deployment}"
                dc.rollout().latest()
                dc.rollout().status()

                echo "####################### Application deployment has been rolled out #######################\n"
                def dcObj = dc.object()
                def podSelector = openshift.selector('pod', [deployment: "${APP_NAME}-${dcObj.status.latestVersion}"])
                podSelector.untilEach {
                    echo "VERIFY pod: ${it.name()}"
                    return it.object().status.containerStatuses[0].ready
                }
            }
        }
    }
}