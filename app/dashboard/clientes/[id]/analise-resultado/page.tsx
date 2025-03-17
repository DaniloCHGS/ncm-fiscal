"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, CheckCircle, AlertTriangle, Info, FileSpreadsheet, Mail, X, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

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

// Tipo para produto analisado
interface AnalyzedProduct {
  id: string
  name: string
  description: string
  ncmCode: string
  confidence: number
  status: "success" | "warning" | "info"
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

// Dados de exemplo para produtos analisados
const analyzedProductsData: AnalyzedProduct[] = [
  {
    id: "1",
    name: "Smartphone XYZ",
    description: "Smartphone com tela de 6.5 polegadas, 128GB de armazenamento",
    ncmCode: "8517.12.31",
    confidence: 98,
    status: "success",
  },
  {
    id: "2",
    name: "Notebook ABC",
    description: "Notebook com processador i7, 16GB RAM, 512GB SSD",
    ncmCode: "8471.30.12",
    confidence: 95,
    status: "success",
  },
  {
    id: "3",
    name: "Fone de Ouvido Bluetooth",
    description: "Fone de ouvido sem fio com cancelamento de ruído",
    ncmCode: "8518.30.00",
    confidence: 92,
    status: "success",
  },
  {
    id: "4",
    name: "Cabo USB-C",
    description: "Cabo USB-C para carregamento rápido, 1m",
    ncmCode: "8544.42.00",
    confidence: 85,
    status: "warning",
  },
  {
    id: "5",
    name: "Adaptador de Tomada",
    description: "Adaptador de tomada universal para viagem",
    ncmCode: "8536.69.90",
    confidence: 78,
    status: "warning",
  },
  {
    id: "6",
    name: "Produto não identificado",
    description: "Descrição insuficiente para classificação precisa",
    ncmCode: "0000.00.00",
    confidence: 40,
    status: "info",
  },
]

export default function AnaliseResultadoPage() {
  const router = useRouter()
  const params = useParams()
  const clientId = params.id as string

  const [client, setClient] = useState<Client | null>(null)
  const [analyzedProducts, setAnalyzedProducts] = useState<AnalyzedProduct[]>([])

  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [emails, setEmails] = useState<{ email: string; selected: boolean }[]>([])
  const [newEmail, setNewEmail] = useState("")

  const addEmail = () => {
    if (newEmail && !emails.some((e) => e.email === newEmail)) {
      setEmails([...emails, { email: newEmail, selected: true }])
      setNewEmail("")
    }
  }

  const removeEmail = (emailToRemove: string) => {
    setEmails(emails.filter((e) => e.email !== emailToRemove))
  }

  const toggleEmailSelection = (emailToToggle: string) => {
    setEmails(emails.map((e) => (e.email === emailToToggle ? { ...e, selected: !e.selected } : e)))
  }

  const handleShareByEmail = () => {
    const selectedEmails = emails.filter((e) => e.selected).map((e) => e.email)
    // Aqui você implementaria a lógica para enviar o email
    console.log("Compartilhando com:", selectedEmails)
    setShareDialogOpen(false)
    // Mostrar toast de sucesso
  }

  useEffect(() => {
    // Simulando busca de dados do cliente
    const foundClient = clientsData.find((c) => c.id === clientId)
    if (foundClient) {
      setClient(foundClient)
    } else {
      router.push("/dashboard/clientes")
    }

    // Simulando carregamento dos produtos analisados
    setAnalyzedProducts(analyzedProductsData)
  }, [clientId, router])

  if (!client) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Estatísticas da análise
  const totalProducts = analyzedProducts.length
  const highConfidence = analyzedProducts.filter((p) => p.confidence >= 90).length
  const mediumConfidence = analyzedProducts.filter((p) => p.confidence >= 70 && p.confidence < 90).length
  const lowConfidence = analyzedProducts.filter((p) => p.confidence < 70).length

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/dashboard/clientes/${clientId}`)}
          className="h-8 w-8 p-0"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Voltar</span>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Resultado da Análise</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="md:col-span-1 flex"
        >
          <Card className="w-full flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Cliente</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center">
              <p className="font-medium">{client.name}</p>
              <p className="text-sm text-gray-500">{client.email}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="md:col-span-1 flex"
        >
          <Card className="w-full flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total de Produtos</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center">
              <p className="text-3xl font-bold">{totalProducts}</p>
              <p className="text-sm text-gray-500">Produtos analisados</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="md:col-span-1 flex"
        >
          <Card className="w-full flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Alta Confiança</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center">
              <p className="text-3xl font-bold text-green-600">{highConfidence}</p>
              <p className="text-sm text-gray-500">Confiança ≥ 90%</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="md:col-span-1 flex"
        >
          <Card className="w-full flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Baixa Confiança</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center">
              <p className="text-3xl font-bold text-amber-600">{mediumConfidence + lowConfidence}</p>
              <p className="text-sm text-gray-500">{"Confiança < 90%"}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Tabs defaultValue="all" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <TabsList>
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="high">Alta Confiança</TabsTrigger>
              <TabsTrigger value="medium">Média Confiança</TabsTrigger>
              <TabsTrigger value="low">Baixa Confiança</TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => {
                  // Adicionar o email do cliente por padrão
                  if (client && !emails.some((e) => e.email === client.email)) {
                    setEmails([{ email: client.email, selected: true }])
                  }
                  setShareDialogOpen(true)
                }}
              >
                <Mail className="h-4 w-4" />
                <span>Compartilhar por e-mail</span>
              </Button>
              <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                <Download className="h-4 w-4" />
                <span>Exportar PDF</span>
              </Button>
              <Button
                className="gap-2 bg-blue-600 hover:bg-blue-700"
                onClick={() => router.push(`/dashboard/nova-analise?client_id=${clientId}`)}
              >
                <FileSpreadsheet className="h-4 w-4" />
                <span>Nova Análise</span>
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <TabsContent value="all" className="m-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead>Código NCM</TableHead>
                      <TableHead>Confiança</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analyzedProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono">{product.ncmCode}</TableCell>
                        <TableCell>{product.confidence}%</TableCell>
                        <TableCell className="text-right">
                          <Badge
                            className={
                              product.status === "success"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : product.status === "warning"
                                  ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                                  : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                            }
                          >
                            {product.status === "success" ? (
                              <CheckCircle className="mr-1 h-3 w-3" />
                            ) : product.status === "warning" ? (
                              <AlertTriangle className="mr-1 h-3 w-3" />
                            ) : (
                              <Info className="mr-1 h-3 w-3" />
                            )}
                            {product.status === "success"
                              ? "Confiável"
                              : product.status === "warning"
                                ? "Revisar"
                                : "Indefinido"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="high" className="m-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead>Código NCM</TableHead>
                      <TableHead>Confiança</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analyzedProducts
                      .filter((p) => p.confidence >= 90)
                      .map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono">{product.ncmCode}</TableCell>
                          <TableCell>{product.confidence}%</TableCell>
                          <TableCell className="text-right">
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Confiável
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="medium" className="m-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead>Código NCM</TableHead>
                      <TableHead>Confiança</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analyzedProducts
                      .filter((p) => p.confidence >= 70 && p.confidence < 90)
                      .map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono">{product.ncmCode}</TableCell>
                          <TableCell>{product.confidence}%</TableCell>
                          <TableCell className="text-right">
                            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                              <AlertTriangle className="mr-1 h-3 w-3" />
                              Revisar
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="low" className="m-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead>Código NCM</TableHead>
                      <TableHead>Confiança</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analyzedProducts
                      .filter((p) => p.confidence < 70)
                      .map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono">{product.ncmCode}</TableCell>
                          <TableCell>{product.confidence}%</TableCell>
                          <TableCell className="text-right">
                            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                              <Info className="mr-1 h-3 w-3" />
                              Indefinido
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </motion.div>

      {/* Modal de compartilhamento por email */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Compartilhar por e-mail</DialogTitle>
            <DialogDescription>Selecione os destinatários para enviar o relatório de análise.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Adicionar e-mail..."
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="flex-1"
                type="email"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addEmail()
                  }
                }}
              />
              <Button
                type="button"
                size="icon"
                onClick={addEmail}
                disabled={!newEmail}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {emails.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-2">Nenhum e-mail adicionado</p>
              ) : (
                emails.map((item) => (
                  <div key={item.email} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={item.selected}
                        onCheckedChange={() => toggleEmailSelection(item.email)}
                        id={`email-${item.email}`}
                      />
                      <label
                        htmlFor={`email-${item.email}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {item.email}
                      </label>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeEmail(item.email)}
                      className="h-8 w-8 text-gray-500 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShareDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleShareByEmail}
              disabled={!emails.some((e) => e.selected)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

