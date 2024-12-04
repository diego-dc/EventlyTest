"use server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { SignupFormSchema, FormState } from "@/app/lib/definitions";

const prisma = new PrismaClient();

export async function signup(state: FormState, formData: FormData) {
  console.log("Signup form data:", formData);
  // Validar form fields
  const validatedFields = SignupFormSchema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: "user",
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    console.log("Error validating fields:", validatedFields.error.flatten());
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    console.log("Validated fields:", validatedFields.data);
    const { username, email, password, role } = validatedFields.data;

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword, role },
    });

    if (!user) {
      console.error("Error creating user");
      return {
        success: false,
        message: "An error occurred while creating the user",
      };
    }
    console.log("User created:", user);
    return { success: true, message: "User created" };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "Error creating user" };
  }
}
