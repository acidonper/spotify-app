#!/bin/bash
PROJECT_NAME=test02
SERVICE_NAME=spotify-nodejs
MONGODB_USER=mongo
MONGODB_PASSWORD=mongo
MONGODB_DATABASE=mongo_nodejs
MONGODB_ADMIN_PASSWORD=mongo

# Create MongoDB database based on openshift offical image (Official Template)
oc process -f ../ocpobjects/mongodb.yaml -n $PROJECT_NAME \
-p MONGODB_USER=$MONGODB_USER \
-p MONGODB_PASSWORD=$MONGODB_PASSWORD \
-p MONGODB_DATABASE=$MONGODB_DATABASE \
-p NODE_SERVICE_NAME=$SERVICE_NAME \
-p MONGODB_ADMIN_PASSWORD=$MONGODB_ADMIN_PASSWORD | oc create -f - -n $PROJECT_NAME
