const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { connectDB } = require('./config/database');
const { errorHandler } = require('./middleware/errorMiddleware');
require('dotenv').config();

const app = express();
const port = Number(process.env.PORT) || 5000;
const host = '0.0.0.0';

app.set('trust proxy', 1);

app.use(helmet());
app.use(compression());

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api', apiLimiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static upload files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/dashboard', require('./routes/dashboard'));

// Base route/Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'College Portal API is running smoothly' });
});

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'College Portal API' });
});

// Error handling middleware
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, host, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on ${host}:${port}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
