require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const bunyanMiddleware = require('bunyan-middleware');
const logger = require('./lib/logger').getLogger();

const swaggerDocument = YAML.load('./swagger/swagger.yaml');
const environment = process.env.NODE_ENV;
const stage = require('./config')[environment];

// Connect to DB, handle DB events
require('./lib/connect');

// API Routes
const routes = require('./routes/index.js');

// Startup express
const app = express();
const router = express.Router();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bunyanMiddleware({
  excludeHeaders: ['cookie', 'authorization'],
  logger,
  verbose: false,
}));

// API Routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1', routes(router));

app.listen(`${stage.port}`, () => {
  logger.info(`Server now listening at localhost:${stage.port}`);
});

module.exports = app;
