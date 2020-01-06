oc process -f pipeline.yaml \
    -p APP_NAME=spotify-nodejs \
    -p GIT_BRANCH=develop \
    -p GIT_URL=https://github.com/acidonper/spotify-app-exercice.git \
    -p GIT_SECRET=jenkins-git-password \
    -p JENKINS_GIT_SECRET=secret \
    -p BUILD_PROJECT=test02 \
    -p BASE_IMAGE=nodejs:10 \
    -p BUILD_TAG=latest \
    -p DEPLOY_TAG=dev \
    -p TEST_STRATEGY=jmeter | oc apply -f - -n cicd