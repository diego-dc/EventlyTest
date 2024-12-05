import { Session } from 'next-auth';
import { NextAuthOptions } from 'next-auth';

import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import GoogleProvider from 'next-auth/providers/google';

// Initialize Prisma client
const prisma = new PrismaClient();

// Define the auth options
export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      // Define the authorize function
      async authorize(credentials, req) {
        const { email, password } = credentials ?? {};
        if (!email || !password) throw new Error('Missing credentials');

        // Find the user by email
        const user = await prisma.user.findUnique({ where: { email } });

        // If the user is not found, throw an error
        if (!user) throw new Error('User not found');

        // Compare the password with the hashed password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) throw new Error('Invalid credentials');

        // Return the user object
        return {
          id: user.id.toString(),
          username: user.username,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: '/auth/login', // URL login
  },
};
