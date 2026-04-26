const Admin = require("../models/Admin");
const Supervisor = require("../models/Supervisor");
const Student = require("../models/Student");

// @desc    Get all admins for dropdown
// @route   GET /api/dropdown/admins
const getAdminsDropdown = async (req, res) => {
  try {
    const admins = await Admin.find({}, "_id name city").sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: admins.length,
      data: admins,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get supervisors under a specific admin (for dropdown)
// @route   GET /api/dropdown/supervisors/:adminId
const getSupervisorsDropdown = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.adminId, "_id name");
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const supervisors = await Supervisor.find(
      { adminId: req.params.adminId },
      "_id name city"
    ).sort({ name: 1 });

    res.status(200).json({
      success: true,
      admin: { id: admin._id, name: admin.name },
      count: supervisors.length,
      data: supervisors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get students under a specific supervisor (for dropdown)
// @route   GET /api/dropdown/students/:supervisorId
const getStudentsDropdown = async (req, res) => {
  try {
    const supervisor = await Supervisor.findById(
      req.params.supervisorId,
      "_id name"
    );
    if (!supervisor) {
      return res.status(404).json({
        success: false,
        message: "Supervisor not found",
      });
    }

    const students = await Student.find(
      { supervisorId: req.params.supervisorId },
      "_id name city phone"
    ).sort({ name: 1 });

    res.status(200).json({
      success: true,
      supervisor: { id: supervisor._id, name: supervisor.name },
      count: students.length,
      data: students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAdminsDropdown,
  getSupervisorsDropdown,
  getStudentsDropdown,
};
