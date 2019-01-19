module.exports = {
  development: {
    jwt: {
      issuer: 'bb-api',
      expires: '1d',
    },
    port: process.env.PORT || 3000,
    saltingRounds: 10
  }
}