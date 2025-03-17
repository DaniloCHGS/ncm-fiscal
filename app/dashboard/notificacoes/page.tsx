"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Check, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

interface Notification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  type: "info" | "warning" | "success"
}

export default function NotificacoesPage() {
  const searchParams = useSearchParams()
  const notificationId = searchParams.get("id")

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Nova mensagem recebida",
      message:
        "Você recebeu uma nova mensagem do usuário João Silva. Clique aqui para visualizar a mensagem completa e responder se necessário. Lembre-se de que respostas rápidas melhoram a satisfação do cliente.",
      time: "Há 5 minutos",
      read: false,
      type: "info",
    },
    {
      id: "2",
      title: "Atualização do sistema",
      message:
        "O sistema será atualizado hoje às 22h. Pode haver instabilidade durante o processo. Recomendamos que finalize todas as suas atividades antes desse horário para evitar perda de dados. A atualização deve durar aproximadamente 30 minutos.",
      time: "Há 2 horas",
      read: false,
      type: "warning",
    },
    {
      id: "3",
      title: "Novo cliente cadastrado",
      message:
        "O cliente Empresa XYZ foi cadastrado com sucesso. Todos os dados foram validados e o cliente já pode começar a utilizar o sistema. Um email de boas-vindas foi enviado automaticamente.",
      time: "Há 1 dia",
      read: true,
      type: "success",
    },
    {
      id: "4",
      title: "Lembrete de reunião",
      message:
        "Você tem uma reunião agendada para amanhã às 10h com a equipe de desenvolvimento para discutir os novos recursos do sistema. Não se esqueça de preparar sua apresentação e revisar os tópicos a serem discutidos.",
      time: "Há 3 dias",
      read: true,
      type: "info",
    },
    {
      id: "5",
      title: "Fatura gerada",
      message:
        "A fatura do mês de Junho foi gerada e está disponível para download na seção financeira. O vencimento é dia 15 e o pagamento pode ser feito por boleto bancário ou cartão de crédito diretamente pela plataforma.",
      time: "Há 1 semana",
      read: true,
      type: "info",
    },
  ])

  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    if (notificationId) {
      const notification = notifications.find((n) => n.id === notificationId)
      if (notification) {
        setSelectedNotification(notification)
        setIsDialogOpen(true)

        // Marcar como lida se não estiver
        if (!notification.read) {
          markAsRead(notification.id)
        }
      }
    }
  }, [notificationId])

  const unreadNotifications = notifications.filter((notification) => !notification.read)
  const readNotifications = notifications.filter((notification) => notification.read)

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))

    if (selectedNotification && selectedNotification.id === id) {
      setSelectedNotification(null)
      setIsDialogOpen(false)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "info":
        return <Bell className="h-5 w-5 text-blue-500" />
      case "warning":
        return <Bell className="h-5 w-5 text-amber-500" />
      case "success":
        return <Bell className="h-5 w-5 text-green-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification)
    setIsDialogOpen(true)

    // Marcar como lida se não estiver
    if (!notification.read) {
      markAsRead(notification.id)
    }
  }

  const NotificationItem = ({ notification }: { notification: Notification }) => (
    <div
      className={cn(
        "flex items-start gap-4 p-4 border-b last:border-0 transition-colors cursor-pointer hover:bg-gray-50",
        !notification.read && "bg-blue-50 hover:bg-blue-100",
      )}
      onClick={() => handleNotificationClick(notification)}
    >
      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
        {getNotificationIcon(notification.type)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className={cn("text-sm font-medium", !notification.read && "font-semibold")}>{notification.title}</h4>
          <span className="text-xs text-gray-500 whitespace-nowrap">{notification.time}</span>
        </div>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
        {!notification.read && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              markAsRead(notification.id)
            }}
            className="h-8 w-8"
          >
            <Check className="h-4 w-4" />
            <span className="sr-only">Marcar como lida</span>
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation()
            deleteNotification(notification.id)
          }}
          className="h-8 w-8 text-red-500"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Excluir</span>
        </Button>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-blue-600">Notificações</h1>
        {unreadNotifications.length > 0 && (
          <Button
            variant="outline"
            onClick={markAllAsRead}
            className="text-blue-600 border-blue-600 hover:bg-blue-50 w-full sm:w-auto"
          >
            <Check className="mr-2 h-4 w-4" />
            Marcar todas como lidas
          </Button>
        )}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Tabs defaultValue="unread" className="space-y-4">
          <TabsList>
            <TabsTrigger value="unread">
              Não lidas
              {unreadNotifications.length > 0 && (
                <span className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 text-blue-600 text-xs font-medium">
                  {unreadNotifications.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="read">Lidas</TabsTrigger>
            <TabsTrigger value="all">Todas</TabsTrigger>
          </TabsList>

          <TabsContent value="unread">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Notificações não lidas</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {unreadNotifications.length > 0 ? (
                  <div className="divide-y">
                    {unreadNotifications.map((notification) => (
                      <NotificationItem key={notification.id} notification={notification} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Bell className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">Nenhuma notificação não lida</h3>
                    <p className="text-sm text-gray-500 mt-1">Você não tem notificações não lidas no momento.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="read">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Notificações lidas</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {readNotifications.length > 0 ? (
                  <div className="divide-y">
                    {readNotifications.map((notification) => (
                      <NotificationItem key={notification.id} notification={notification} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Bell className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">Nenhuma notificação lida</h3>
                    <p className="text-sm text-gray-500 mt-1">Você não tem notificações lidas no momento.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Todas as notificações</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {notifications.length > 0 ? (
                  <div className="divide-y">
                    {notifications.map((notification) => (
                      <NotificationItem key={notification.id} notification={notification} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Bell className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">Nenhuma notificação</h3>
                    <p className="text-sm text-gray-500 mt-1">Você não tem notificações no momento.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Diálogo para exibir o conteúdo completo da notificação */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          {selectedNotification && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                      selectedNotification.type === "info" && "bg-blue-100",
                      selectedNotification.type === "warning" && "bg-amber-100",
                      selectedNotification.type === "success" && "bg-green-100",
                    )}
                  >
                    {getNotificationIcon(selectedNotification.type)}
                  </div>
                  <DialogTitle>{selectedNotification.title}</DialogTitle>
                </div>
                <DialogDescription className="text-right text-xs text-gray-500">
                  {selectedNotification.time}
                </DialogDescription>
              </DialogHeader>
              <div className="text-sm text-gray-700 mt-2">{selectedNotification.message}</div>
              <DialogFooter className="flex sm:justify-between gap-3 sm:gap-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteNotification(selectedNotification.id)}
                  className="w-full sm:w-auto"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir
                </Button>
                <Button
                  size="sm"
                  onClick={() => setIsDialogOpen(false)}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                >
                  <Check className="mr-2 h-4 w-4" />
                  OK
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

