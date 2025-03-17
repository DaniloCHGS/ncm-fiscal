"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Upload, FileSpreadsheet, X, CheckCircle, Loader2, Mail, FileText, Send } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRef } from "react"

// Tipo para cliente
interface Client {
  id: string
  name: string
  email: string
}

export default function NovaAnalisePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const clientId = searchParams.get("client_id")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [selectedClient, setSelectedClient] = useState<string | null>(clientId)
  const [selectedOption, setSelectedOption] = useState<string>("upload")
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  // Lista de clientes de exemplo
  const clients: Client[] = [
    { id: "1", name: "Empresa ABC Ltda", email: "contato@empresaabc.com" },
    { id: "2", name: "João Empreendimentos", email: "joao@empreendimentos.com" },
    { id: "3", name: "Maria Silva", email: "maria.silva@email.com" },
    { id: "4", name: "Tech Solutions SA", email: "contato@techsolutions.com" },
    { id: "5", name: "Carlos Ferreira", email: "carlos.ferreira@email.com" },
  ]

  useEffect(() => {
    if (clientId) {
      setSelectedClient(clientId)
    }
  }, [clientId])

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]
      validateAndSetFile(droppedFile)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      validateAndSetFile(selectedFile)
    }
  }

  const validateAndSetFile = (file: File) => {
    // Verificar se é um arquivo Excel
    const validTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.oasis.opendocument.spreadsheet",
      "text/xml",
      "application/xml",
    ]

    if (!validTypes.includes(file.type)) {
      toast({
        title: "Formato inválido",
        description: "Por favor, selecione um arquivo Excel (.xls, .xlsx, .ods) ou XML",
        variant: "destructive",
      })
      return
    }

    // Verificar tamanho do arquivo (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O tamanho máximo permitido é 10MB",
        variant: "destructive",
      })
      return
    }

    setFile(file)
  }

  const handleRemoveFile = () => {
    setFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const simulateUpload = () => {
    if (!selectedClient) {
      toast({
        title: "Cliente não selecionado",
        description: "Por favor, selecione um cliente para continuar",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          setIsComplete(true)

          // Redirecionar para a página de resultado após 1.5 segundos
          setTimeout(() => {
            router.push(`/dashboard/analises/analise-resultado`)
          }, 1500)

          return 100
        }
        return prev + 5
      })
    }, 200)
  }

  const handleSendForm = () => {
    if (!selectedClient) {
      toast({
        title: "Cliente não selecionado",
        description: "Por favor, selecione um cliente para continuar",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Formulário enviado",
      description: "O formulário foi enviado para o cliente com sucesso",
    })
  }

  const handleFillForm = () => {
    if (!selectedClient) {
      toast({
        title: "Cliente não selecionado",
        description: "Por favor, selecione um cliente para continuar",
        variant: "destructive",
      })
      return
    }

    router.push(`/dashboard/preencher-formulario?client_id=${selectedClient}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/analises`)} className="h-8 w-8 p-0">
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Voltar</span>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight text-blue-600">Nova Análise</h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <Card>
          <CardHeader>
            <CardTitle>Nova Análise</CardTitle>
            <CardDescription>Selecione um cliente e escolha como deseja realizar a análise de NCM.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="client" className="text-sm font-medium">
                  Cliente
                </label>
                <Select value={selectedClient || ""} onValueChange={setSelectedClient}>
                  <SelectTrigger id="client">
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedClient && (
                <Tabs defaultValue="upload" onValueChange={setSelectedOption} className="w-full">
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="upload">Enviar Arquivo</TabsTrigger>
                    <TabsTrigger value="form">Preencher Formulário</TabsTrigger>
                    <TabsTrigger value="send">Enviar Formulário</TabsTrigger>
                  </TabsList>

                  <TabsContent value="upload" className="space-y-4 mt-4">
                    {!file ? (
                      <div
                        className={`border-2 border-dashed rounded-lg p-12 text-center ${
                          isDragging
                            ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20"
                            : "border-muted"
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        <div className="flex flex-col items-center justify-center space-y-4">
                          <div className="rounded-full bg-muted p-3">
                            <Upload className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-lg font-medium">Arraste e solte sua planilha ou XML aqui</h3>
                            <p className="text-sm text-muted-foreground">ou clique para selecionar um arquivo</p>
                          </div>
                          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                            Selecionar arquivo
                          </Button>
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".xls,.xlsx,.ods,.xml"
                            className="hidden"
                          />
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">
                              Formatos suportados: .xls, .xlsx, .ods, .xml (máx. 10MB)
                            </p>
                            <div className="flex gap-2 justify-center text-xs">
                              <a href="/modelos/modelo-produtos.xlsx" className="text-blue-600 hover:underline">
                                Baixar modelo XLSX
                              </a>
                              <span className="text-muted-foreground">|</span>
                              <a href="/modelos/modelo-produtos.xml" className="text-blue-600 hover:underline">
                                Baixar modelo XML
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="border rounded-lg p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                              <FileSpreadsheet className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <p className="font-medium">{file.name}</p>
                              <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          {!isUploading && !isComplete && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={handleRemoveFile}
                              className="h-8 w-8 text-muted-foreground"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        {isUploading && (
                          <div className="mt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Enviando arquivo...</span>
                              <span>{uploadProgress}%</span>
                            </div>
                            <Progress value={uploadProgress} className="h-2">
                              <div
                                className="h-full bg-blue-600 rounded-full"
                                style={{ width: `${uploadProgress}%` }}
                              />
                            </Progress>
                          </div>
                        )}

                        {isComplete && (
                          <div className="mt-4 flex items-center gap-2 text-green-600 dark:text-green-400">
                            <CheckCircle className="h-5 w-5" />
                            <span>Upload concluído!</span>
                          </div>
                        )}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="form" className="space-y-4 mt-4">
                    <div className="bg-muted/50 rounded-lg p-6 text-center">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="rounded-full bg-muted p-3">
                          <FileText className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-lg font-medium">Preencher formulário de produtos</h3>
                          <p className="text-sm text-muted-foreground">
                            Preencha manualmente o formulário com os dados dos produtos para análise de NCM.
                          </p>
                        </div>
                        <Button onClick={handleFillForm} className="bg-blue-600 hover:bg-blue-700">
                          Preencher formulário
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="send" className="space-y-4 mt-4">
                    <div className="bg-muted/50 rounded-lg p-6 text-center">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="rounded-full bg-muted p-3">
                          <Mail className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-lg font-medium">Enviar formulário para o cliente</h3>
                          <p className="text-sm text-muted-foreground">
                            Envie um link para o cliente preencher o formulário de produtos.
                          </p>
                          <p className="text-sm font-medium">{clients.find((c) => c.id === selectedClient)?.email}</p>
                        </div>
                        <Button onClick={handleSendForm} className="bg-blue-600 hover:bg-blue-700">
                          <Send className="mr-2 h-4 w-4" />
                          Enviar formulário
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push(`/dashboard/analises`)} disabled={isUploading}>
              Cancelar
            </Button>
            {selectedOption === "upload" && (
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={simulateUpload}
                disabled={!file || isUploading || isComplete || !selectedClient}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : isComplete ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Concluído
                  </>
                ) : (
                  "Iniciar Análise"
                )}
              </Button>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

