"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, Loader2, ChevronDown, ChevronUp, AlertCircle, Send, Lock, HelpCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { z } from "zod"

// Tipo para cliente
interface Client {
  id: string
  name: string
  email: string
}

// Esquema de validação Zod para ProdutoFiscal
const fornecedorSchema = z.object({
  nome: z.string().min(1, "Nome do fornecedor é obrigatório"),
  cnpj: z.string().min(1, "CNPJ do fornecedor é obrigatório"),
  estado: z.string().min(1, "Estado do fornecedor é obrigatório"),
})

const icmsSchema = z.object({
  aliquota: z.string().min(1, "Alíquota ICMS é obrigatória"),
  origemEstado: z.string().min(1, "Estado de origem é obrigatório"),
  destinoEstado: z.string().min(1, "Estado de destino é obrigatório"),
  regimeTributario: z.enum(["Simples Nacional", "Lucro Presumido", "Lucro Real"], {
    errorMap: () => ({ message: "Regime tributário é obrigatório" }),
  }),
  reducaoBaseCalculo: z.string().optional(),
  substituicaoTributaria: z.boolean().optional(),
})

const pisCofinsSchema = z.object({
  regimeApuracao: z.enum(["Cumulativo", "Não Cumulativo"], {
    errorMap: () => ({ message: "Regime de apuração é obrigatório" }),
  }),
  pisAliquota: z.string().min(1, "Alíquota PIS é obrigatória"),
  cofinsAliquota: z.string().min(1, "Alíquota COFINS é obrigatória"),
  podeGerarCredito: z.boolean().optional(),
})

const ipiSchema = z
  .object({
    codigoTipi: z.string().optional(),
    aliquota: z.string().optional(),
  })
  .optional()

const issSchema = z
  .object({
    aliquota: z.string().optional(),
    municipio: z.string().optional(),
  })
  .optional()

const notaFiscalSchema = z
  .object({
    numero: z.string(),
    dataEmissao: z.string(),
    valorTotal: z.string(),
  })
  .array()
  .optional()

const beneficioFiscalSchema = z
  .object({
    tipo: z.enum(["Isenção", "Redução de Base", "Diferimento", "Crédito Presumido"]),
    descricao: z.string(),
    estadoAplicavel: z.string(),
  })
  .array()
  .optional()

const historicoClassificacaoSchema = z
  .object({
    ncmAnterior: z.string(),
    dataAlteracao: z.string(),
    motivo: z.string(),
  })
  .array()
  .optional()

const produtoFiscalSchema = z.object({
  id: z.string(),
  descricao: z.string().min(1, "Descrição do produto é obrigatória"),
  ncm: z.string().min(1, "Código NCM é obrigatório"),
  unidadeMedida: z.string().min(1, "Unidade de medida é obrigatória"),
  categoria: z.string().optional(),
  subcategoria: z.string().optional(),
  gtin: z.string().optional(),
  cest: z.string().optional(),
  icms: icmsSchema,
  ipi: ipiSchema,
  pisCofins: pisCofinsSchema,
  iss: issSchema,
  precoCompra: z.string().min(1, "Preço de compra é obrigatório"),
  precoVenda: z.string().min(1, "Preço de venda é obrigatório"),
  fornecedor: fornecedorSchema,
  notasFiscais: notaFiscalSchema,
  beneficiosFiscais: beneficioFiscalSchema,
  historicoClassificacao: historicoClassificacaoSchema,
})

// Tipo para produto fiscal
type ProdutoFiscal = {
  id: string
  descricao: string
  ncm: string
  unidadeMedida: string
  categoria?: string
  subcategoria?: string
  gtin?: string
  cest?: string
  icms: {
    aliquota: string
    origemEstado: string
    destinoEstado: string
    regimeTributario: "Simples Nacional" | "Lucro Presumido" | "Lucro Real"
    reducaoBaseCalculo?: string
    substituicaoTributaria?: boolean
  }
  ipi?: {
    codigoTipi?: string
    aliquota?: string
  }
  pisCofins: {
    regimeApuracao: "Cumulativo" | "Não Cumulativo"
    pisAliquota: string
    cofinsAliquota: string
    podeGerarCredito?: boolean
  }
  iss?: {
    aliquota?: string
    municipio?: string
  }
  precoCompra: string
  precoVenda: string
  fornecedor: {
    nome: string
    cnpj: string
    estado: string
  }
  notasFiscais?: {
    numero: string
    dataEmissao: string
    valorTotal: string
  }[]
  beneficiosFiscais?: {
    tipo: "Isenção" | "Redução de Base" | "Diferimento" | "Crédito Presumido"
    descricao: string
    estadoAplicavel: string
  }[]
  historicoClassificacao?: {
    ncmAnterior: string
    dataAlteracao: string
    motivo: string
  }[]
}

