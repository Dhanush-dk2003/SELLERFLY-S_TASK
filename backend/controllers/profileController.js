import prisma from "../prisma/client.js";

export const getAllProfiles = async (req, res) => {
  try {
    const profiles = await prisma.user.findMany();
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getProfileById = async (req, res) => {
  const { employeeId } = req.params;

  try {
    const profile = await prisma.user.findUnique({
      where: { employeeId },
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const updateProfile = async (req, res) => {
  const { employeeId } = req.params;
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

  try {
    const updated = await prisma.user.update({
      where: { employeeId },
      data: {
        firstName,
        lastName,
        dob: dob ? new Date(dob) : undefined,
        joiningDate: joiningDate ? new Date(joiningDate) : undefined,

        gender,
        bloodGroup,

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
        ...(req.file && { profilePic: req.file.filename }),
      },
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
export const deleteProfile = async (req, res) => {
  const { employeeId } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { employeeId },
      select: { id: true },
    });

    if (!user) return res.status(404).json({ message: "Profile not found" });

    // Step 1: Delete related UserSessions
    await prisma.userSession.deleteMany({
      where: { userId: user.id },
    });

    // Step 2: Delete user
    await prisma.user.delete({
      where: { employeeId },
    });

    res.json({ message: "Profile deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


