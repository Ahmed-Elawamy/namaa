require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Admin = require("./models/Admin");
const Supervisor = require("./models/Supervisor");
const Student = require("./models/Student");

const seed = async () => {
  await connectDB();

  // ── Clean existing data ───────────────────────────────────────────────────
  await Student.deleteMany();
  await Supervisor.deleteMany();
  await Admin.deleteMany();
  console.log("🧹 Cleared existing data");

  // ── Seed Admins ───────────────────────────────────────────────────────────
  const admins = await Admin.insertMany([
    { name: "Alice Johnson",  city: "Cairo" },
    { name: "Bob Martinez",   city: "Giza" },
    { name: "Carol Williams", city: "Alexandria" },
  ]);
  console.log(`✅ Created ${admins.length} admins`);

  // ── Seed Supervisors (2 per admin) ────────────────────────────────────────
  const supervisorsData = [];
  admins.forEach((admin, ai) => {
    [1, 2].forEach((si) => {
      supervisorsData.push({
        name:    `Supervisor ${ai + 1}-${si}`,
        city:    `City ${ai + 1}-${si + 1}`,
        adminId: admin._id,
      });
    });
  });

  const supervisors = await Supervisor.insertMany(supervisorsData);
  console.log(`✅ Created ${supervisors.length} supervisors`);

  // ── Seed Students (4 per supervisor) ─────────────────────────────────────
  const studentsData = [];
  let studentCounter = 1;

  supervisors.forEach((supervisor, svi) => {
    [1, 2, 3, 4].forEach((sti) => {
      studentsData.push({
        name:         `Student ${svi + 1}-${sti}`,
        city:         `City ${studentCounter}`,
        phone:        `+1-555-${String(studentCounter).padStart(4, "0")}`,
        supervisorId: supervisor._id,
      });
      studentCounter++;
    });
  });

  const students = await Student.insertMany(studentsData);
  console.log(`✅ Created ${students.length} students`);

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log("\n📊 Seed Summary:");
  console.log(`   Admins      : ${admins.length}`);
  console.log(`   Supervisors : ${supervisors.length} (${supervisors.length / admins.length} per admin)`);
  console.log(`   Students    : ${students.length} (${students.length / supervisors.length} per supervisor)`);

  await mongoose.disconnect();
  console.log("\n✅ Seeding complete. MongoDB disconnected.");
  process.exit(0);
};

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
