import prisma from '../prisma/client.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const login = async (emailOrId, password) => {
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { officialEmail: emailOrId },
        { employeeId: emailOrId }
      ]
    }
  });

  // Check user existence and password presence
  if (!user || !user.password) {
    throw new Error('User not found or password not set yet');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  const token = jwt.sign(
    { id: user.id, employeeId: user.employeeId, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  await prisma.userSession.create({
    data: {
      userId: user.id,
      loginTime: new Date()
    }
  });

  return { token, user };
};
