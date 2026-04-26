const express = require("express");
const router = express.Router();
const {
  createStudent,
  getAllStudents,
  getStudentsBySupervisor,
  getStudentById,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");

// Base: /api/students
router.route("/").get(getAllStudents).post(createStudent);
router.route("/by-supervisor/:supervisorId").get(getStudentsBySupervisor);
router
  .route("/:id")
  .get(getStudentById)
  .put(updateStudent)
  .delete(deleteStudent);

module.exports = router;
