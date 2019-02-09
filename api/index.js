require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const graphqlHTTP = require('express-graphql');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const bunyanMiddleware = require('bunyan-middleware');

const swaggerDocument = YAML.load('./swagger/swagger.yaml');
const environment = process.env.NODE_ENV;
const stage = require('./config')[environment];
const { parseAuth } = require('./lib/gqlAuth');

// API Routes
const routes = require('./routes/index.js');

// GraphQL Schema
const schema = require('./schema');

// Setup logger
const logger = require('./lib/logger');

// Startup express
const app = express();
const router = express.Router();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bunyanMiddleware({
  obscureHeader: ['cookie', 'Authorization'],
  logger,
  verbose: false,
}));

// API Routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1', routes(router));

// GraphQL Endpoint
app.use('/graphql',
  parseAuth,
  graphqlHTTP(req => ({
    schema,
    rootValue: {},
    context: req.headers,
    pretty: true,
    graphiql: true,
  })));

app.listen(`${stage.port}`, () => {
  logger.info(`Server now listening at localhost:${stage.port}`);
});

module.exports = app;
