import prisma from "../prisma/client.js";
import multer from "multer";
import fs from "fs";
import path from "path";

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
export const upload = multer({ storage });
export const getNextEmployeeId = async (req, res) => {
  const lastUser = await prisma.user.findFirst({ orderBy: { id: 'desc' } });

  let nextId = 'SKSY001';
  if (lastUser?.employeeId) {
    const lastNumber = parseInt(lastUser.employeeId.slice(4));
    const newNumber = (lastNumber + 1).toString().padStart(3, '0');
    nextId = `SKSY${newNumber}`;
  }

  res.json({ nextId });
};

// @route   POST /api/users/create
// @access  Admin
export const createUserProfile = async (req, res) => {
  try {
    // Generate next employeeId like SKSY001, SKSY002
    const lastUser = await prisma.user.findFirst({
      orderBy: { id: 'desc' },
    });

    let nextId = 'SKSY001';
    if (lastUser?.employeeId) {
      const lastNumber = parseInt(lastUser.employeeId.slice(4));
      const newNumber = (lastNumber + 1).toString().padStart(3, '0');
      nextId = `SKSY${newNumber}`;
    }

    const {
      firstName,
      lastName,
      dob,
      gender,
      bloodGroup,
      joiningDate,
      phoneNumber,
      emergencyNumber,
      officialEmail,
      personalEmail,
      address,
      role,
      department,
      designation,
      salary,
      bankName,
      accountNumber,
      ifscCode,
    } = req.body;

    const profilePic = req.file ? req.file.filename : null;

    // Ensure officialEmail is unique
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ employeeId: nextId }, { officialEmail }],
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Employee ID or Email already exists" });
    }

    const newUser = await prisma.user.create({
      data: {
        employeeId: nextId,
        firstName,
        lastName,
        dob: new Date(dob),
        gender,
        bloodGroup,
        joiningDate: new Date(joiningDate),
        phoneNumber,
        emergencyNumber,
        officialEmail,
        personalEmail,
        address,
        role,
        department,
        designation,
        salary,
        bankName,
        accountNumber,
        ifscCode,
        profilePic,
      },
    });

    res.status(201).json({ message: "User profile created successfully", user: newUser });
  } catch (error) {
    console.error("Create Profile Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
