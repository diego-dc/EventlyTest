import NextAuth, { Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role?: string | null;
    };
  }
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials ?? {};
        if (!email || !password) throw new Error("Missing credentials");

        // Busca el usuario en la base de datos
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) throw new Error("User not found");

        // Compara la contraseña
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) throw new Error("Invalid credentials");

        return {
          id: user.id.toString(),
          username: user.username,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Obtener el rol desde la base de datos
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email ?? undefined },
        });
        token.role = dbUser?.role || "user"; // Añadir rol al token
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role as string; // Añadir rol al session
      return session;
    },
  },
  pages: {
    signIn: "/auth/login", // Página de login personalizada
  },
});