// Lista de estados brasileiros
const estados = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
]

export default function FormularioPublicoPage() {
  const router = useRouter()
  const params = useParams()
  const token = params.token as string

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [client, setClient] = useState<Client | null>(null)
  const [produtos, setProdutos] = useState<ProdutoFiscal[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})
  const [isFormValid, setIsFormValid] = useState(false)
  const [tabValidation, setTabValidation] = useState({
    identificacao: false,
    dadosFiscais: false,
    dadosComerciais: false,
  })

  // Usuário administrador
  const adminUser = {
    name: "Ana Oliveira",
    email: "ana.oliveira@ncmia.com.br",
  }

  // Simular verificação de token e obtenção de cliente
  useEffect(() => {
    if (token) {
      // Em um caso real, você faria uma chamada à API para verificar o token
      // e obter os dados do cliente associado
      const mockClient = {
        id: "1",
        name: "Empresa ABC Ltda",
        email: "contato@empresaabc.com",
      }
      setClient(mockClient)
    } else {
      router.push("/")
    }
  }, [token, router])

  // Validar formulário sempre que produtos mudar
  useEffect(() => {
    validateForm()
  }, [produtos])

  const validateForm = () => {
    const errors: Record<string, string[]> = {}
    let isValid = true
    const tabStatus = {
      identificacao: true,
      dadosFiscais: true,
      dadosComerciais: true,
    }

    // Validar cada produto
    produtos.forEach((produto, index) => {
      try {
        produtoFiscalSchema.parse(produto)
      } catch (error) {
        if (error instanceof z.ZodError) {
          error.errors.forEach((err) => {
            const path = `produto-${index}-${err.path.join("-")}`
            if (!errors[path]) {
              errors[path] = []
            }
            errors[path].push(err.message)

            // Verificar qual tab contém o erro
            const errorPath = err.path.join("-")
            if (errorPath.includes("descricao") || errorPath.includes("ncm") || errorPath.includes("unidadeMedida")) {
              tabStatus.identificacao = false
            } else if (errorPath.includes("icms") || errorPath.includes("pisCofins")) {
              tabStatus.dadosFiscais = false
            } else if (
              errorPath.includes("precoCompra") ||
              errorPath.includes("precoVenda") ||
              errorPath.includes("fornecedor")
            ) {
              tabStatus.dadosComerciais = false
            }
          })
          isValid = false
        }
      }
    })

    // Se não há produtos, o formulário não é válido
    if (produtos.length === 0) {
      isValid = false
    }

    setValidationErrors(errors)
    setIsFormValid(isValid)
    setTabValidation(tabStatus)
    return isValid
  }

  const handleAuthenticate = () => {
    // Em um caso real, você verificaria a senha com o backend
    if (password === "123456") {
      setIsAuthenticated(true)
      toast({
        title: "Autenticado com sucesso",
        description: "Você pode preencher o formulário agora",
      })
    } else {
      toast({
        title: "Senha incorreta",
        description: "Por favor, tente novamente",
        variant: "destructive",
      })
    }
  }

  const addProduct = () => {
    const newProduct: ProdutoFiscal = {
      id: Date.now().toString(),
      descricao: "",
      ncm: "",
      unidadeMedida: "UN",
      icms: {
        aliquota: "18",
        origemEstado: "SP",
        destinoEstado: "SP",
        regimeTributario: "Simples Nacional",
      },
      pisCofins: {
        regimeApuracao: "Cumulativo",
        pisAliquota: "0.65",
        cofinsAliquota: "3",
      },
      precoCompra: "0",
      precoVenda: "0",
      fornecedor: {
        nome: "",
        cnpj: "",
        estado: "SP",
      },
    }
    setProdutos([...produtos, newProduct])
    setExpandedProduct(newProduct.id)
  }

  const removeProduct = (id: string) => {
    setProdutos(produtos.filter((produto) => produto.id !== id))
    if (expandedProduct === id) {
      setExpandedProduct(null)
    }
  }

  const updateProduct = (id: string, field: string, value: any) => {
    setProdutos(
      produtos.map((produto) => {
        if (produto.id === id) {
          // Tratamento para campos aninhados
          if (field.includes(".")) {
            const [mainField, subField] = field.split(".")
            return {
              ...produto,
              [mainField]: {
                ...produto[mainField as keyof ProdutoFiscal],
                [subField]: value,
              },
            }
          }

          // Para campos de primeiro nível
          return { ...produto, [field]: value }
        }
        return produto
      }),
    )
  }

  const updateNestedProduct = (
    id: string,
    mainField: string,
    subField: string,
    subSubField: string | null,
    value: any,
  ) => {
    setProdutos(
      produtos.map((produto) => {
        if (produto.id === id) {
          if (subSubField) {
            // Para campos com três níveis (ex: icms.aliquota)
            return {
              ...produto,
              [mainField]: {
                ...produto[mainField as keyof ProdutoFiscal],
                [subField]: {
                  ...(produto[mainField as keyof ProdutoFiscal] as any)[subField],
                  [subSubField]: value,
                },
              },
            }
          } else {
            // Para campos com dois níveis (ex: fornecedor.nome)
            return {
              ...produto,
              [mainField]: {
                ...produto[mainField as keyof ProdutoFiscal],
                [subField]: value,
              },
            }
          }
        }
        return produto
      }),
    )
  }

  const toggleProductExpand = (id: string) => {
    setExpandedProduct(expandedProduct === id ? null : id)
  }

  const handleSubmit = () => {
    // Validar formulário
    if (!validateForm()) {
      toast({
        title: "Formulário inválido",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulando envio
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Formulário enviado",
        description: "Os produtos foram enviados com sucesso",
      })
      // Redirecionar para uma página de agradecimento ou similar
      router.push("/formulario/enviado")
    }, 1500)
  }

  if (!client) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-blue-100 p-3">
                  <Lock className="h-12 w-12 text-blue-600" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center">Acesso Protegido</CardTitle>
              <CardDescription className="text-center">Este formulário é exclusivo para {client.name}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Senha de acesso</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite a senha enviada por e-mail"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAuthenticate()
                    }
                  }}
                />
              </div>
              <p className="text-sm text-gray-500 text-center">A senha foi enviada para o e-mail {client.email}</p>
            </CardContent>
            <CardFooter className="flex justify-center pb-6">
              <Button onClick={handleAuthenticate} className="bg-blue-600 hover:bg-blue-700">
                Acessar Formulário
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-blue-600">Formulário de Produtos Fiscais</CardTitle>
              <CardDescription>Preencha os dados fiscais dos seus produtos para análise de NCM.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-blue-800">Cliente: {client.name}</p>
                    <p className="text-sm text-blue-700">{client.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-blue-800">Responsável: {adminUser.name}</p>
                    <p className="text-sm text-blue-700">{adminUser.email}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Produtos</h3>
                  <div className="flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Os ícones de atenção indicam campos obrigatórios que precisam ser preenchidos.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Button onClick={addProduct} className="gap-2 bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4" />
                      Adicionar Produto
                    </Button>
                  </div>
                </div>

                {produtos.length > 0 ? (
                  <div className="space-y-4">
                    {produtos.map((produto, produtoIndex) => (
                      <Card key={produto.id} className="border border-gray-200">
                        <CardHeader
                          className="py-3 px-4 flex flex-row items-center justify-between cursor-pointer"
                          onClick={() => toggleProductExpand(produto.id)}
                        >
                          <div>
                            <CardTitle className="text-base">{produto.descricao || "Novo Produto"}</CardTitle>
                            {produto.ncm && <CardDescription>NCM: {produto.ncm}</CardDescription>}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation()
                                removeProduct(produto.id)
                              }}
                              className="h-8 w-8 text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            {expandedProduct === produto.id ? (
                              <ChevronUp className="h-5 w-5" />
                            ) : (
                              <ChevronDown className="h-5 w-5" />
                            )}
                          </div>
                        </CardHeader>

                        {expandedProduct === produto.id && (
                          <CardContent className="pb-4">
                            <Tabs defaultValue="identificacao">
                              <TabsList className="mb-4">
                                <TabsTrigger value="identificacao" className="flex items-center gap-1">
                                  Identificação
                                  {!tabValidation.identificacao && <AlertCircle className="h-3 w-3 text-red-500" />}
                                </TabsTrigger>
                                <TabsTrigger value="dadosFiscais" className="flex items-center gap-1">
                                  Dados Fiscais
                                  {!tabValidation.dadosFiscais && <AlertCircle className="h-3 w-3 text-red-500" />}
                                </TabsTrigger>
                                <TabsTrigger value="dadosComerciais" className="flex items-center gap-1">
                                  Dados Comerciais
                                  {!tabValidation.dadosComerciais && <AlertCircle className="h-3 w-3 text-red-500" />}
                                </TabsTrigger>
                                <TabsTrigger value="historico">Histórico</TabsTrigger>
                              </TabsList>

                              <TabsContent value="identificacao" className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor={`descricao-${produto.id}`} className="flex items-center gap-1">
                                      Descrição do Produto <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                      id={`descricao-${produto.id}`}
                                      value={produto.descricao}
                                      onChange={(e) => updateProduct(produto.id, "descricao", e.target.value)}
                                      placeholder="Descrição detalhada do produto"
                                      className={
                                        validationErrors[`produto-${produtoIndex}-descricao`] ? "border-red-500" : ""
                                      }
                                    />
                                    {validationErrors[`produto-${produtoIndex}-descricao`] && (
                                      <p className="text-xs text-red-500">
                                        {validationErrors[`produto-${produtoIndex}-descricao`][0]}
                                      </p>
                                    )}
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor={`ncm-${produto.id}`} className="flex items-center gap-1">
                                      Código NCM <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                      id={`ncm-${produto.id}`}
                                      value={produto.ncm}
                                      onChange={(e) => updateProduct(produto.id, "ncm", e.target.value)}
                                      placeholder="Ex: 8471.30.19"
                                      className={
                                        validationErrors[`produto-${produtoIndex}-ncm`] ? "border-red-500" : ""
                                      }
                                    />
                                    {validationErrors[`produto-${produtoIndex}-ncm`] && (
                                      <p className="text-xs text-red-500">
                                        {validationErrors[`produto-${produtoIndex}-ncm`][0]}
                                      </p>
                                    )}
                                  </div>

                                  {/* Outros campos de identificação - omitidos para brevidade */}
                                </div>
                              </TabsContent>

                              <TabsContent value="dadosFiscais" className="space-y-6">
                                <Accordion type="single" collapsible defaultValue="icms">
                                  <AccordionItem value="icms">
                                    <AccordionTrigger>
                                      <div className="flex items-center gap-2">
                                        ICMS
                                        <AlertCircle className="h-3 w-3 text-red-500" />
                                      </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                      {/* Conteúdo de ICMS - omitido para brevidade */}
                                    </AccordionContent>
                                  </AccordionItem>

                                  <AccordionItem value="piscofins">
                                    <AccordionTrigger>
                                      <div className="flex items-center gap-2">
                                        PIS/COFINS
                                        <AlertCircle className="h-3 w-3 text-red-500" />
                                      </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                      {/* Conteúdo de PIS/COFINS - omitido para brevidade */}
                                    </AccordionContent>
                                  </AccordionItem>

                                  {/* Outros accordions - omitidos para brevidade */}
                                </Accordion>
                              </TabsContent>

                              <TabsContent value="dadosComerciais" className="space-y-4">
                                {/* Conteúdo de dados comerciais - omitido para brevidade */}
                              </TabsContent>

                              <TabsContent value="historico" className="space-y-6">
                                {/* Conteúdo de histórico - omitido para brevidade */}
                              </TabsContent>
                            </Tabs>
                          </CardContent>
                        )}
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-muted/50 rounded-lg">
                    <p className="text-muted-foreground">
                      Nenhum produto adicionado. Clique em "Adicionar Produto" para começar.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.push("/")} disabled={isLoading}>
                Cancelar
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleSubmit}
                disabled={isLoading || !isFormValid}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Enviar Formulário
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

