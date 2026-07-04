const { Note, User } = require('../models');
const { Op } = require('sequelize');

const getAllNotes = async (req, res, next) => {
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
    
    const notes = await Note.findAll({
      where: whereClause,
      include: includeClause,
      order: [['created_at', 'DESC']]
    });
    
    res.json(notes);
  } catch (error) {
    next(error);
  }
};

const getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findByPk(req.params.id, {
      include: [{ model: User, as: 'faculty', attributes: ['id', 'name', 'email'] }]
    });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json(note);
  } catch (error) {
    next(error);
  }
};

const createNote = async (req, res, next) => {
  try {
    const { title, description, subject, branch, semester, linkUrl } = req.body;
    let fileUrl = linkUrl || null;
    
    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
    }
    
    if (!title || !subject || !branch || !semester) {
      return res.status(400).json({ message: 'Title, Subject, Branch and Semester are required.' });
    }
    
    const note = await Note.create({
      title,
      description,
      subject,
      branch,
      semester: parseInt(semester),
      fileUrl,
      facultyId: req.user.id
    });
    
    const createdNote = await Note.findByPk(note.id, {
      include: [{ model: User, as: 'faculty', attributes: ['id', 'name', 'email'] }]
    });
    
    res.status(201).json(createdNote);
  } catch (error) {
    next(error);
  }
};

const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findByPk(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    if (note.facultyId !== req.user.id && req.user.role.name !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this note' });
    }
    
    await note.destroy();
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllNotes,
  getNoteById,
  createNote,
  deleteNote
};
