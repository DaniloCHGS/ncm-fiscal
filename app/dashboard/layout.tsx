"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { ThemeProvider } from "next-themes"
import Sidebar from "@/components/dashboard/sidebar"
import Topbar from "@/components/dashboard/topbar"
import Footer from "@/components/dashboard/footer"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMounted, setIsMounted] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    setIsMounted(true)

    // Fechar a sidebar automaticamente em telas menores
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }

    // Configurar no carregamento inicial
    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  if (!isMounted) {
    return null
  }

  const getCurrentModule = () => {
    // Função placeholder para obter o módulo atual
    // Substitua pela lógica real para determinar o módulo
    return "Dashboard"
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="h-screen flex bg-background">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar isSidebarOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>

          <Footer />
        </div>
      </div>
    </ThemeProvider>
  )
}

