const { Announcement, User } = require('../models');

const getAllAnnouncements = async (req, res, next) => {
  try {
    const announcements = await Announcement.findAll({
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(announcements);
  } catch (error) {
    next(error);
  }
};

const createAnnouncement = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    
    const announcement = await Announcement.create({
      title,
      content,
      postedBy: req.user.id
    });
    
    const createdAnnouncement = await Announcement.findByPk(announcement.id, {
      include: [{ model: User, as: 'author', attributes: ['id', 'name', 'email'] }]
    });
    
    res.status(201).json(createdAnnouncement);
  } catch (error) {
    next(error);
  }
};

const deleteAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findByPk(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    
    if (announcement.postedBy !== req.user.id && req.user.role.name !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this announcement' });
    }
    
    await announcement.destroy();
    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAnnouncements,
  createAnnouncement,
  deleteAnnouncement
};
