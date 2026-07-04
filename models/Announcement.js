const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Announcement = sequelize.define('Announcement', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  postedBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'posted_by'
  }
}, {
  tableName: 'announcements',
  timestamps: true,
  underscored: true
});

module.exports = Announcement;
