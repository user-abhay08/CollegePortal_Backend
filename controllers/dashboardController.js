const { User, Role, Note, Assignment, Announcement } = require('../models');
const { Op } = require('sequelize');

const getDashboardCounts = async (req, res, next) => {
  try {
    const roleName = req.user.role.name;
    const result = { role: roleName };
    
    if (roleName === 'student') {
      const { branch, semester } = req.user;
      const filter = {};
      if (branch) filter.branch = branch;
      if (semester) filter.semester = semester;
      
      result.totalNotes = await Note.count({ where: filter });
      
      const assignmentFilter = { ...filter };
      assignmentFilter.deadline = { [Op.gt]: new Date() };
      result.totalAssignments = await Assignment.count({ where: assignmentFilter });
      
      result.totalAnnouncements = await Announcement.count();
      
    } else if (roleName === 'faculty') {
      result.myNotes = await Note.count({ where: { facultyId: req.user.id } });
      result.myAssignments = await Assignment.count({ where: { facultyId: req.user.id } });
      result.myAnnouncements = await Announcement.count({ where: { postedBy: req.user.id } });
      result.totalAnnouncements = await Announcement.count();
      
    } else if (roleName === 'admin') {
      const studentRole = await Role.findOne({ where: { name: 'student' } });
      const facultyRole = await Role.findOne({ where: { name: 'faculty' } });
      
      result.totalStudents = studentRole ? await User.count({ where: { roleId: studentRole.id } }) : 0;
      result.totalFaculty = facultyRole ? await User.count({ where: { roleId: facultyRole.id } }) : 0;
      result.totalNotes = await Note.count();
      result.totalAssignments = await Assignment.count();
      result.totalAnnouncements = await Announcement.count();
    }
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardCounts
};
