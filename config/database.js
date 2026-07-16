const mysql2 = require('mysql2');
console.log('mysql2 loaded:', mysql2 ? 'YES' : 'NO');

const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = process.env.DB_URL
  ? new Sequelize(process.env.DB_URL, {
      dialect: 'mysql',
      logging: false,
      define: {
        timestamps: true,
        underscored: true
      },
      dialectOptions: process.env.DB_SSL === 'true' ? {
        ssl: {
          rejectUnauthorized: false
        }
      } : {}
    })
  : new Sequelize(
      process.env.DB_NAME || 'college_portal',
      process.env.DB_USER || 'root',
      process.env.DB_PASSWORD || 'root',
      {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: false,
        define: {
          timestamps: true,
          underscored: true
        },
        dialectOptions: process.env.DB_SSL === 'true' ? {
          ssl: {
            rejectUnauthorized: false
          }
        } : {}
      }
    );

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL Database connected successfully via Sequelize');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
