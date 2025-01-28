import "./globals.css";
import { getServerSession } from "next-auth/next"
import AuthProvider from "@/components/AuthProvider"

import Header from '@/components/Header'
import { Toaster } from "@/components/ui/toaster";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await getServerSession()

  return (
    <html lang="en">
      <body
        className="antialiased"
      >
        <AuthProvider session={session}>
          <Header />
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
