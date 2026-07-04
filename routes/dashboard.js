const express = require('express');
const router = express.Router();
const { getDashboardCounts } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.get('/counts', protect, getDashboardCounts);

module.exports = router;
