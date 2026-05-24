import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import generateHashedPassword from "../shared/helpers/generators/generateHashedPassword";

dotenv.config();

const prisma = new PrismaClient();

// Hardcoded admin credentials as requested.
const ADMIN_EMAIL = "admin@amihanstaycation.com";
const ADMIN_PASSWORD = "Admin123";
const ADMIN_FIRST_NAME = "Admin";
const ADMIN_LAST_NAME = "Amihan";

async function createAdminAccount() {
  const existingUser = await prisma.users.findUnique({
    where: { email: ADMIN_EMAIL },
  });

  if (existingUser) {
    console.log(`Admin with email ${ADMIN_EMAIL} already exists.`);
    return;
  }

  // Reuse the same hashing helper used in registration flow.
  const hashedPassword = await generateHashedPassword(ADMIN_PASSWORD);

  const admin = await prisma.users.create({
    data: {
      first_name: ADMIN_FIRST_NAME,
      last_name: ADMIN_LAST_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: "admin",
    },
  });

  console.log("Admin account created successfully.");
  console.log(`User ID: ${admin.id}`);
  console.log(`Email: ${admin.email}`);
  console.log(`Role: ${admin.role}`);
}

(async () => {
  try {
    await createAdminAccount();
  } catch (error) {
    console.error("Failed to create admin account:", error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
})();
