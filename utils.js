const environment = process.env.NODE_ENV; // development
const stage = require('./config')[environment];
const jwt = require('jsonwebtoken');

module.exports = {
  validateToken: (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
    let result;
    let token;
    if (authorizationHeader) {
      
      //Swagger 2.0 doesnt send "Bearer " in the request... so we gotta hack it a bit.
      if ( authorizationHeader.split(' ')[1] ) {
        token = authorizationHeader.split(' ')[1]; // Bearer <token>
      } else {
        token = authorizationHeader
      }
      
      const options = {
        expiresIn: stage.jwt.expires,
        issuer: stage.jwt.issuer
      };
      try {
        result = jwt.verify(token, process.env.JWT_SECRET, options);
        req.decoded = result;
        next();
      } catch (err) {
        throw new Error(err);
      }
    } else {
      result = { 
        error: `Authentication error. Token required.`,
        status: 401
      };
      res.status(401).send(result);
    }
  },

  randomHash: (length) => {
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let hash = "";

    for (let i = 0; i < length; i++)
      hash += possible.charAt(Math.floor(Math.random() * possible.length));

    return hash;
  }
};