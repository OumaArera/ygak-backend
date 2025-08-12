const jwt = require('jsonwebtoken');
const TokenService = require('../services/token.service');

async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token missing' });

  const decryptedToken = TokenService.decrypt(token);
  const valid = await TokenService.isTokenValid(decryptedToken);
  if (!valid) return res.status(401).json({ error: 'Invalid or expired token' });

  jwt.verify(decryptedToken, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

module.exports = { authenticateToken };