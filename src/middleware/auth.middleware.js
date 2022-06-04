const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  let token =
    req.body.accessToken ||
    req.query.accessToken ||
    req.headers['authorization'];
  if (!token) {
    res
      .status(403)
      .send('Authentication failed. Please Login in your account.');
  }
  try {
    token = token.replace(/^Bearer\s+/, '');
    // eslint-disable-next-line no-undef
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).send('Invalid Token');
  }
};

module.exports = verifyToken;
