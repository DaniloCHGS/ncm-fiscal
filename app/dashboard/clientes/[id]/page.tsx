"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ArrowLeft,
  Building,
  Mail,
  Phone,
  MapPin,
  FileText,
  Download,
  Calendar,
  CheckCircle,
  AlertCircle,
  FileSpreadsheet,
  User,
  Eye,
  MoreHorizontal,
} from "lucide-react"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Tipo para cliente
interface Client {
  id: string
  name: string
  email: string
  phone: string
  address: string
  type: string
  status: string
}

// Tipo para análise
interface Analysis {
  id: string
  date: string
  time: string
  status: "completed" | "processing" | "error"
  fileName: string
  result?: string
}

// Dados de exemplo para clientes
const clientsData: Client[] = [
  {
    id: "1",
    name: "Empresa ABC Ltda",
    email: "contato@empresaabc.com",
    phone: "(11) 3456-7890",
    address: "Av. Paulista, 1000, São Paulo - SP",
    type: "Empresa",
    status: "Ativo",
  },
  {
    id: "2",
    name: "João Empreendimentos",
    email: "joao@empreendimentos.com",
    phone: "(11) 98765-4321",
    address: "Rua Augusta, 500, São Paulo - SP",
    type: "Empresa",
    status: "Ativo",
  },
  {
    id: "3",
    name: "Maria Silva",
    email: "maria.silva@email.com",
    phone: "(11) 91234-5678",
    address: "Rua dos Pinheiros, 100, São Paulo - SP",
    type: "Pessoa Física",
    status: "Inativo",
  },
  {
    id: "4",
    name: "Tech Solutions SA",
    email: "contato@techsolutions.com",
    phone: "(11) 3333-4444",
    address: "Av. Brigadeiro Faria Lima, 3000, São Paulo - SP",
    type: "Empresa",
    status: "Ativo",
  },
  {
    id: "5",
    name: "Carlos Ferreira",
    email: "carlos.ferreira@email.com",
    phone: "(11) 99999-8888",
    address: "Rua Oscar Freire, 200, São Paulo - SP",
    type: "Pessoa Física",
    status: "Ativo",
  },
]

export default function ClientDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const clientId = params.id as string

  const [client, setClient] = useState<Client | null>(null)
  const [analyses, setAnalyses] = useState<Analysis[]>([
    {
      id: "1",
      date: "15/06/2023",
      time: "14:30",
      status: "completed",
      fileName: "produtos_junho_2023.xlsx",
      result: "Relatório de classificação NCM - Junho 2023.pdf",
    },
    {
      id: "2",
      date: "10/05/2023",
      time: "09:15",
      status: "completed",
      fileName: "produtos_maio_2023.xlsx",
      result: "Relatório de classificação NCM - Maio 2023.pdf",
    },
    {
      id: "3",
      date: "20/04/2023",
      time: "16:45",
      status: "error",
      fileName: "produtos_abril_2023.xlsx",
    },
  ])

  useEffect(() => {
    // Simulando busca de dados do cliente
    const foundClient = clientsData.find((c) => c.id === clientId)
    if (foundClient) {
      setClient(foundClient)
    } else {
      router.push("/dashboard/clientes")
    }
  }, [clientId, router])

  if (!client) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => router.push("/dashboard/clientes")} className="h-8 w-8 p-0">
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Voltar</span>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{client.name}</h1>
        <Badge
          className={
            client.status === "Ativo"
              ? "bg-green-100 text-green-800 hover:bg-green-100"
              : "bg-gray-100 text-gray-800 hover:bg-gray-100"
          }
        >
          {client.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="md:col-span-2"
        >
          <Tabs defaultValue="info" className="space-y-6">
            <TabsList>
              <TabsTrigger value="info">Informações</TabsTrigger>
              <TabsTrigger value="analyses">Histórico de Análises</TabsTrigger>
            </TabsList>

            <TabsContent value="info">
              <Card>
                <CardHeader>
                  <CardTitle>Detalhes do Cliente</CardTitle>
                  <CardDescription>Informações detalhadas sobre o cliente.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-2">
                        <Building className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Tipo</p>
                          <p>{client.type}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Mail className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Email</p>
                          <p>{client.email}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Telefone</p>
                          <p>{client.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <User className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Cadastrado por</p>
                          <p>Ana Oliveira</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Endereço</p>
                          <p>{client.address}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Data de cadastro</p>
                          <p>10/01/2023</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <FileText className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Observações</p>
                          <p>Cliente desde janeiro de 2023.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analyses">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle>Histórico de Análises</CardTitle>
                      <CardDescription>Análises de NCM realizadas para este cliente.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Hora</TableHead>
                        <TableHead>Arquivo</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Usuário</TableHead>
                        <TableHead className="text-right">Resultado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {analyses.length > 0 ? (
                        analyses.map((analysis) => (
                          <TableRow key={analysis.id}>
                            <TableCell>{analysis.date}</TableCell>
                            <TableCell>{analysis.time}</TableCell>
                            <TableCell>{analysis.fileName}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                {analysis.status === "completed" ? (
                                  <>
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <span>Concluído</span>
                                  </>
                                ) : analysis.status === "processing" ? (
                                  <>
                                    <div className="h-4 w-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
                                    <span>Processando</span>
                                  </>
                                ) : (
                                  <>
                                    <AlertCircle className="h-4 w-4 text-red-500" />
                                    <span>Erro</span>
                                  </>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>Ana Oliveira</TableCell>
                            <TableCell className="text-right">
                              {analysis.result ? (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">Ações</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() => router.push(`/dashboard/clientes/${clientId}/analise-resultado`)}
                                    >
                                      <Eye className="mr-2 h-4 w-4" />
                                      Visualizar
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Download className="mr-2 h-4 w-4" />
                                      Baixar
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              ) : (
                                <span className="text-gray-500">-</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">
                            Nenhuma análise encontrada.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => router.push(`/dashboard/nova-analise?client_id=${clientId}`)}
              >
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Nova Análise
              </Button>

              <Button variant="outline" className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                Gerar Relatório
              </Button>

              <Button variant="outline" className="w-full">
                <Mail className="mr-2 h-4 w-4" />
                Enviar Email
              </Button>
            </CardContent>
            <Separator />
            <CardFooter className="flex flex-col items-start pt-4">
              <h4 className="font-medium mb-2">Análises Recentes</h4>
              <div className="space-y-2 w-full">
                {analyses.slice(0, 2).map((analysis) => (
                  <div key={analysis.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="truncate max-w-[120px]">{analysis.fileName}</span>
                    </div>
                    <Badge
                      className={
                        analysis.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : analysis.status === "processing"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                      }
                    >
                      {analysis.status === "completed"
                        ? "Concluído"
                        : analysis.status === "processing"
                          ? "Processando"
                          : "Erro"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

