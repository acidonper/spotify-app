#!/bin/bash
####
# Red Hat
# @author: Asier Cidon
# @date: 20201801
####
#
# Process template to deploy a NodeJS + MongoDB App
#

usage() {
echo "Usage: $0 <project_name> <spotify_id> <sportify_secret>"
echo "Example:"
echo "  ./spotify_full_template.sh spotify01 fd3f2981ab888d788d7b18e381a21788 1837c93d8d288722aefc82e1c522d8fd"
exit 1
}

[[ $# -eq 0 ]] && usage


PROJECT_NAME=$1
MONGODB_SERVICE=mongodb
MONGODB_USER=mongo
MONGODB_PASSWORD=mongo
MONGODB_DATABASE=mongo_nodejs
MONGODB_ADMIN_PASSWORD=mongo
SERVICE_NAME=spotify-nodejs
SERVICE_GIT_URL="https://github.com/acidonper/spotify-app-exercice.git"
SPOTIFY_ID=$2
SPOTIFY_SECRET=$3
SPOTIFY_API="https://api.spotify.com/v1/"

# Create a deployment config object charged with the container creation and inject environment variables 
oc process -f spotify_full_template.yaml  \
-p NAMESPACE=$PROJECT_NAME \
-p DATABASE_SERVICE_NAME=$MONGODB_SERVICE \
-p MONGODB_USER=$MONGODB_USER \
-p MONGODB_PASSWORD=$MONGODB_PASSWORD \
-p MONGODB_DATABASE=$MONGODB_DATABASE \
-p MONGODB_ADMIN_PASSWORD=$MONGODB_ADMIN_PASSWORD \
-p SERVICE_NAME=$SERVICE_NAME  \
-p SERVICE_GIT_URL=$SERVICE_GIT_URL \
-p SPOTIFY_ID=$SPOTIFY_ID  \
-p SPOTIFY_SECRET=$SPOTIFY_SECRET  \
-p SPOTIFY_API=$SPOTIFY_API | oc create -f - -n $PROJECT_NAME

# Start build image
oc start-build bc/spotify-nodejs

# Wait for previous process
sleep 60

# Start deployment process
oc rollout latest $SERVICE_NAME -n $PROJECT_NAME