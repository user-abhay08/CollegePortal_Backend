const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_token_key_12345');
      
      req.user = await User.findByPk(decoded.id, {
        include: { model: Role, as: 'role' }
      });
      
      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }
      
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role || !roles.includes(req.user.role.name)) {
      return res.status(403).json({
        message: `Role '${req.user?.role?.name || 'unknown'}' is not authorized to access this resource`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
