"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  Search,
  FileSpreadsheet,
  MoreHorizontal,
  Eye,
  Download,
  CalendarIcon,
  CheckCircle,
  AlertCircle,
  Filter,
} from "lucide-react"

// Tipo para análise
interface Analysis {
  id: string
  date: string
  time: string
  status: "completed" | "processing" | "error"
  fileName: string
  clientName: string
  userName: string
  result?: string
}

export default function AnalisesPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [userFilter, setUserFilter] = useState<string | null>(null)
  const [dateFilter, setDateFilter] = useState<Date | null>(null)

  // Dados de exemplo para análises
  const [analyses, setAnalyses] = useState<Analysis[]>([
    {
      id: "1",
      date: "15/06/2023",
      time: "14:30",
      status: "completed",
      fileName: "produtos_junho_2023.xlsx",
      clientName: "Empresa ABC Ltda",
      userName: "Ana Oliveira",
      result: "Relatório de classificação NCM - Junho 2023.pdf",
    },
    {
      id: "2",
      date: "10/05/2023",
      time: "09:15",
      status: "completed",
      fileName: "produtos_maio_2023.xlsx",
      clientName: "João Empreendimentos",
      userName: "Carlos Santos",
      result: "Relatório de classificação NCM - Maio 2023.pdf",
    },
    {
      id: "3",
      date: "20/04/2023",
      time: "16:45",
      status: "error",
      fileName: "produtos_abril_2023.xlsx",
      clientName: "Tech Solutions SA",
      userName: "Ana Oliveira",
    },
    {
      id: "4",
      date: "05/07/2023",
      time: "11:20",
      status: "processing",
      fileName: "produtos_julho_2023.xlsx",
      clientName: "Maria Silva",
      userName: "Pedro Alves",
    },
    {
      id: "5",
      date: "22/06/2023",
      time: "10:05",
      status: "completed",
      fileName: "produtos_especiais_junho_2023.xlsx",
      clientName: "Carlos Ferreira",
      userName: "Ana Oliveira",
      result: "Relatório de classificação NCM - Especiais Junho 2023.pdf",
    },
  ])

  // Lista de usuários únicos para o filtro
  const uniqueUsers = [...new Set(analyses.map((analysis) => analysis.userName))]

  // Filtrar análises com base nos filtros aplicados
  const filteredAnalyses = analyses.filter((analysis) => {
    // Filtro de pesquisa
    const searchMatch =
      analysis.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      analysis.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      analysis.userName.toLowerCase().includes(searchTerm.toLowerCase())

    // Filtro de status
    const statusMatch = !statusFilter || statusFilter === "all" || analysis.status === statusFilter

    // Filtro de usuário
    const userMatch = !userFilter || userFilter === "all" || analysis.userName === userFilter

    // Filtro de data
    const dateMatch = !dateFilter || analysis.date === format(dateFilter, "dd/MM/yyyy")

    return searchMatch && statusMatch && userMatch && dateMatch
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-blue-600">Análises</h1>
        <div className="flex w-full sm:w-auto gap-2">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar análises..."
              className="pl-8 w-full sm:w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => router.push("/dashboard/nova-analise")}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Nova Análise
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {/* Filtro de Data */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <CalendarIcon className="h-4 w-4" />
              {dateFilter ? format(dateFilter, "dd/MM/yyyy") : "Filtrar por Data"}
              {dateFilter && (
                <span
                  className="ml-1 cursor-pointer text-muted-foreground"
                  onClick={(e) => {
                    e.stopPropagation()
                    setDateFilter(null)
                  }}
                >
                  ×
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={dateFilter || undefined} onSelect={setDateFilter} locale={ptBR} />
          </PopoverContent>
        </Popover>

        {/* Filtro de Status */}
        <Select
          value={statusFilter || "all"}
          onValueChange={(value) => setStatusFilter(value === "all" ? null : value)}
        >
          <SelectTrigger className="w-[180px]">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              {statusFilter === "completed"
                ? "Concluído"
                : statusFilter === "processing"
                  ? "Processando"
                  : statusFilter === "error"
                    ? "Erro"
                    : "Filtrar por Status"}
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="completed">Concluído</SelectItem>
            <SelectItem value="processing">Processando</SelectItem>
            <SelectItem value="error">Erro</SelectItem>
          </SelectContent>
        </Select>

        {/* Filtro de Usuário */}
        <Select value={userFilter || "all"} onValueChange={(value) => setUserFilter(value === "all" ? null : value)}>
          <SelectTrigger className="w-[180px]">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              {userFilter === "all" ? "Filtrar por Usuário" : userFilter}
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os usuários</SelectItem>
            {uniqueUsers.map((user) => (
              <SelectItem key={user} value={user}>
                {user}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Botão para limpar filtros */}
        {(statusFilter || userFilter || dateFilter) && (
          <Button
            variant="ghost"
            onClick={() => {
              setStatusFilter(null)
              setUserFilter(null)
              setDateFilter(null)
            }}
            className="text-muted-foreground"
          >
            Limpar filtros
          </Button>
        )}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Arquivo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAnalyses.length > 0 ? (
                  filteredAnalyses.map((analysis) => (
                    <TableRow key={analysis.id}>
                      <TableCell>{analysis.date}</TableCell>
                      <TableCell>{analysis.time}</TableCell>
                      <TableCell>{analysis.clientName}</TableCell>
                      <TableCell>{analysis.fileName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {analysis.status === "completed" ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />
                              <span>Concluído</span>
                            </>
                          ) : analysis.status === "processing" ? (
                            <>
                              <div className="h-4 w-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin dark:border-blue-400" />
                              <span>Processando</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-4 w-4 text-red-500 dark:text-red-400" />
                              <span>Erro</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{analysis.userName}</TableCell>
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
                              <DropdownMenuItem onClick={() => router.push(`/dashboard/analises/analise-resultado`)}>
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
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Nenhuma análise encontrada.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

