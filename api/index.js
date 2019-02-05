require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const graphqlHTTP = require('express-graphql');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const swaggerDocument = YAML.load('./swagger/swagger.yaml');

const app = express();
const router = express.Router();

const environment = process.env.NODE_ENV;
const stage = require('./config')[environment];
const routes = require('./routes/index.js');

const schema = require('./schema');

app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true,
}));

if (environment !== 'production') {
  app.use(logger('dev'));
}

// API Routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1', routes(router));

app.use('/graphql',
  graphqlHTTP(req => ({
    schema,
    rootValue: {

    },
    pretty: true,
    graphiql: true,
  })));

app.listen(`${stage.port}`, () => {
  console.log(`Server now listening at localhost:${stage.port}`);
});

module.exports = app;
