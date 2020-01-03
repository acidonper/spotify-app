#!/bin/bash

PROJECT_NAME=cicd
SERVICE_NAME=spotify-nodejs
SERVICE_GIT_URL="https://github.com/acidonper/spotify-app-exercice.git"
MONGODB_SERVICE=mongodb
MONGODB_USER=mongo
MONGODB_PASSWORD=mongo
MONGODB_DATABASE=mongo_nodejs
MONGODB_ADMIN_PASSWORD=mongo
MONGO_PORT=27017
MONGO_HOST="$MONGODB_USER:$MONGODB_PASSWORD@$MONGODB_SERVICE"
MONGO_DB="$MONGODB_DATABASE"
ENVIRONMENT=dev
SPOTIFY_ID=*********
SPOTIFY_SECRET=******
SPOTIFY_API="https://api.spotify.com/v1/"

# Create image stream in OCP which will be used to build nodejs project (based on NODDEJS official image stream)
oc process -f ocpobjects/image-stream.yaml -n $PROJECT_NAME \
-p SERVICE_NAME=$SERVICE_NAME | oc create -f - -n $PROJECT_NAME

# Create build config object in order to create a new image based on our image stream with GITHUB repository content (Project nodejs)
oc process -f ocpobjects/build.yaml -n $PROJECT_NAME \
-p SERVICE_NAME=$SERVICE_NAME \
-p SERVICE_GIT_URL=$SERVICE_GIT_URL | oc create -f - -n $PROJECT_NAME

# Generate a new image stream version (latest) with GITHUB code based on the build config created in the previous step
oc start-build $SERVICE_NAME -n $PROJECT_NAME

# Create MongoDB database based on openshift offical image (Official Template)
oc process -f ocpobjects/mongodb.yaml -n $PROJECT_NAME \
-p MONGODB_USER=$MONGODB_USER \
-p MONGODB_PASSWORD=$MONGODB_PASSWORD \
-p MONGODB_DATABASE=$MONGODB_DATABASE \
-p NODE_SERVICE_NAME=$SERVICE_NAME \
-p MONGODB_ADMIN_PASSWORD=$MONGODB_ADMIN_PASSWORD | oc create -f - -n $PROJECT_NAME

# Create a service in order to allow access to nodejs container
oc process -f ocpobjects/$ENVIRONMENT/service.yaml -n $PROJECT_NAME \
-p SERVICE_NAME=$SERVICE_NAME | oc create -f - -n $PROJECT_NAME

# Create a route in order to allow access to previous service
oc process -f ocpobjects/$ENVIRONMENT/route.yaml -n $PROJECT_NAME \
-p SERVICE_NAME=$SERVICE_NAME | oc create -f - -n $PROJECT_NAME

# Create a deployment config object charged with the container creation and inject environment variables 
oc process -f ocpobjects/$ENVIRONMENT/deployment.yaml -n $PROJECT_NAME  \
-p MONGO_PORT=$MONGO_PORT \
-p MONGO_HOST=$MONGO_HOST \
-p MONGO_DB=$MONGO_DB \
-p SPOTIFY_ID=$SPOTIFY_ID  \
-p SPOTIFY_SECRET=$SPOTIFY_SECRET  \
-p SPOTIFY_API=$SPOTIFY_API  \
-p SERVICE_NAME=$SERVICE_NAME  \
-p PROJECT_NAME=$PROJECT_NAME  \
-p ENVIRONMENT=$ENVIRONMENT | oc create -f - -n $PROJECT_NAME

# Start deployment process
oc rollout latest $SERVICE_NAME -n $PROJECT_NAME