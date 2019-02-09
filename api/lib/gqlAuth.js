const cookieName = process.env.COOKIE_NAME;

module.exports = {
  /**
   * validateToken
   * Method validates an incoming JWT
   */
  parseAuth: (req, res, next) => {
    const authCookie = req.cookies[cookieName];
    let result;
    if (authCookie && authCookie.token) {
      req.headers.authorization = `Bearer ${authCookie.token}`;
      next();
    } else {
      result = {
        error: 'Authentication error. Token required.',
        status: 401,
      };
      res.status(401).send(result);
    }
  },
};
