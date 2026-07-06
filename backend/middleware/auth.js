const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.header('Authorization');

  console.log("Authorization Header:", authHeader);

  if (!authHeader) {
    return res.status(401).json({
      message: 'Access denied. No token provided.'
    });
  }

  try {
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (err) {
    console.error("JWT ERROR:", err);

    return res.status(401).json({
      message: err.message
    });
  }
};