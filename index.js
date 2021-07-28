// connect to database and start the server

import app from "./server.js";
import mongodb from "mongodb";
import dotenv from "dotenv";
import RestaurantsDAO from "./DAO/restaurantsDAO.js";
import ReviewsDAO from "./DAO/reviewsDAO.js";
import UsersDAO from "./DAO/usersDAO.js";
dotenv.config();
const MongoClient = mongodb.MongoClient;

const port = process.env.PORT || 8000;

MongoClient.connect(process.env.RESTREVIEWS_DB_URI, {
        poolSize: 50,
        connectTimeoutMS: 2500,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        writeConcern: {
            j: true,
        },
    })
    .catch((err) => {
        console.error(err.stack);
        console.error(err);
        process.exit(1);
    })
    .then(async(client) => {
        await RestaurantsDAO.injectDB(client);
        await ReviewsDAO.injectDB(client);
        await UsersDAO.injectDB(client);
        app.listen(port, () => {
            console.log(`listening on port ${port}`);
        });
    });