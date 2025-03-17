"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Upload, FileSpreadsheet, X, CheckCircle, Loader2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"

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

export default function NovaAnalisePage() {
  const router = useRouter()
  const params = useParams()
  const clientId = params.id as string

  const [client, setClient] = useState<Client | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Simulando busca de dados do cliente
    const foundClient = clientsData.find((c) => c.id === clientId)
    if (foundClient) {
      setClient(foundClient)
    } else {
      router.push("/dashboard/clientes")
    }
  }, [clientId, router])

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
    ]

    if (!validTypes.includes(file.type)) {
      toast({
        title: "Formato inválido",
        description: "Por favor, selecione um arquivo Excel (.xls, .xlsx, .ods)",
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
            router.push(`/dashboard/clientes/${clientId}/analise-resultado`)
          }, 1500)

          return 100
        }
        return prev + 5
      })
    }, 200)
  }

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
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/dashboard/clientes/${clientId}`)}
          className="h-8 w-8 p-0"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Voltar</span>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Nova Análise</h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <Card>
          <CardHeader>
            <CardTitle>Upload de Planilha</CardTitle>
            <CardDescription>
              Faça o upload de uma planilha Excel contendo os produtos para análise de NCM.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center gap-2 bg-blue-50 text-blue-700 p-4 rounded-lg">
                <FileSpreadsheet className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm">
                  <span className="font-medium">Cliente:</span> {client.name}
                </p>
              </div>

              {!file ? (
                <div
                  className={`border-2 border-dashed rounded-lg p-12 text-center ${
                    isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="rounded-full bg-gray-100 p-3">
                      <Upload className="h-8 w-8 text-gray-500" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Arraste e solte sua planilha aqui</h3>
                      <p className="text-sm text-gray-500">ou clique para selecionar um arquivo</p>
                    </div>
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                      Selecionar arquivo
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".xls,.xlsx,.ods"
                      className="hidden"
                    />
                    <p className="text-xs text-gray-500">Formatos suportados: .xls, .xlsx, .ods (máx. 10MB)</p>
                  </div>
                </div>
              ) : (
                <div className="border rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-blue-100 p-2">
                        <FileSpreadsheet className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    {!isUploading && !isComplete && (
                      <Button variant="ghost" size="icon" onClick={handleRemoveFile} className="h-8 w-8 text-gray-500">
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
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${uploadProgress}%` }} />
                      </Progress>
                    </div>
                  )}

                  {isComplete && (
                    <div className="mt-4 flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span>Upload concluído!</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => router.push(`/dashboard/clientes/${clientId}`)}
              disabled={isUploading}
            >
              Cancelar
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={simulateUpload}
              disabled={!file || isUploading || isComplete}
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
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

