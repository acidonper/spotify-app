# Spotify App

_Spotify App_ is a JavaScript project which implements a spotify trending albums indexer with the ability to navigate between albums' songs and reproduce the first part of them.

Regarding the main objective of this repository, the project tries to implement a based nodeJS application developed to work with different JavaScript concepts and integrations. Basically, this project involves the following technologies:

-   NodeJS
-   MnogoDB
-   JavaScipt
-   Express
-   Mongo Sessions
-   Handlebars
-   Bootstrap

## Requirements

-   Spotify developer credentials (ID and SECRET)
-   A functional MongoDB instance and connection parameters (Example: mongodb://user:pass@server:port)

## Environment File

It is required to create an environment file in order to define mongodb connection, spotify credentials and other variables required to start the application. Please, create the file with the following format:

```
$ cat .env
SERVER_PORT=5000
MONGO_PORT=27017
MONGO_HOST=user:pass@server
MONGO_DB=mongo_nodejs
SPOTIFY_ID=xxxxxxxxxx
SPOTIFY_SECRET=xxxx
SPOTIFY_API=https://api.spotify.com/v1/
```

## Init Project

In order to start to work with this application, it is required to create the previous environment file and execute the following command:

```
$ npm install
$ npm start
```

## Funtionality

This application provides a welcome page where clients are able to navigate in the application between login and home page.

Regarding access trending albums information and songs, it is required to login in the application providing and register user's credentials. User registration is a process which is accessible from login page.

Once a registered user login in the app, trending albums' information is displayed. The user will be able to visit different albums, reproduce songs or define songs as favorite with a simple procedure.

## OCP Integration

In order to deploy this project in OpenShift, a set of files have been created. Please, follow the following link in order to access to related documentation [Deploying Spotify App in Openshift](./ocp/README.md)

# License

BSD

# Author

Asier Cidon
