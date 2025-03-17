"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { LayoutDashboard, Users, Building, FileSpreadsheet } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname()

  const sidebarItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Clientes",
      href: "/dashboard/clientes",
      icon: Building,
    },
    {
      title: "Análises",
      href: "/dashboard/analises",
      icon: FileSpreadsheet,
    },
    {
      title: "Usuários",
      href: "/dashboard/usuarios",
      icon: Users,
    },
  ]

  return (
    <>
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="h-screen bg-background border-r shadow-sm relative z-20 dark:border-gray-800"
          >
            <div className="p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="flex items-center justify-between mb-8"
              >
                <Link href="/dashboard" className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-blue-600">NCM IA</span>
                </Link>
              </motion.div>

              <nav className="space-y-1">
                {sidebarItems.map((item) => {
                  const isActive =
                    item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href)

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                        isActive
                          ? "bg-blue-50 text-blue-700 font-medium dark:bg-blue-900/20 dark:text-blue-400"
                          : "text-foreground hover:bg-muted dark:text-foreground dark:hover:bg-muted",
                      )}
                    >
                      <item.icon size={20} />
                      <span>{item.title}</span>
                    </Link>
                  )
                })}
              </nav>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 70, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="h-screen bg-background border-r shadow-sm relative z-20 dark:border-gray-800"
          >
            <div className="p-4">
              <div className="flex flex-col items-center justify-center">
                <Link href="/dashboard" className="mb-8 mt-2">
                  <span className="text-xl font-bold text-blue-600">N</span>
                </Link>
              </div>

              <nav className="flex flex-col items-center space-y-4 mt-4">
                {sidebarItems.map((item) => {
                  const isActive =
                    item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href)

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "p-2 rounded-lg transition-all duration-200",
                        isActive
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                          : "text-foreground hover:bg-muted dark:text-foreground dark:hover:bg-muted",
                      )}
                    >
                      <item.icon size={20} />
                    </Link>
                  )
                })}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

