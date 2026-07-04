const express = require('express');
const router = express.Router();
const { getAllAnnouncements, createAnnouncement, deleteAnnouncement } = require('../controllers/announcementController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getAllAnnouncements);
router.post('/', authorize('faculty', 'admin'), createAnnouncement);
router.delete('/:id', authorize('faculty', 'admin'), deleteAnnouncement);

module.exports = router;
