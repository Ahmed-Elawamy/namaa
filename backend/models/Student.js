const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Student phone is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "Student city is required"],
      trim: true,
    },
    supervisorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supervisor",
      required: [true, "Supervisor reference is required"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Student", studentSchema);
