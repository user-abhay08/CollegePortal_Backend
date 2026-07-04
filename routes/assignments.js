const express = require('express');
const router = express.Router();
const { getAllAssignments, getAssignmentById, createAssignment, deleteAssignment } = require('../controllers/assignmentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(protect);

router.get('/', getAllAssignments);
router.get('/:id', getAssignmentById);
router.post('/', authorize('faculty'), upload.single('file'), createAssignment);
router.delete('/:id', authorize('faculty', 'admin'), deleteAssignment);

module.exports = router;
