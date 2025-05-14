"use client"

import type React from "react"

import { ProjectsProvider } from "@/context/projects-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProjectsProvider>{children}</ProjectsProvider>
}
