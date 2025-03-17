"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, Menu, Search, User, ChevronDown, LogOut, Settings, UserCircle, Crown, HelpCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface TopbarProps {
  isSidebarOpen: boolean
  toggleSidebar: () => void
}

// Tipo para notificação
interface Notification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  type: "info" | "warning" | "success"
}

export default function Topbar({ isSidebarOpen, toggleSidebar }: TopbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [showSearch, setShowSearch] = useState(false)

  // Notificações de exemplo
  const notifications: Notification[] = [
    {
      id: "1",
      title: "Nova mensagem recebida",
      message: "Você recebeu uma nova mensagem do usuário João Silva.",
      time: "Há 5 minutos",
      read: false,
      type: "info",
    },
    {
      id: "2",
      title: "Atualização do sistema",
      message: "O sistema será atualizado hoje às 22h. Pode haver instabilidade durante o processo.",
      time: "Há 2 horas",
      read: false,
      type: "warning",
    },
    {
      id: "3",
      title: "Novo cliente cadastrado",
      message: "O cliente Empresa XYZ foi cadastrado com sucesso.",
      time: "Há 1 dia",
      read: true,
      type: "success",
    },
  ]

  const unreadCount = notifications.filter((n) => !n.read).length

  // Função para obter o nome do módulo atual com base no pathname
  const getCurrentModule = () => {
    if (pathname === "/dashboard") return "Dashboard"

    const segments = pathname.split("/")
    if (segments.length > 2) {
      const module = segments[2]
      return module.charAt(0).toUpperCase() + module.slice(1)
    }

    return "Dashboard"
  }

  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-4 sticky top-0 z-10 dark:border-gray-800">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2">
          <Menu size={20} />
        </Button>

        <AnimatePresence mode="wait">
          <motion.h1
            key={getCurrentModule()}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="text-xl font-semibold text-foreground"
          >
            {getCurrentModule()}
          </motion.h1>
        </AnimatePresence>
      </div>

      <div className="flex items-center space-x-2">
        <AnimatePresence>
          {showSearch ? (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 250, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <Input placeholder="Pesquisar..." className="pr-8" autoFocus onBlur={() => setShowSearch(false)} />
              <Search size={18} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </motion.div>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setShowSearch(true)}>
              <Search size={20} />
            </Button>
          )}
        </AnimatePresence>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-blue-600">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex justify-between items-center">
              <span>Notificações</span>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-blue-600 h-auto py-1"
                  onClick={() => router.push("/dashboard/notificacoes")}
                >
                  Marcar todas como lidas
                </Button>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className={cn("cursor-pointer py-3", !notification.read && "bg-blue-50 dark:bg-blue-900/20")}
                    onClick={() => router.push(`/dashboard/notificacoes?id=${notification.id}`)}
                  >
                    <div className="flex items-start gap-2">
                      <div
                        className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                          notification.type === "info" && "bg-blue-100 dark:bg-blue-900/50",
                          notification.type === "warning" && "bg-amber-100 dark:bg-amber-900/50",
                          notification.type === "success" && "bg-green-100 dark:bg-green-900/50",
                        )}
                      >
                        <Bell
                          size={14}
                          className={cn(
                            notification.type === "info" && "text-blue-600 dark:text-blue-400",
                            notification.type === "warning" && "text-amber-600 dark:text-amber-400",
                            notification.type === "success" && "text-green-600 dark:text-green-400",
                          )}
                        />
                      </div>
                      <div>
                        <p className={cn("text-sm", !notification.read ? "font-medium" : "font-normal")}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
                        <p className="text-xs text-muted-foreground/70 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="py-4 text-center text-sm text-muted-foreground">Nenhuma notificação</div>
              )}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer justify-center"
              onClick={() => router.push("/dashboard/notificacoes")}
            >
              <span className="text-sm text-blue-600">Ver todas</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <User size={16} />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">João Silva</p>
                <p className="text-xs text-muted-foreground">Administrador</p>
              </div>
              <ChevronDown size={16} className="hidden md:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/planos")}>
              <Crown className="mr-2 h-4 w-4 text-amber-500" />
              <span>Upgrade</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/dashboard/perfil")}>
              <UserCircle className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/dashboard/configuracoes")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Suporte</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-red-600 focus:text-red-600"
              onClick={() => router.push("/")}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

