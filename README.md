# UMDB LSMDB Project

UMDb is a platform meant to provide users with a social experience as they share their ratings and reviews on movies.

It is part of a project under a graduate class in University of Pisa: "Large-Scale and Multi-structured Databases", and aims to demonstrate our understanding of the course material by creating a fully functioning application using different notions and technologies covered.

The platform is supplied with a large collection of movies for users to browse and review, and also create watch-lists to organize their activity on the application. Moreover, it promotes the social aspect by allowing users to interact amongst themselves by following each other and/or their preferred watch-lists.



## Installation

* Use the package manager NPM to install all of the modules on the main folder for front-end component (root folder)

```bash
npm install
```

* Use the package manager NPM to install all of the modules Backend Folder for the API (backend folder)

```bash
cd backend
npm install
```
* API testing of endpoints can be done through a POSTMAN collection file on the root folder.


* Create a .env file in the root folder that holds  API internal variables ( in this case it's there and opted to UNIPI servers)
```bash
ACCESS_TOKEN_SECRET="isdf5d6s5df565sdf8q5sd1f616qs2dfE"
MOVIE_DATABASE_USERNAME="neo4j"
MOVIE_DATABASE_PASSWORD="123"
MOVIE_DATABASE_URL="bolt://172.16.4.64:7687"
```

* Edit the Mongo.js file to aim for the cluster or anyother database entrance. (in this case it's already pointed to UNIPI servers)
```bash
    const uri ="mongodb://172.16.4.65:27020,172.16.4.64:27020,172.16.4.60:27020/";
    client = new MongoClient(uri, { w: 1, readPreference: "nearest" });
```


### Starting the application

```javascript

## Frontend commands
Run these commands from the root folder.

- `npm start` Starts the frontend development server.

## Backend commands
Run these commands from the `backend` folder.

- `npm start` Starts the backend development server.
```

Arsalen Bidani, Aida Himmiche, Tesfaye Yimam Mohamed
