'use server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    console.log('Creating user');
    const body = await req.json();

    console.log('Request Body:', body);
    if (!body) {
      return NextResponse.json(
        { error: 'Request body is null or undefined' },
        { status: 400 },
      );
    }
    const { username, email, password, role } = body;

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Verificar si el usuario ya existe

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      console.error('User already exists');
      return NextResponse.json({
        success: false,
        message: 'User already exists',
      });
    }

    console.log('Creating user');

    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword, role },
    });

    console.log('User:', user);

    if (!user) {
      console.error('Error creating user');
      return NextResponse.json({
        success: false,
        message: 'An error occurred while creating the user',
      });
    }
    return NextResponse.json({ success: true, message: 'User created' });
  } catch (error) {
    return NextResponse.json({ error: error, message: 'Error creating user' });
  }
}
