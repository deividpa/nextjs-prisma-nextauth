'use client'

import React from 'react'
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import Link from 'next/link'
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
});

type LoginFormValues = z.infer<typeof loginSchema>

const LoginPage = () => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const router = useRouter();
  
  const { toast } = useToast();

  const onSubmit = async (data: LoginFormValues) => {
 
    // Loguear al usuario
    const response = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    // Validar si es undefined
    if (!response) {
      toast({
        title: "Error al iniciar sesión",
        description: "Ocurrió un error al iniciar sesión.",
        variant: "warning",
      });
      return;
    }

    // Validar si hubo error
    if (response?.error) {
      toast({
        title: "Error al iniciar sesión",
        description: "Las credenciales son incorrectas.",
        variant: "warning",
      });
      return;
    }

    // Si no hubo error, mostrar mensaje de éxito
    toast({
      title: "Inicio de sesión exitoso",
      description: "Has iniciado sesión correctamente.",
      variant: "success",
    });

    // Redirigir al usuario a la página de inicio
    router.push("/dashboard");

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Iniciar sesión</CardTitle>
          <CardDescription className="text-center">
            Ingresa tus credenciales para acceder a tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input type="email" id="email" placeholder="tu@ejemplo.com" {...register("email")} />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input type="password" id="password" placeholder="••••••••" required {...register("password")} />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full">
              Iniciar sesión
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-gray-500 text-center">
            ¿No tienes una cuenta?{' '}
            <Link href="/auth/register" className="text-blue-600 hover:underline">
              Regístrate
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default LoginPage