node("jenkins-agent-nodejs") {

    echo "Executing CI for application ${pipelineParameters.appName}: Git server (${pipelineParameters.gitUrl}) and branch (${pipelineParameters.gitBranch})"

    stage("Clone application sources") {
        sh "git config --global credential.helper 'cache --timeout 7200'"
        // git branch: pipelineParameters.gitBranch, credentialsId: pipelineParameters.gitCredentials, url: pipelineParameters.gitUrl
        git branch: pipelineParameters.gitBranch, url: pipelineParameters.gitUrl

    }

    stage("Build the Project") {
            sh 'npm install'

            // sh 'npm run build:live' 

            if (pipelineParameters.buildProject) {
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

    echo "Executing Openshift CD for application ${pipelineParameters.appName}"

    stage("Openshift build in ${pipelineParameters.buildProject}") {

        openshift.withCluster() {

            openshift.withProject(pipelineParameters.buildProject) {
                if (!openshift.selector( "bc/${pipelineParameters.appName}").exists()) {
                    echo "Creating build for application ${pipelineParameters.appName}"
                    openshift.newBuild("--name=${pipelineParameters.appName}", "--image-stream=${pipelineParameters.baseImage}", "--binary", "--to=${pipelineParameters.appName}:${pipelineParameters.buildTag}")
                }

                if (pipelineParameters.baseImage.contains('nodejs') || pipelineParameters.baseImage.contains('nginx')) {
                    echo "Building from archive"

                        unstash name: "app-binary"
                        
                        openshift.withCluster() {
                            openshift.withProject(pipelineParameters.buildProject) {
                                openshift.selector("bc", pipelineParameters.appName).startBuild("--from-archive=target/archive.tar", "--wait")
                            }
                        }
                }

                echo "Tag image ${pipelineParameters.appName}:${pipelineParameters.buildTag} as ${pipelineParameters.appName}:${version}"

                openshift.tag("${pipelineParameters.buildProject}/${pipelineParameters.appName}:${pipelineParameters.buildTag}", "${pipelineParameters.buildProject}/${pipelineParameters.appName}:${version}")

            }
        }
    }

    stage("Openshift deploy in ${pipelineParameters.buildProject}") {

        openshift.withCluster() {
            openshift.withProject(pipelineParameters.buildProject) {
                
                echo "Tag image ${pipelineParameters.appName}:${pipelineParameters.buildTag} as ${pipelineParameters.appName}:${pipelineParameters.deployTag}"
                
                openshift.tag("${pipelineParameters.buildProject}/${pipelineParameters.appName}:${pipelineParameters.buildTag}", "${pipelineParameters.buildProject}/${pipelineParameters.appName}:${pipelineParameters.deployTag}")
                
                def dc = openshift.selector( "dc/${pipelineParameters.appName}")
                
                if (!dc.exists()) {
                    echo "####################### Creating deployment for application ${pipelineParameters.appName} #######################\n"
                    openshift.newApp("--image-stream=${pipelineParameters.buildProject}/${pipelineParameters.appName}:${pipelineParameters.deployTag}","--name=${pipelineParameters.appName}").narrow('svc').expose()
                    openshift.set("triggers", "dc/${pipelineParameters.appName}", "--from-config", "--remove")
                    openshift.set("triggers", "dc/${pipelineParameters.appName}", "--manual")
                    
                    if (pipelineParameters.baseImage.contains('nginx')) {
                    openshift.set("probe", "dc/${pipelineParameters.appName}", "--liveness", "--get-url=http://:8080/index.html")
                    openshift.set("probe", "dc/${pipelineParameters.appName}", "--readiness", "--get-url=http://:8080/index.html")
                    } else {
                    openshift.set("probe", "dc/${pipelineParameters.appName}", "--liveness", "--get-url=http://:8080/actuator/info")
                    openshift.set("probe", "dc/${pipelineParameters.appName}", "--readiness", "--get-url=http://:8080/actuator/health")
                    }

                } else {
                    echo "####################### DC exists, rolling out latest version of Deployment #######################\n"
                    dc.rollout().latest()
                }

                // Wait for the DC to be deployed 
                dc.rollout().status()
                
                dc = openshift.selector( "dc/${pipelineParameters.appName}")

                def deployment = dc.object()
                
                echo "####################### Setting version ${version} in Deployment #######################\n ${deployment}"
                deployment.metadata.labels['current-version'] = version
                // Change the DC SA if needed.
                if (pipelineParameters.sa != "default"){
                    echo "####################### Changing DC SA ${pipelineParameters.sa} #######################\n ${deployment}"
                    deployment.spec.template.spec.serviceAccountName = pipelineParameters.sa
                }
                openshift.apply(deployment)

                echo "####################### Rolling out latest version of Deployment #######################\n ${deployment}"
                dc.rollout().latest()
                dc.rollout().status()

                echo "####################### Application deployment has been rolled out #######################\n"
                def dcObj = dc.object()
                def podSelector = openshift.selector('pod', [deployment: "${pipelineParameters.appName}-${dcObj.status.latestVersion}"])
                podSelector.untilEach {
                    echo "VERIFY pod: ${it.name()}"
                    return it.object().status.containerStatuses[0].ready
                }
            }
        }
    }
}