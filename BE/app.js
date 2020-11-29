const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const db = require('./models');

const Auth = require('./middlewares/auth');
const schema = require('./graphql/schema');
const rootValue = require('./graphql/resolvers');

class App {
    constructor() {
        this.app = express();
        this.dbConnection();
        this.setConfig();
        this.setMiddleware();
        this.getRouting();
    }

    dbConnection() {
        // DB authentication
        db.sequelize
            .authenticate()
            .then(() => {
                console.log('Connection has been established successfully.');
                //return db.sequelize.sync();
            })
            .then(() => {
                console.log('DB Sync complete.');
            })
            .catch((err) => {
                console.error('Unable to connect to the database:', err);
            });
        //updateServers();
    }

    setConfig() {
        this.app.set('jwt-secret', require('./conf/secret').hashKey);
    }

    setMiddleware() {
        this.app.use(logger('dev'));
        this.app.use(cookieParser());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(cors());
    }

    getRouting() {
        this.app.use(require('./controllers'));
        this.app.use(
            '/graphql',
            Auth.authToken,
            graphqlHTTP((req) => ({
                schema,
                rootValue,
                graphiql: true, // support GUI
                context: {
                    userId: req.decoded.userId,
                },
            })),
        );
    }
}

module.exports = new App().app;
