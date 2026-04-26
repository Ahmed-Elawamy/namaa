const Supervisor = require("../models/Supervisor");
const Admin = require("../models/Admin");
const Student = require("../models/Student");

// @desc    Create a new supervisor
// @route   POST /api/supervisors
const createSupervisor = async (req, res) => {
  try {
    const { name, city, adminId } = req.body;

    // Verify the referenced admin exists
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "The specified admin does not exist",
      });
    }

    const supervisor = await Supervisor.create({ name, city, adminId });
    await supervisor.populate("adminId", "name city");

    res.status(201).json({
      success: true,
      message: "Supervisor created successfully",
      data: supervisor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all supervisors (optionally filtered by adminId)
// @route   GET /api/supervisors
// @route   GET /api/supervisors?adminId=xxx
const getAllSupervisors = async (req, res) => {
  try {
    const filter = {};
    if (req.query.adminId) {
      filter.adminId = req.query.adminId;
    }

    const supervisors = await Supervisor.find(filter)
      .populate("adminId", "name city")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
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

// @desc    Get supervisors by Admin ID
// @route   GET /api/supervisors/by-admin/:adminId
const getSupervisorsByAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.adminId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const supervisors = await Supervisor.find({ adminId: req.params.adminId })
      .populate("adminId", "name city")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: supervisors.length,
      admin: { id: admin._id, name: admin.name },
      data: supervisors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single supervisor by ID
// @route   GET /api/supervisors/:id
const getSupervisorById = async (req, res) => {
  try {
    const supervisor = await Supervisor.findById(req.params.id).populate(
      "adminId",
      "name city"
    );

    if (!supervisor) {
      return res.status(404).json({
        success: false,
        message: "Supervisor not found",
      });
    }

    res.status(200).json({
      success: true,
      data: supervisor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update supervisor
// @route   PUT /api/supervisors/:id
const updateSupervisor = async (req, res) => {
  try {
    const { name, city, adminId } = req.body;

    // If changing admin, verify the new admin exists
    if (adminId) {
      const admin = await Admin.findById(adminId);
      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "The specified admin does not exist",
        });
      }
    }

    const supervisor = await Supervisor.findByIdAndUpdate(
      req.params.id,
      { name, city, adminId },
      { new: true, runValidators: true }
    ).populate("adminId", "name city");

    if (!supervisor) {
      return res.status(404).json({
        success: false,
        message: "Supervisor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Supervisor updated successfully",
      data: supervisor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete supervisor (cascades to students)
// @route   DELETE /api/supervisors/:id
const deleteSupervisor = async (req, res) => {
  try {
    const supervisor = await Supervisor.findById(req.params.id);

    if (!supervisor) {
      return res.status(404).json({
        success: false,
        message: "Supervisor not found",
      });
    }

    // Cascade: delete all students under this supervisor
    const deletedStudents = await Student.deleteMany({
      supervisorId: req.params.id,
    });

    await Supervisor.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: `Supervisor deleted along with ${deletedStudents.deletedCount} student(s)`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createSupervisor,
  getAllSupervisors,
  getSupervisorsByAdmin,
  getSupervisorById,
  updateSupervisor,
  deleteSupervisor,
};
