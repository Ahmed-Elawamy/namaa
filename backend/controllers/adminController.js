const Admin = require("../models/Admin");
const Supervisor = require("../models/Supervisor");
const Student = require("../models/Student");

// @desc    Create a new admin
// @route   POST /api/admins
const createAdmin = async (req, res) => {
  try {
    const { name, city } = req.body;

    const admin = await Admin.create({ name, city });

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: admin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all admins
// @route   GET /api/admins
const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().sort({ createdAt: -1 });

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

// @desc    Get a single admin by ID
// @route   GET /api/admins/:id
const getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update admin
// @route   PUT /api/admins/:id
const updateAdmin = async (req, res) => {
  try {
    const { name, city } = req.body;

    const admin = await Admin.findByIdAndUpdate(
      req.params.id,
      { name, city },
      { new: true, runValidators: true }
    );

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Admin updated successfully",
      data: admin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete admin (cascades to supervisors and students)
// @route   DELETE /api/admins/:id
const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // Cascade: find all supervisors under this admin
    const supervisors = await Supervisor.find({ adminId: req.params.id });
    const supervisorIds = supervisors.map((s) => s._id);

    // Cascade: delete all students under those supervisors
    await Student.deleteMany({ supervisorId: { $in: supervisorIds } });

    // Cascade: delete all supervisors
    await Supervisor.deleteMany({ adminId: req.params.id });

    // Finally delete the admin
    await Admin.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: `Admin deleted along with ${supervisors.length} supervisor(s) and their students`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
};
