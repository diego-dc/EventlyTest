import { Session } from 'next-auth';
import { NextAuthOptions } from 'next-auth';

import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import GoogleProvider from 'next-auth/providers/google';

const prisma = new PrismaClient();

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
      async authorize(credentials, req) {
        const { email, password } = credentials ?? {};
        if (!email || !password) throw new Error('Missing credentials');

        // Busca el usuario en la base de datos
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) throw new Error('User not found');

        // Compara la contraseña
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) throw new Error('Invalid credentials');

        console.log(credentials);
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
    signIn: '/auth/login', // Página de login personalizada
  },
};
