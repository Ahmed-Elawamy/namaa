const express = require("express");
const router = express.Router();
const {
  createSupervisor,
  getAllSupervisors,
  getSupervisorsByAdmin,
  getSupervisorById,
  updateSupervisor,
  deleteSupervisor,
} = require("../controllers/supervisorController");

// Base: /api/supervisors
router.route("/").get(getAllSupervisors).post(createSupervisor);
router.route("/by-admin/:adminId").get(getSupervisorsByAdmin);
router
  .route("/:id")
  .get(getSupervisorById)
  .put(updateSupervisor)
  .delete(deleteSupervisor);

module.exports = router;
