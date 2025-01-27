"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

// Define a schema for the form
const registerSchema = z
  .object({
    email: z.string().email({ message: "Email inválido" }),
    username: z.string().min(3, { message: "El nombre de usuario debe tener al menos 3 caracteres" }),
    password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
    repeatPassword: z.string(),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Las contraseñas no coinciden",
    path: ["repeatPassword"],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  const { toast } = useToast()

  const onSubmit = (data: RegisterFormValues) => {
    // Here I would send the data to the server
    console.log(data)
    toast({
      title: "Registro exitoso",
      description: "Tu cuenta ha sido creada correctamente.",
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Crear cuenta</CardTitle>
          <CardDescription className="text-center">Ingresa tus datos para registrarte</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input type="email" id="email" placeholder="tu@ejemplo.com" {...register("email")} />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Nombre de usuario</Label>
              <Input type="text" id="username" placeholder="usuario123" {...register("username")} />
              {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input type="password" id="password" placeholder="••••••••" {...register("password")} />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="repeatPassword">Repetir contraseña</Label>
              <Input type="password" id="repeatPassword" placeholder="••••••••" {...register("repeatPassword")} />
              {errors.repeatPassword && <p className="text-red-500 text-sm">{errors.repeatPassword.message}</p>}
            </div>
            <Button type="submit" className="w-full">
              Registrarse
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-gray-500 text-center w-full">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/auth/login" className="text-blue-600 hover:underline">
              Inicia sesión
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default RegisterPage