const express = require('express');
const router = express.Router();
const { getAllNotes, getNoteById, createNote, deleteNote } = require('../controllers/noteController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(protect);

router.get('/', getAllNotes);
router.get('/:id', getNoteById);
router.post('/', authorize('faculty'), upload.single('file'), createNote);
router.delete('/:id', authorize('faculty', 'admin'), deleteNote);

module.exports = router;
