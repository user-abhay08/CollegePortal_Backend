const Role = require('./Role');
const User = require('./User');
const Note = require('./Note');
const Assignment = require('./Assignment');
const Announcement = require('./Announcement');

// 1. Role <-> User
Role.hasMany(User, { foreignKey: 'roleId', as: 'users' });
User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });

// 2. User (Faculty) <-> Note
User.hasMany(Note, { foreignKey: 'facultyId', as: 'notes' });
Note.belongsTo(User, { foreignKey: 'facultyId', as: 'faculty' });

// 3. User (Faculty) <-> Assignment
User.hasMany(Assignment, { foreignKey: 'facultyId', as: 'assignments' });
Assignment.belongsTo(User, { foreignKey: 'facultyId', as: 'faculty' });

// 4. User (Faculty/Admin) <-> Announcement
User.hasMany(Announcement, { foreignKey: 'postedBy', as: 'announcements' });
Announcement.belongsTo(User, { foreignKey: 'postedBy', as: 'author' });

module.exports = {
  Role,
  User,
  Note,
  Assignment,
  Announcement
};
