"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Plus, Trash2, Save, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

// Tipo para cliente
interface Client {
  id: string
  name: string
  email: string
}

// Tipo para produto
interface Product {
  id: string
  name: string
  description: string
  quantity: number
  unit: string
}

export default function PreencherFormularioPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const clientId = searchParams.get("client_id")

  const [client, setClient] = useState<Client | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)

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
      const foundClient = clients.find((c) => c.id === clientId)
      if (foundClient) {
        setClient(foundClient)
      } else {
        router.push("/dashboard/nova-analise")
      }
    } else {
      router.push("/dashboard/nova-analise")
    }
  }, [clientId, router])

  const addProduct = () => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name: "",
      description: "",
      quantity: 1,
      unit: "un",
    }
    setProducts([...products, newProduct])
  }

  const removeProduct = (id: string) => {
    setProducts(products.filter((product) => product.id !== id))
  }

  const updateProduct = (id: string, field: keyof Product, value: string | number) => {
    setProducts(products.map((product) => (product.id === id ? { ...product, [field]: value } : product)))
  }

  const handleSubmit = () => {
    // Validar se há produtos
    if (products.length === 0) {
      toast({
        title: "Nenhum produto adicionado",
        description: "Adicione pelo menos um produto para continuar",
        variant: "destructive",
      })
      return
    }

    // Validar se todos os produtos têm nome e descrição
    const invalidProducts = products.filter((p) => !p.name || !p.description)
    if (invalidProducts.length > 0) {
      toast({
        title: "Produtos incompletos",
        description: "Preencha o nome e a descrição de todos os produtos",
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
        description: "Os produtos foram enviados para análise com sucesso",
      })
      router.push("/dashboard/analises")
    }, 1500)
  }

  if (!client) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/dashboard/nova-analise?client_id=${clientId}`)}
          className="h-8 w-8 p-0"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Voltar</span>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight text-blue-600">Preencher Formulário</h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        <Card>
          <CardHeader>
            <CardTitle>Formulário de Produtos</CardTitle>
            <CardDescription>
              Preencha os dados dos produtos para análise de NCM para o cliente {client.name}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Produtos</h3>
                <Button onClick={addProduct} className="gap-2 bg-blue-600">
                  <Plus className="h-4 w-4" />
                  Adicionar Produto
                </Button>
              </div>

              {products.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Nome do Produto</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead className="w-[100px]">Quantidade</TableHead>
                      <TableHead className="w-[80px]">Unidade</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <Input
                            value={product.name}
                            onChange={(e) => updateProduct(product.id, "name", e.target.value)}
                            placeholder="Nome do produto"
                          />
                        </TableCell>
                        <TableCell>
                          <Textarea
                            value={product.description}
                            onChange={(e) => updateProduct(product.id, "description", e.target.value)}
                            placeholder="Descrição detalhada do produto"
                            className="min-h-[80px]"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            value={product.quantity}
                            onChange={(e) =>
                              updateProduct(product.id, "quantity", Number.parseInt(e.target.value) || 1)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={product.unit}
                            onChange={(e) => updateProduct(product.id, "unit", e.target.value)}
                            placeholder="un"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeProduct(product.id)}
                            className="h-8 w-8 text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
            <Button
              variant="outline"
              onClick={() => router.push(`/dashboard/nova-analise?client_id=${clientId}`)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleSubmit}
              disabled={isLoading || products.length === 0}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar e Enviar
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

