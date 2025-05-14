import type React from "react"
import { ConnectionStatus } from "@/components/connection-status"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/context/auth-context"
import { ProjectsProvider } from "@/context/projects-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <ProjectsProvider>
              {children}
              <Toaster />
              <ConnectionStatus />
            </ProjectsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
