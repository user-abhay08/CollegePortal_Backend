const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_jwt_token_key_12345', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

const register = async (req, res, next) => {
  try {
    const { name, email, password, role, branch, year, semester, bio } = req.body;
    
    // Check if email already exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    // Default to 'student' role if none provided
    const roleName = role || 'student';
    const dbRole = await Role.findOne({ where: { name: roleName } });
    if (!dbRole) {
      return res.status(400).json({ message: `Invalid role: ${roleName}` });
    }
    
    // Create user
    const user = await User.create({
      name,
      email,
      password,
      roleId: dbRole.id,
      branch,
      year: year ? parseInt(year) : null,
      semester: semester ? parseInt(semester) : null,
      bio
    });
    
    // Find newly created user with Role included
    const createdUser = await User.findByPk(user.id, {
      include: { model: Role, as: 'role' }
    });
    
    res.status(201).json({
      user: createdUser,
      token: generateToken(user.id)
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Find user with Role
    const user = await User.findOne({
      where: { email },
      include: { model: Role, as: 'role' }
    });
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    res.json({
      user,
      token: generateToken(user.id)
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res) => {
  res.json(req.user);
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const { name, branch, year, semester, bio, avatar, password } = req.body;
    
    if (name) user.name = name;
    if (branch !== undefined) user.branch = branch;
    if (year !== undefined) user.year = year ? parseInt(year) : null;
    if (semester !== undefined) user.semester = semester ? parseInt(semester) : null;
    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;
    if (password) user.password = password; // bcrypt hooks will handle hashing
    
    await user.save();
    
    const updatedUser = await User.findByPk(user.id, {
      include: { model: Role, as: 'role' }
    });
    
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
};
