// prisma/seed.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
  where: { officialEmail: "admin@example.com" },
  update: {},
  create: {
    id: 4,
    employeeId: "SKSY000",
    firstName: "Admin",
    lastName: "User",
    officialEmail: "admin@example.com",
    password: "$2b$10$G8t6Pg/dd2rY7KikXAmSaOV8CsgkRyt63vs7RngrXJVmZmRbFzkPe", // hashed 'admin123'
    role: "ADMIN",
    dob: new Date("1990-01-01"), // ✅ Add this line
    gender: "Male",
    phoneNumber: "1234567890",
    emergencyNumber: "0987654321",
    joiningDate: new Date("2020-01-01"),
    address: "123 Admin St, Admin City, AD 12345",
    department: "Administration",
    designation: "Administrator",
    salary: "50000",
    bankName: "Admin Bank",
    accountNumber: "1234567890",
    ifscCode: "ADMN0001234",
    profilePic: null, // No profile pic for admin
  },
});


  console.log('✅ Admin seeded');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
