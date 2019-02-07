const cookieName = process.env.COOKIE_NAME;

module.exports = {
  /**
   * validateToken
   * Method validates an incoming JWT
   */
  parseAuth: (req, res, next) => {
    const authCookie = req.cookies[cookieName];
    let result;
    let token;
    if (authCookie && authCookie.token) {
      // Swagger 2.0 doesnt send "Bearer " in the request... so we gotta hack it a bit.
      if (authCookie.token.split(' ')[1]) {
        token = authCookie.token.split(' ')[1]; // Bearer <token>
      } else {
        token = authCookie.token;
      }
      req.headers.token = token;
      next();
    } else {
      result = {
        error: 'Authentication error. Token required.',
        status: 401,
      };
      res.status(401).send(result);
    }
  },
}
