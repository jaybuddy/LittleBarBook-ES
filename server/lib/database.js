const environment = process.env.NODE_ENV;

module.exports = environment === 'devtest'
  ? process.env.MONGO_LOCAL_CONN_URL_TEST
  : process.env.MONGO_LOCAL_CONN_URL;
