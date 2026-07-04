const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Assignment = sequelize.define('Assignment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  subject: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  branch: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  semester: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fileUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'file_url'
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: false
  },
  facultyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'faculty_id'
  }
}, {
  tableName: 'assignments',
  timestamps: true,
  underscored: true
});

module.exports = Assignment;
