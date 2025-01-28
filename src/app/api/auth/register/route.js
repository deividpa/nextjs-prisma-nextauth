import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  try {
    const data = await req.json();

    if (!data.email || !data.username || !data.password) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios: email, username o password" },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe por email o username
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email: data.email },
    });

    const existingUserByUsername = await prisma.user.findUnique({
      where: { username: data.username },
    });

    if (existingUserByEmail || existingUserByUsername) {
      return NextResponse.json(
        { error: "El usuario con este email o username ya existe" },
        { status: 400 }
      );
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Crear el usuario en la base de datos
    const newUser = await prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        password: hashedPassword,
      },
    });

    // Retornar el usuario sin la contraseña
    const {password: _, ...user} = newUser;

    return NextResponse.json({ message: 'Usuario registrado exitosamente', user });
  } catch (error) {
    return NextResponse.json(
      { error: error.message},
      { status: 500 }
    );
  }
}