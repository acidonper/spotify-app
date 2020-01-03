#!/bin/bash

PROJECT_NAME=cicd
SERVICE_NAME=spotify-nodejs
SERVICE_GIT_URL="https://github.com/acidonper/spotify-app-exercice.git"
MONGODB_USER=spotify
MONGODB_PASSWORD=spotify
MONGODB_DATABASE=spotify
MONGODB_ADMIN_PASSWORD=spotify
ENVIRONMENT=dev

# oc process -f ocpobjects/image-stream.yaml -n $PROJECT_NAME \
# -p SERVICE_NAME=$SERVICE_NAME | oc create -f - -n $PROJECT_NAME

# oc process -f ocpobjects/build.yaml -n $PROJECT_NAME \
# -p SERVICE_NAME=$SERVICE_NAME \
# -p SERVICE_GIT_URL=$SERVICE_GIT_URL | oc create -f - -n $PROJECT_NAME

# oc process -f ocpobjects/mongodb.yaml -n $PROJECT_NAME \
# -p MONGODB_USER=$MONGODB_USER \
# -p MONGODB_PASSWORD=$MONGODB_PASSWORD \
# -p MONGODB_DATABASE=$MONGODB_DATABASE \
# -p NODE_SERVICE_NAME=$SERVICE_NAME \
# -p MONGODB_ADMIN_PASSWORD=$MONGODB_ADMIN_PASSWORD | oc create -f - -n $PROJECT_NAME

# oc start-build $SERVICE_NAME -n $PROJECT_NAME

# oc create configmap $SERVICE_NAME-$ENVIRONMENT-config -n $PROJECT_NAME --from-env-file ../.env

# oc process -f ocpobjects/$ENVIRONMENT/service.yaml -n $PROJECT_NAME \
# -p SERVICE_NAME=$SERVICE_NAME | oc create -f - -n $PROJECT_NAME

# oc process -f ocpobjects/$ENVIRONMENT/route.yaml -n $PROJECT_NAME \
# -p SERVICE_NAME=$SERVICE_NAME | oc create -f - -n $PROJECT_NAME

oc process -f ocpobjects/$ENVIRONMENT/deployment.yaml -n $PROJECT_NAME  \
-p PROJECT_NAME=$PROJECT_NAME  \
-p SERVICE_NAME=$SERVICE_NAME  \
-p ENVIRONMENT=$ENVIRONMENT | oc create -f - -n $PROJECT_NAME