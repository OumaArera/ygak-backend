module.exports = (req, res, next) => {
  if (req.user) {
    req.user.ip = req.ip;
    req.user.userAgent = req.headers['user-agent'];
  }
  next();
};
