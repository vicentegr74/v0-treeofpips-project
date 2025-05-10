import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "next-themes"
import { MobileNavigation } from "@/components/mobile-navigation"
import { ProjectsProvider } from "@/context/projects-context"
import { AuthProvider } from "@/context/auth-context"
import { Toaster } from "@/components/ui/toaster"
import { Footer } from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Tree of Pips - El árbol de los Logros del Trading",
  description: "Visualiza y gestiona tus metas financieras en el mundo del trading",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Tree of Pips",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#166534" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            <ProjectsProvider>
              <div className="flex flex-col min-h-screen">
                <MobileNavigation />
                <main className="flex-1 container mx-auto px-4 pb-16 pt-4 mt-8">{children}</main>
                <Footer />
              </div>
              <Toaster />
            </ProjectsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
