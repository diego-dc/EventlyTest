'use server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

// Create an instance of the Prisma Client.
const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // Parse the request body.
    const body = await req.json();

    // If the request body is null or undefined, respond with a 400 error.
    if (!body) {
      return NextResponse.json(
        { error: 'Request body is null or undefined' },
        { status: 400 },
      );
    }
    // Destructure the request body to extract the required fields.
    const { username, email, password, role } = body;

    // Hash the password for security.
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if the user already exists in the database
    const existingUser = await prisma.user.findUnique({ where: { email } });

    // Respond with an error if the user already exists.
    if (existingUser) {
      console.error('User already exists');
      return NextResponse.json({
        success: false,
        message: 'User already exists',
      });
    }

    // Create the user in the database.
    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword, role },
    });

    // Respond with an error if the user creation failed.
    if (!user) {
      console.error('Error creating user');
      return NextResponse.json({
        success: false,
        message: 'An error occurred while creating the user',
      });
    }

    // Respond with a success message if the user was created successfully.
    return NextResponse.json({ success: true, message: 'User created' });
  } catch (error) {
    // Handle unexpected errors.
    return NextResponse.json({ error: error, message: 'Error creating user' });
  }
}
