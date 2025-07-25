import prisma from '../prisma/client.js';

export const getAllProfiles = async (req, res) => {
  try {
    const profiles = await prisma.user.findMany();
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProfileById = async (req, res) => {
  const { employeeId } = req.params;
  try {
    const profile = await prisma.user.findUnique({ where: { employeeId } });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProfile = async (req, res) => {
  const { employeeId } = req.params;
  try {
    const updated = await prisma.user.update({
      where: { employeeId },
      data: req.body,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteProfile = async (req, res) => {
  const { employeeId } = req.params;
  try {
    await prisma.user.delete({ where: { employeeId } });
    res.json({ message: 'Profile deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
