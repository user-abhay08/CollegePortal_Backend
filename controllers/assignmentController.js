const { Assignment, User } = require('../models');
const { Op } = require('sequelize');

const getAllAssignments = async (req, res, next) => {
  try {
    const { branch, semester, subject, search } = req.query;
    const whereClause = {};
    
    if (branch) whereClause.branch = branch;
    if (semester) whereClause.semester = parseInt(semester);
    if (subject) whereClause.subject = subject;
    
    const includeClause = [
      {
        model: User,
        as: 'faculty',
        attributes: ['id', 'name', 'email']
      }
    ];
    
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { subject: { [Op.like]: `%${search}%` } },
        { '$faculty.name$': { [Op.like]: `%${search}%` } }
      ];
    }
    
    const assignments = await Assignment.findAll({
      where: whereClause,
      include: includeClause,
      order: [['deadline', 'ASC']] // Sort by closest deadline
    });
    
    res.json(assignments);
  } catch (error) {
    next(error);
  }
};

const getAssignmentById = async (req, res, next) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id, {
      include: [{ model: User, as: 'faculty', attributes: ['id', 'name', 'email'] }]
    });
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    res.json(assignment);
  } catch (error) {
    next(error);
  }
};

const createAssignment = async (req, res, next) => {
  try {
    const { title, description, subject, branch, semester, deadline, linkUrl } = req.body;
    let fileUrl = linkUrl || null;
    
    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
    }
    
    if (!title || !subject || !branch || !semester || !deadline) {
      return res.status(400).json({ message: 'Title, Subject, Branch, Semester and Deadline are required.' });
    }
    
    const assignment = await Assignment.create({
      title,
      description,
      subject,
      branch,
      semester: parseInt(semester),
      fileUrl,
      deadline: new Date(deadline),
      facultyId: req.user.id
    });
    
    const createdAssignment = await Assignment.findByPk(assignment.id, {
      include: [{ model: User, as: 'faculty', attributes: ['id', 'name', 'email'] }]
    });
    
    res.status(201).json(createdAssignment);
  } catch (error) {
    next(error);
  }
};

const deleteAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    
    if (assignment.facultyId !== req.user.id && req.user.role.name !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this assignment' });
    }
    
    await assignment.destroy();
    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAssignments,
  getAssignmentById,
  createAssignment,
  deleteAssignment
};
