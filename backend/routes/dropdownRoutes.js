const express = require("express");
const router = express.Router();
const {
  getAdminsDropdown,
  getSupervisorsDropdown,
  getStudentsDropdown,
} = require("../controllers/dropdownController");

// Base: /api/dropdown
router.get("/admins", getAdminsDropdown);
router.get("/supervisors/:adminId", getSupervisorsDropdown);
router.get("/students/:supervisorId", getStudentsDropdown);

module.exports = router;
