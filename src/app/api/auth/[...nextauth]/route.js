import NextAuth from "next-auth";
import bcrypt from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Verificar que existan las credenciales
        if (!credentials?.email || !credentials?.password) return null;

        // Buscar el usuario por email en la base de datos
        const userFound = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        // Verificar si el usuario no existe
        if(!userFound) return null;

        // Verificar si la contraseña es correcta
        const isValidPassword = await bcrypt.compare(
          credentials.password,
          userFound.password
        );

        // Si la contraseña no es correcta, retornar null
        if (!isValidPassword) return null;

        // Retornar la sesión del usuario
        return {
          id: userFound.id,
          name: userFound.username,
          email: userFound.email,
        }
      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};