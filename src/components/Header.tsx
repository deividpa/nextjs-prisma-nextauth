"use client"

import React from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const Header = () => {
  const { data: session } = useSession()

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-xl font-bold text-gray-800">
              NextAuth Demo
            </Link>
            <nav className="hidden md:flex space-x-4">
              <Link href="/" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Home
              </Link>
              {session && (
                <Link
                  href="/dashboard"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
              )}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <span className="text-gray-700">Bienvenido, {session.user?.name}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar>
                        <AvatarImage
                          src={session.user?.image || "https://github.com/deividpa.png"}
                          alt={session.user?.name || "@deividpa"}
                        />
                        <AvatarFallback>{session.user?.name?.[0]?.toUpperCase() || "DP"}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => signOut()}>Cerrar sesión</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex space-x-4">
                <Button asChild variant="ghost">
                  <Link href="/auth/login">Iniciar sesión</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/register">Registrarse</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header