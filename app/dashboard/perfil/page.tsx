"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Camera, Crown, ArrowRight, Download, CheckCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  location: z.string().optional(),
})

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(6, { message: "Senha atual deve ter pelo menos 6 caracteres" }),
    newPassword: z.string().min(6, { message: "Nova senha deve ter pelo menos 6 caracteres" }),
    confirmPassword: z.string().min(6, { message: "Confirme a nova senha" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })

type ProfileFormValues = z.infer<typeof profileFormSchema>
type PasswordFormValues = z.infer<typeof passwordFormSchema>

// Tipo para histórico de pagamentos
interface PaymentHistory {
  id: string
  date: string
  amount: string
  status: "success" | "pending" | "failed"
  invoice: string
  plan: string
}

export default function PerfilPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isPasswordLoading, setIsPasswordLoading] = useState(false)

  // Dados do plano atual
  const currentPlan = {
    name: "Profissional",
    price: "R$ 99,90/mês",
    renewalDate: "15/07/2023",
    status: "Ativo",
  }

  // Histórico de pagamentos
  const paymentHistory: PaymentHistory[] = [
    {
      id: "1",
      date: "15/06/2023",
      amount: "R$ 99,90",
      status: "success",
      invoice: "INV-2023-0615",
      plan: "Profissional",
    },
    {
      id: "2",
      date: "15/05/2023",
      amount: "R$ 99,90",
      status: "success",
      invoice: "INV-2023-0515",
      plan: "Profissional",
    },
    {
      id: "3",
      date: "15/04/2023",
      amount: "R$ 49,90",
      status: "success",
      invoice: "INV-2023-0415",
      plan: "Básico",
    },
    {
      id: "4",
      date: "15/03/2023",
      amount: "R$ 49,90",
      status: "success",
      invoice: "INV-2023-0315",
      plan: "Básico",
    },
  ]

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "João Silva",
      email: "joao.silva@exemplo.com",
      location: "São Paulo, Brasil",
    },
  })

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  function onProfileSubmit(data: ProfileFormValues) {
    setIsLoading(true)

    // Simulando atualização de perfil
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      })
    }, 1000)
  }

  function onPasswordSubmit(data: PasswordFormValues) {
    setIsPasswordLoading(true)

    // Simulando atualização de senha
    setTimeout(() => {
      setIsPasswordLoading(false)
      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      toast({
        title: "Senha atualizada",
        description: "Sua senha foi atualizada com sucesso.",
      })
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-blue-600">Perfil</h1>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="password">Senha</TabsTrigger>
            <TabsTrigger value="plan">Plano</TabsTrigger>
            <TabsTrigger value="payments">Pagamentos</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Perfil</CardTitle>
                <CardDescription>Atualize suas informações pessoais.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
                        <AvatarFallback>JS</AvatarFallback>
                      </Avatar>
                      <Button
                        size="icon"
                        variant="outline"
                        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                      >
                        <Camera size={14} />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">JPG, GIF ou PNG. Máximo 1MB.</p>
                  </div>

                  <div className="flex-1">
                    <Form {...profileForm}>
                      <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                        <FormField
                          control={profileForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700">Nome</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700">Email</FormLabel>
                              <FormControl>
                                <Input {...field} type="email" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700">Localização</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex justify-end">
                          <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                            {isLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Salvando...
                              </>
                            ) : (
                              "Salvar alterações"
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="password" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Alterar Senha</CardTitle>
                <CardDescription>Atualize sua senha para manter sua conta segura.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Senha Atual</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Separator />

                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Nova Senha</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Confirmar Nova Senha</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end">
                      <Button type="submit" disabled={isPasswordLoading} className="bg-blue-600 hover:bg-blue-700">
                        {isPasswordLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Atualizando...
                          </>
                        ) : (
                          "Atualizar senha"
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="plan" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Seu Plano Atual</CardTitle>
                <CardDescription>Informações sobre seu plano de assinatura.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold">{currentPlan.name}</h3>
                        <Crown className="h-5 w-5 text-amber-500" />
                      </div>
                      <p className="text-gray-500 mt-1">
                        {currentPlan.price} • Próxima renovação em {currentPlan.renewalDate}
                      </p>
                      <Badge className="mt-3 bg-green-100 text-green-800 hover:bg-green-100">
                        {currentPlan.status}
                      </Badge>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => router.push("/planos")}>
                      Fazer upgrade
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-3">Recursos incluídos no seu plano:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Até 1.000 clientes</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Até 10 usuários</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Suporte por email e chat</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Relatórios avançados</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Pagamentos</CardTitle>
                <CardDescription>Visualize seus pagamentos anteriores e baixe faturas.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Plano</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Fatura</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentHistory.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{payment.date}</TableCell>
                        <TableCell>{payment.plan}</TableCell>
                        <TableCell>{payment.amount}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              payment.status === "success"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : payment.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                  : "bg-red-100 text-red-800 hover:bg-red-100"
                            }
                          >
                            {payment.status === "success"
                              ? "Pago"
                              : payment.status === "pending"
                                ? "Pendente"
                                : "Falhou"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}

