require('dotenv').config();

const environment = process.env.NODE_ENV;
const dev = environment !== 'production';
const next = require('next');

const app = next({ dev });
const handle = app.getRequestHandler();

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const bunyanMiddleware = require('bunyan-middleware');
const logger = require('./server/lib/logger').getLogger();

const swaggerDocument = YAML.load('./server/swagger/swagger.yaml');
const stage = require('./config')[environment];

// Connect to DB, handle DB events
require('./server/lib/connect');

// API Routes
const routes = require('./server/routes/index.js');

app.prepare()
  .then(() => {
    // Startup express
    const server = express();
    const router = express.Router();
    server.use(cookieParser());
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: true }));
    server.use(bunyanMiddleware({
      excludeHeaders: ['cookie', 'authorization'],
      logger,
      verbose: false,
    }));

    // Express API Routes
    server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    server.use('/api/v1', routes(router));

    // Next Routes
    server.get('*', (req, res) => handle(req, res));

    server.listen(`${stage.port}`, () => {
      logger.info(`Server now listening at localhost:${stage.port}`);
    });
  })
  .catch((ex) => {
    logger.error(ex.stack);
    process.exit(1);
  });

module.exports = app;
