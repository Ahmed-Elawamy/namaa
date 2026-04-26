const Student = require("../models/Student");
const Supervisor = require("../models/Supervisor");

// @desc    Create a new student
// @route   POST /api/students
const createStudent = async (req, res) => {
  try {
    const { name, phone, city, supervisorId } = req.body;

    // Verify the referenced supervisor exists
    const supervisor = await Supervisor.findById(supervisorId).populate(
      "adminId",
      "name"
    );
    if (!supervisor) {
      return res.status(404).json({
        success: false,
        message: "The specified supervisor does not exist",
      });
    }

    const student = await Student.create({ name, phone, city, supervisorId });
    await student.populate({
      path: "supervisorId",
      select: "name city",
      populate: { path: "adminId", select: "name city" },
    });

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all students (optionally filtered by supervisorId)
// @route   GET /api/students
// @route   GET /api/students?supervisorId=xxx
const getAllStudents = async (req, res) => {
  try {
    const filter = {};
    if (req.query.supervisorId) {
      filter.supervisorId = req.query.supervisorId;
    }

    const students = await Student.find(filter)
      .populate({
        path: "supervisorId",
        select: "name city",
        populate: { path: "adminId", select: "name city" },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
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

// @desc    Get students by Supervisor ID
// @route   GET /api/students/by-supervisor/:supervisorId
const getStudentsBySupervisor = async (req, res) => {
  try {
    const supervisor = await Supervisor.findById(
      req.params.supervisorId
    ).populate("adminId", "name");

    if (!supervisor) {
      return res.status(404).json({
        success: false,
        message: "Supervisor not found",
      });
    }

    const students = await Student.find({
      supervisorId: req.params.supervisorId,
    })
      .populate({
        path: "supervisorId",
        select: "name city",
        populate: { path: "adminId", select: "name city" },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: students.length,
      supervisor: { id: supervisor._id, name: supervisor.name },
      data: students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single student by ID
// @route   GET /api/students/:id
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate({
      path: "supervisorId",
      select: "name city",
      populate: { path: "adminId", select: "name city" },
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
const updateStudent = async (req, res) => {
  try {
    const { name, phone, city, supervisorId } = req.body;

    // If changing supervisor, verify the new supervisor exists
    if (supervisorId) {
      const supervisor = await Supervisor.findById(supervisorId);
      if (!supervisor) {
        return res.status(404).json({
          success: false,
          message: "The specified supervisor does not exist",
        });
      }
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { name, phone, city, supervisorId },
      { new: true, runValidators: true }
    ).populate({
      path: "supervisorId",
      select: "name city",
      populate: { path: "adminId", select: "name city" },
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createStudent,
  getAllStudents,
  getStudentsBySupervisor,
  getStudentById,
  updateStudent,
  deleteStudent,
};
