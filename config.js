module.exports = {
  devtest: {
    jwt: {
      issuer: 'bb-api',
      expires: '2d',
    },
    port: process.env.PORT || 3000,
    saltingRounds: 10,
  },
  development: {
    jwt: {
      issuer: 'bb-api',
      expires: '2d',
    },
    port: process.env.PORT || 3000,
    saltingRounds: 10,
  },
};
