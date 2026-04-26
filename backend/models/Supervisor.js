const mongoose = require("mongoose");

const supervisorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Supervisor name is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "Supervisor city is required"],
      trim: true,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: [true, "Admin reference is required"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Supervisor", supervisorSchema);
