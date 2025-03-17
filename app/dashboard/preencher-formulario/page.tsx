"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Loader2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  PlayCircle,
  HelpCircle,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { z } from "zod";

// Tipo para cliente
interface Client {
  id: string;
  name: string;
  email: string;
}

// Esquema de validação Zod para ProdutoFiscal
const fornecedorSchema = z.object({
  nome: z.string().min(1, "Nome do fornecedor é obrigatório"),
  cnpj: z.string().min(1, "CNPJ do fornecedor é obrigatório"),
  estado: z.string().min(1, "Estado do fornecedor é obrigatório"),
});

const icmsSchema = z.object({
  aliquota: z.string().min(1, "Alíquota ICMS é obrigatória"),
  origemEstado: z.string().min(1, "Estado de origem é obrigatório"),
  destinoEstado: z.string().min(1, "Estado de destino é obrigatório"),
  regimeTributario: z.enum(
    ["Simples Nacional", "Lucro Presumido", "Lucro Real"],
    {
      errorMap: () => ({ message: "Regime tributário é obrigatório" }),
    }
  ),
  reducaoBaseCalculo: z.string().optional(),
  substituicaoTributaria: z.boolean().optional(),
});

const pisCofinsSchema = z.object({
  regimeApuracao: z.enum(["Cumulativo", "Não Cumulativo"], {
    errorMap: () => ({ message: "Regime de apuração é obrigatório" }),
  }),
  pisAliquota: z.string().min(1, "Alíquota PIS é obrigatória"),
  cofinsAliquota: z.string().min(1, "Alíquota COFINS é obrigatória"),
  podeGerarCredito: z.boolean().optional(),
});

const ipiSchema = z
  .object({
    codigoTipi: z.string().optional(),
    aliquota: z.string().optional(),
  })
  .optional();

const issSchema = z
  .object({
    aliquota: z.string().optional(),
    municipio: z.string().optional(),
  })
  .optional();

const notaFiscalSchema = z
  .object({
    numero: z.string(),
    dataEmissao: z.string(),
    valorTotal: z.string(),
  })
  .array()
  .optional();

const beneficioFiscalSchema = z
  .object({
    tipo: z.enum([
      "Isenção",
      "Redução de Base",
      "Diferimento",
      "Crédito Presumido",
    ]),
    descricao: z.string(),
    estadoAplicavel: z.string(),
  })
  .array()
  .optional();

const historicoClassificacaoSchema = z
  .object({
    ncmAnterior: z.string(),
    dataAlteracao: z.string(),
    motivo: z.string(),
  })
  .array()
  .optional();

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
});

// Tipo para produto fiscal
type ProdutoFiscal = {
  id: string;
  descricao: string;
  ncm: string;
  unidadeMedida: string;
  categoria?: string;
  subcategoria?: string;
  gtin?: string;
  cest?: string;
  icms: {
    aliquota: string;
    origemEstado: string;
    destinoEstado: string;
    regimeTributario: "Simples Nacional" | "Lucro Presumido" | "Lucro Real";
    reducaoBaseCalculo?: string;
    substituicaoTributaria?: boolean;
  };
  ipi?: {
    codigoTipi?: string;
    aliquota?: string;
  };
  pisCofins: {
    regimeApuracao: "Cumulativo" | "Não Cumulativo";
    pisAliquota: string;
    cofinsAliquota: string;
    podeGerarCredito?: boolean;
  };
  iss?: {
    aliquota?: string;
    municipio?: string;
  };
  precoCompra: string;
  precoVenda: string;
  fornecedor: {
    nome: string;
    cnpj: string;
    estado: string;
  };
  notasFiscais?: {
    numero: string;
    dataEmissao: string;
    valorTotal: string;
  }[];
  beneficiosFiscais?: {
    tipo: "Isenção" | "Redução de Base" | "Diferimento" | "Crédito Presumido";
    descricao: string;
    estadoAplicavel: string;
  }[];
  historicoClassificacao?: {
    ncmAnterior: string;
    dataAlteracao: string;
    motivo: string;
  }[];
};

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
];

export default function PreencherFormularioPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientId = searchParams.get("client_id");

  const [client, setClient] = useState<Client | null>(null);
  const [produtos, setProdutos] = useState<ProdutoFiscal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[]>
  >({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [tabValidation, setTabValidation] = useState({
    identificacao: false,
    dadosFiscais: false,
    dadosComerciais: false,
  });

  // Lista de clientes de exemplo
  const clients: Client[] = [
    { id: "1", name: "Empresa ABC Ltda", email: "contato@empresaabc.com" },
    {
      id: "2",
      name: "João Empreendimentos",
      email: "joao@empreendimentos.com",
    },
    { id: "3", name: "Maria Silva", email: "maria.silva@email.com" },
    { id: "4", name: "Tech Solutions SA", email: "contato@techsolutions.com" },
    { id: "5", name: "Carlos Ferreira", email: "carlos.ferreira@email.com" },
  ];

  useEffect(() => {
    if (clientId) {
      const foundClient = clients.find((c) => c.id === clientId);
      if (foundClient) {
        setClient(foundClient);
      } else {
        router.push("/dashboard/nova-analise");
      }
    } else {
      router.push("/dashboard/nova-analise");
    }
  }, [clientId, router]);

  // Validar formulário sempre que produtos mudar
  useEffect(() => {
    validateForm();
  }, [produtos]);

  const validateForm = () => {
    const errors: Record<string, string[]> = {};
    let isValid = true;
    const tabStatus = {
      identificacao: true,
      dadosFiscais: true,
      dadosComerciais: true,
    };

    // Validar cada produto
    produtos.forEach((produto, index) => {
      try {
        produtoFiscalSchema.parse(produto);
      } catch (error) {
        if (error instanceof z.ZodError) {
          error.errors.forEach((err) => {
            const path = `produto-${index}-${err.path.join("-")}`;
            if (!errors[path]) {
              errors[path] = [];
            }
            errors[path].push(err.message);

            // Verificar qual tab contém o erro
            const errorPath = err.path.join("-");
            if (
              errorPath.includes("descricao") ||
              errorPath.includes("ncm") ||
              errorPath.includes("unidadeMedida")
            ) {
              tabStatus.identificacao = false;
            } else if (
              errorPath.includes("icms") ||
              errorPath.includes("pisCofins")
            ) {
              tabStatus.dadosFiscais = false;
            } else if (
              errorPath.includes("precoCompra") ||
              errorPath.includes("precoVenda") ||
              errorPath.includes("fornecedor")
            ) {
              tabStatus.dadosComerciais = false;
            }
          });
          isValid = false;
        }
      }
    });

    // Se não há produtos, o formulário não é válido
    if (produtos.length === 0) {
      isValid = false;
    }

    setValidationErrors(errors);
    setIsFormValid(isValid);
    setTabValidation(tabStatus);
    return isValid;
  };

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
    };
    setProdutos([...produtos, newProduct]);
    setExpandedProduct(newProduct.id);
  };

  const removeProduct = (id: string) => {
    setProdutos(produtos.filter((produto) => produto.id !== id));
    if (expandedProduct === id) {
      setExpandedProduct(null);
    }
  };

  const updateProduct = (id: string, field: string, value: any) => {
    setProdutos(
      produtos.map((produto) => {
        if (produto.id === id) {
          // Tratamento para campos aninhados
          if (field.includes(".")) {
            const [mainField, subField] = field.split(".");
            return {
              ...produto,
              [mainField]: {
                ...(produto[mainField as keyof ProdutoFiscal] as Record<
                  string,
                  unknown
                >),
                [subField]: value,
              },
            };
          }

          // Para campos de primeiro nível
          return { ...produto, [field]: value };
        }
        return produto;
      })
    );
  };

  const updateNestedProduct = (
    id: string,
    mainField: string,
    subField: string,
    subSubField: string | null,
    value: any
  ) => {
    setProdutos(
      produtos.map((produto) => {
        if (produto.id === id) {
          if (subSubField) {
            // Para campos com três níveis (ex: icms.aliquota)
            return {
              ...produto,
              [mainField]: {
                ...(produto[mainField as keyof ProdutoFiscal] as object),
                [subField]: {
                  ...(produto[mainField as keyof ProdutoFiscal] as any)[
                    subField
                  ],
                  [subSubField]: value,
                },
              },
            };
          } else {
            // Para campos com dois níveis (ex: fornecedor.nome)
            return {
              ...produto,
              [mainField]: {
                ...(produto[mainField as keyof ProdutoFiscal] as object),
                [subField]: value,
              },
            };
          }
        }
        return produto;
      })
    );
  };

  const toggleProductExpand = (id: string) => {
    setExpandedProduct(expandedProduct === id ? null : id);
  };

  const handleSubmit = () => {
    // Validar formulário
    if (!validateForm()) {
      toast({
        title: "Formulário inválido",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulando envio
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Análise iniciada",
        description: "Os produtos foram enviados para análise com sucesso",
      });
      // Redirecionar para a página de resultado de análise
      router.push("/dashboard/analises/analise-resultado");
    }, 1500);
  };

  if (!client) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            router.push(`/dashboard/nova-analise?client_id=${clientId}`)
          }
          className="h-8 w-8 p-0"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Voltar</span>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight text-blue-600">
          Preencher Formulário
        </h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <Card>
          <CardHeader>
            <CardTitle>Formulário de Produtos Fiscais</CardTitle>
            <CardDescription>
              Preencha os dados fiscais dos produtos para análise de NCM para o
              cliente {client.name}.
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                        <p>
                          Os ícones de atenção indicam campos obrigatórios que
                          precisam ser preenchidos.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Button
                    onClick={addProduct}
                    className="gap-2 bg-blue-600 hover:bg-blue-700"
                  >
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
                          <CardTitle className="text-base">
                            {produto.descricao || "Novo Produto"}
                          </CardTitle>
                          {produto.ncm && (
                            <CardDescription>
                              NCM: {produto.ncm}
                            </CardDescription>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeProduct(produto.id);
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
                              <TabsTrigger
                                value="identificacao"
                                className="flex items-center gap-1"
                              >
                                Identificação
                                {!tabValidation.identificacao && (
                                  <AlertCircle className="h-3 w-3 text-red-500" />
                                )}
                              </TabsTrigger>
                              <TabsTrigger
                                value="dadosFiscais"
                                className="flex items-center gap-1"
                              >
                                Dados Fiscais
                                {!tabValidation.dadosFiscais && (
                                  <AlertCircle className="h-3 w-3 text-red-500" />
                                )}
                              </TabsTrigger>
                              <TabsTrigger
                                value="dadosComerciais"
                                className="flex items-center gap-1"
                              >
                                Dados Comerciais
                                {!tabValidation.dadosComerciais && (
                                  <AlertCircle className="h-3 w-3 text-red-500" />
                                )}
                              </TabsTrigger>
                              <TabsTrigger value="historico">
                                Histórico
                              </TabsTrigger>
                            </TabsList>

                            <TabsContent
                              value="identificacao"
                              className="space-y-4"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label
                                    htmlFor={`descricao-${produto.id}`}
                                    className="flex items-center gap-1"
                                  >
                                    Descrição do Produto{" "}
                                    <span className="text-red-500">*</span>
                                  </Label>
                                  <Input
                                    id={`descricao-${produto.id}`}
                                    value={produto.descricao}
                                    onChange={(e) =>
                                      updateProduct(
                                        produto.id,
                                        "descricao",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Descrição detalhada do produto"
                                    className={
                                      validationErrors[
                                        `produto-${produtoIndex}-descricao`
                                      ]
                                        ? "border-red-500"
                                        : ""
                                    }
                                  />
                                  {validationErrors[
                                    `produto-${produtoIndex}-descricao`
                                  ] && (
                                    <p className="text-xs text-red-500">
                                      {
                                        validationErrors[
                                          `produto-${produtoIndex}-descricao`
                                        ][0]
                                      }
                                    </p>
                                  )}
                                </div>

                                <div className="space-y-2">
                                  <Label
                                    htmlFor={`ncm-${produto.id}`}
                                    className="flex items-center gap-1"
                                  >
                                    Código NCM{" "}
                                    <span className="text-red-500">*</span>
                                  </Label>
                                  <Input
                                    id={`ncm-${produto.id}`}
                                    value={produto.ncm}
                                    onChange={(e) =>
                                      updateProduct(
                                        produto.id,
                                        "ncm",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Ex: 8471.30.19"
                                    className={
                                      validationErrors[
                                        `produto-${produtoIndex}-ncm`
                                      ]
                                        ? "border-red-500"
                                        : ""
                                    }
                                  />
                                  {validationErrors[
                                    `produto-${produtoIndex}-ncm`
                                  ] && (
                                    <p className="text-xs text-red-500">
                                      {
                                        validationErrors[
                                          `produto-${produtoIndex}-ncm`
                                        ][0]
                                      }
                                    </p>
                                  )}
                                </div>

                                <div className="space-y-2">
                                  <Label
                                    htmlFor={`unidadeMedida-${produto.id}`}
                                    className="flex items-center gap-1"
                                  >
                                    Unidade de Medida{" "}
                                    <span className="text-red-500">*</span>
                                  </Label>
                                  <Select
                                    value={produto.unidadeMedida}
                                    onValueChange={(value) =>
                                      updateProduct(
                                        produto.id,
                                        "unidadeMedida",
                                        value
                                      )
                                    }
                                  >
                                    <SelectTrigger
                                      id={`unidadeMedida-${produto.id}`}
                                      className={
                                        validationErrors[
                                          `produto-${produtoIndex}-unidadeMedida`
                                        ]
                                          ? "border-red-500"
                                          : ""
                                      }
                                    >
                                      <SelectValue placeholder="Selecione a unidade" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="UN">
                                        Unidade (UN)
                                      </SelectItem>
                                      <SelectItem value="KG">
                                        Quilograma (KG)
                                      </SelectItem>
                                      <SelectItem value="L">
                                        Litro (L)
                                      </SelectItem>
                                      <SelectItem value="M">
                                        Metro (M)
                                      </SelectItem>
                                      <SelectItem value="M2">
                                        Metro Quadrado (M²)
                                      </SelectItem>
                                      <SelectItem value="M3">
                                        Metro Cúbico (M³)
                                      </SelectItem>
                                      <SelectItem value="PC">
                                        Peça (PC)
                                      </SelectItem>
                                      <SelectItem value="CX">
                                        Caixa (CX)
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                  {validationErrors[
                                    `produto-${produtoIndex}-unidadeMedida`
                                  ] && (
                                    <p className="text-xs text-red-500">
                                      {
                                        validationErrors[
                                          `produto-${produtoIndex}-unidadeMedida`
                                        ][0]
                                      }
                                    </p>
                                  )}
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor={`categoria-${produto.id}`}>
                                    Categoria
                                  </Label>
                                  <Input
                                    id={`categoria-${produto.id}`}
                                    value={produto.categoria || ""}
                                    onChange={(e) =>
                                      updateProduct(
                                        produto.id,
                                        "categoria",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Categoria do produto"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor={`subcategoria-${produto.id}`}>
                                    Subcategoria
                                  </Label>
                                  <Input
                                    id={`subcategoria-${produto.id}`}
                                    value={produto.subcategoria || ""}
                                    onChange={(e) =>
                                      updateProduct(
                                        produto.id,
                                        "subcategoria",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Subcategoria do produto"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor={`gtin-${produto.id}`}>
                                    Código de Barras (GTIN/EAN)
                                  </Label>
                                  <Input
                                    id={`gtin-${produto.id}`}
                                    value={produto.gtin || ""}
                                    onChange={(e) =>
                                      updateProduct(
                                        produto.id,
                                        "gtin",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Ex: 7891234567890"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor={`cest-${produto.id}`}>
                                    Código CEST
                                  </Label>
                                  <Input
                                    id={`cest-${produto.id}`}
                                    value={produto.cest || ""}
                                    onChange={(e) =>
                                      updateProduct(
                                        produto.id,
                                        "cest",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Ex: 01.001.00"
                                  />
                                </div>
                              </div>
                            </TabsContent>

                            <TabsContent
                              value="dadosFiscais"
                              className="space-y-6"
                            >
                              <Accordion
                                type="single"
                                collapsible
                                defaultValue="icms"
                              >
                                <AccordionItem value="icms">
                                  <AccordionTrigger>
                                    <div className="flex items-center gap-2">
                                      ICMS
                                      <AlertCircle className="h-3 w-3 text-red-500" />
                                    </div>
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                      <div className="space-y-2">
                                        <Label
                                          htmlFor={`icms-aliquota-${produto.id}`}
                                          className="flex items-center gap-1"
                                        >
                                          Alíquota ICMS (%){" "}
                                          <span className="text-red-500">
                                            *
                                          </span>
                                        </Label>
                                        <Input
                                          id={`icms-aliquota-${produto.id}`}
                                          type="string"
                                          value={produto.icms.aliquota}
                                          onChange={(e) =>
                                            updateNestedProduct(
                                              produto.id,
                                              "icms",
                                              "aliquota",
                                              null,
                                              e.target.value
                                            )
                                          }
                                          placeholder="Ex: 18"
                                          className={
                                            validationErrors[
                                              `produto-${produtoIndex}-icms-aliquota`
                                            ]
                                              ? "border-red-500"
                                              : ""
                                          }
                                        />
                                        {validationErrors[
                                          `produto-${produtoIndex}-icms-aliquota`
                                        ] && (
                                          <p className="text-xs text-red-500">
                                            {
                                              validationErrors[
                                                `produto-${produtoIndex}-icms-aliquota`
                                              ][0]
                                            }
                                          </p>
                                        )}
                                      </div>

                                      <div className="space-y-2">
                                        <Label
                                          htmlFor={`icms-origem-${produto.id}`}
                                          className="flex items-center gap-1"
                                        >
                                          Estado de Origem{" "}
                                          <span className="text-red-500">
                                            *
                                          </span>
                                        </Label>
                                        <Select
                                          value={produto.icms.origemEstado}
                                          onValueChange={(value) =>
                                            updateNestedProduct(
                                              produto.id,
                                              "icms",
                                              "origemEstado",
                                              null,
                                              value
                                            )
                                          }
                                        >
                                          <SelectTrigger
                                            id={`icms-origem-${produto.id}`}
                                            className={
                                              validationErrors[
                                                `produto-${produtoIndex}-icms-origemEstado`
                                              ]
                                                ? "border-red-500"
                                                : ""
                                            }
                                          >
                                            <SelectValue placeholder="Selecione o estado" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {estados.map((estado) => (
                                              <SelectItem
                                                key={estado}
                                                value={estado}
                                              >
                                                {estado}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                        {validationErrors[
                                          `produto-${produtoIndex}-icms-origemEstado`
                                        ] && (
                                          <p className="text-xs text-red-500">
                                            {
                                              validationErrors[
                                                `produto-${produtoIndex}-icms-origemEstado`
                                              ][0]
                                            }
                                          </p>
                                        )}
                                      </div>

                                      <div className="space-y-2">
                                        <Label
                                          htmlFor={`icms-destino-${produto.id}`}
                                          className="flex items-center gap-1"
                                        >
                                          Estado de Destino{" "}
                                          <span className="text-red-500">
                                            *
                                          </span>
                                        </Label>
                                        <Select
                                          value={produto.icms.destinoEstado}
                                          onValueChange={(value) =>
                                            updateNestedProduct(
                                              produto.id,
                                              "icms",
                                              "destinoEstado",
                                              null,
                                              value
                                            )
                                          }
                                        >
                                          <SelectTrigger
                                            id={`icms-destino-${produto.id}`}
                                            className={
                                              validationErrors[
                                                `produto-${produtoIndex}-icms-destinoEstado`
                                              ]
                                                ? "border-red-500"
                                                : ""
                                            }
                                          >
                                            <SelectValue placeholder="Selecione o estado" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {estados.map((estado) => (
                                              <SelectItem
                                                key={estado}
                                                value={estado}
                                              >
                                                {estado}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                        {validationErrors[
                                          `produto-${produtoIndex}-icms-destinoEstado`
                                        ] && (
                                          <p className="text-xs text-red-500">
                                            {
                                              validationErrors[
                                                `produto-${produtoIndex}-icms-destinoEstado`
                                              ][0]
                                            }
                                          </p>
                                        )}
                                      </div>

                                      <div className="space-y-2">
                                        <Label
                                          htmlFor={`icms-regime-${produto.id}`}
                                          className="flex items-center gap-1"
                                        >
                                          Regime Tributário{" "}
                                          <span className="text-red-500">
                                            *
                                          </span>
                                        </Label>
                                        <Select
                                          value={produto.icms.regimeTributario}
                                          onValueChange={(value) =>
                                            updateNestedProduct(
                                              produto.id,
                                              "icms",
                                              "regimeTributario",
                                              null,
                                              value as
                                                | "Simples Nacional"
                                                | "Lucro Presumido"
                                                | "Lucro Real"
                                            )
                                          }
                                        >
                                          <SelectTrigger
                                            id={`icms-regime-${produto.id}`}
                                            className={
                                              validationErrors[
                                                `produto-${produtoIndex}-icms-regimeTributario`
                                              ]
                                                ? "border-red-500"
                                                : ""
                                            }
                                          >
                                            <SelectValue placeholder="Selecione o regime" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="Simples Nacional">
                                              Simples Nacional
                                            </SelectItem>
                                            <SelectItem value="Lucro Presumido">
                                              Lucro Presumido
                                            </SelectItem>
                                            <SelectItem value="Lucro Real">
                                              Lucro Real
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                        {validationErrors[
                                          `produto-${produtoIndex}-icms-regimeTributario`
                                        ] && (
                                          <p className="text-xs text-red-500">
                                            {
                                              validationErrors[
                                                `produto-${produtoIndex}-icms-regimeTributario`
                                              ][0]
                                            }
                                          </p>
                                        )}
                                      </div>

                                      <div className="space-y-2">
                                        <Label
                                          htmlFor={`icms-reducao-${produto.id}`}
                                        >
                                          Redução Base de Cálculo (%)
                                        </Label>
                                        <Input
                                          id={`icms-reducao-${produto.id}`}
                                          type="string"
                                          value={
                                            produto.icms.reducaoBaseCalculo ||
                                            ""
                                          }
                                          onChange={(e) =>
                                            updateNestedProduct(
                                              produto.id,
                                              "icms",
                                              "reducaoBaseCalculo",
                                              null,
                                              e.target.value
                                            )
                                          }
                                          placeholder="Ex: 10"
                                        />
                                      </div>

                                      <div className="flex items-center space-x-2 pt-4">
                                        <Checkbox
                                          id={`icms-st-${produto.id}`}
                                          checked={
                                            produto.icms
                                              .substituicaoTributaria || false
                                          }
                                          onCheckedChange={(checked) =>
                                            updateNestedProduct(
                                              produto.id,
                                              "icms",
                                              "substituicaoTributaria",
                                              null,
                                              checked === true
                                            )
                                          }
                                        />
                                        <Label
                                          htmlFor={`icms-st-${produto.id}`}
                                        >
                                          Substituição Tributária
                                        </Label>
                                      </div>
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="ipi">
                                  <AccordionTrigger>IPI</AccordionTrigger>
                                  <AccordionContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                      <div className="space-y-2">
                                        <Label
                                          htmlFor={`ipi-codigo-${produto.id}`}
                                        >
                                          Código TIPI
                                        </Label>
                                        <Input
                                          id={`ipi-codigo-${produto.id}`}
                                          value={produto.ipi?.codigoTipi || ""}
                                          onChange={(e) => {
                                            const ipi = produto.ipi || {};
                                            updateProduct(produto.id, "ipi", {
                                              ...ipi,
                                              codigoTipi: e.target.value,
                                            });
                                          }}
                                          placeholder="Ex: 8471.30.19"
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <Label
                                          htmlFor={`ipi-aliquota-${produto.id}`}
                                        >
                                          Alíquota IPI (%)
                                        </Label>
                                        <Input
                                          id={`ipi-aliquota-${produto.id}`}
                                          type="string"
                                          value={produto.ipi?.aliquota || ""}
                                          onChange={(e) => {
                                            const ipi = produto.ipi || {};
                                            updateProduct(produto.id, "ipi", {
                                              ...ipi,
                                              aliquota: e.target.value,
                                            });
                                          }}
                                          placeholder="Ex: 5"
                                        />
                                      </div>
                                    </div>
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                      <div className="space-y-2">
                                        <Label
                                          htmlFor={`piscofins-regime-${produto.id}`}
                                          className="flex items-center gap-1"
                                        >
                                          Regime de Apuração{" "}
                                          <span className="text-red-500">
                                            *
                                          </span>
                                        </Label>
                                        <Select
                                          value={
                                            produto.pisCofins.regimeApuracao
                                          }
                                          onValueChange={(value) =>
                                            updateNestedProduct(
                                              produto.id,
                                              "pisCofins",
                                              "regimeApuracao",
                                              null,
                                              value as
                                                | "Cumulativo"
                                                | "Não Cumulativo"
                                            )
                                          }
                                        >
                                          <SelectTrigger
                                            id={`piscofins-regime-${produto.id}`}
                                            className={
                                              validationErrors[
                                                `produto-${produtoIndex}-pisCofins-regimeApuracao`
                                              ]
                                                ? "border-red-500"
                                                : ""
                                            }
                                          >
                                            <SelectValue placeholder="Selecione o regime" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="Cumulativo">
                                              Cumulativo
                                            </SelectItem>
                                            <SelectItem value="Não Cumulativo">
                                              Não Cumulativo
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                        {validationErrors[
                                          `produto-${produtoIndex}-pisCofins-regimeApuracao`
                                        ] && (
                                          <p className="text-xs text-red-500">
                                            {
                                              validationErrors[
                                                `produto-${produtoIndex}-pisCofins-regimeApuracao`
                                              ][0]
                                            }
                                          </p>
                                        )}
                                      </div>

                                      <div className="space-y-2">
                                        <Label
                                          htmlFor={`pis-aliquota-${produto.id}`}
                                          className="flex items-center gap-1"
                                        >
                                          Alíquota PIS (%){" "}
                                          <span className="text-red-500">
                                            *
                                          </span>
                                        </Label>
                                        <Input
                                          id={`pis-aliquota-${produto.id}`}
                                          type="string"
                                          value={produto.pisCofins.pisAliquota}
                                          onChange={(e) =>
                                            updateNestedProduct(
                                              produto.id,
                                              "pisCofins",
                                              "pisAliquota",
                                              null,
                                              e.target.value
                                            )
                                          }
                                          placeholder="Ex: 0.65"
                                          className={
                                            validationErrors[
                                              `produto-${produtoIndex}-pisCofins-pisAliquota`
                                            ]
                                              ? "border-red-500"
                                              : ""
                                          }
                                        />
                                        {validationErrors[
                                          `produto-${produtoIndex}-pisCofins-pisAliquota`
                                        ] && (
                                          <p className="text-xs text-red-500">
                                            {
                                              validationErrors[
                                                `produto-${produtoIndex}-pisCofins-pisAliquota`
                                              ][0]
                                            }
                                          </p>
                                        )}
                                      </div>

                                      <div className="space-y-2">
                                        <Label
                                          htmlFor={`cofins-aliquota-${produto.id}`}
                                          className="flex items-center gap-1"
                                        >
                                          Alíquota COFINS (%){" "}
                                          <span className="text-red-500">
                                            *
                                          </span>
                                        </Label>
                                        <Input
                                          id={`cofins-aliquota-${produto.id}`}
                                          type="string"
                                          value={
                                            produto.pisCofins.cofinsAliquota
                                          }
                                          onChange={(e) =>
                                            updateNestedProduct(
                                              produto.id,
                                              "pisCofins",
                                              "cofinsAliquota",
                                              null,
                                              e.target.value
                                            )
                                          }
                                          placeholder="Ex: 3"
                                          className={
                                            validationErrors[
                                              `produto-${produtoIndex}-pisCofins-cofinsAliquota`
                                            ]
                                              ? "border-red-500"
                                              : ""
                                          }
                                        />
                                        {validationErrors[
                                          `produto-${produtoIndex}-pisCofins-cofinsAliquota`
                                        ] && (
                                          <p className="text-xs text-red-500">
                                            {
                                              validationErrors[
                                                `produto-${produtoIndex}-pisCofins-cofinsAliquota`
                                              ][0]
                                            }
                                          </p>
                                        )}
                                      </div>

                                      <div className="flex items-center space-x-2 pt-4">
                                        <Checkbox
                                          id={`piscofins-credito-${produto.id}`}
                                          checked={
                                            produto.pisCofins
                                              .podeGerarCredito || false
                                          }
                                          onCheckedChange={(checked) =>
                                            updateNestedProduct(
                                              produto.id,
                                              "pisCofins",
                                              "podeGerarCredito",
                                              null,
                                              checked === true
                                            )
                                          }
                                        />
                                        <Label
                                          htmlFor={`piscofins-credito-${produto.id}`}
                                        >
                                          Pode Gerar Crédito Fiscal
                                        </Label>
                                      </div>
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="iss">
                                  <AccordionTrigger>ISS</AccordionTrigger>
                                  <AccordionContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                      <div className="space-y-2">
                                        <Label
                                          htmlFor={`iss-aliquota-${produto.id}`}
                                        >
                                          Alíquota ISS (%)
                                        </Label>
                                        <Input
                                          id={`iss-aliquota-${produto.id}`}
                                          type="string"
                                          value={produto.iss?.aliquota || ""}
                                          onChange={(e) => {
                                            const iss = produto.iss || {};
                                            updateProduct(produto.id, "iss", {
                                              ...iss,
                                              aliquota: e.target.value,
                                            });
                                          }}
                                          placeholder="Ex: 5"
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <Label
                                          htmlFor={`iss-municipio-${produto.id}`}
                                        >
                                          Município
                                        </Label>
                                        <Input
                                          id={`iss-municipio-${produto.id}`}
                                          value={produto.iss?.municipio || ""}
                                          onChange={(e) => {
                                            const iss = produto.iss || {};
                                            updateProduct(produto.id, "iss", {
                                              ...iss,
                                              municipio: e.target.value,
                                            });
                                          }}
                                          placeholder="Ex: São Paulo"
                                        />
                                      </div>
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            </TabsContent>

                            <TabsContent
                              value="dadosComerciais"
                              className="space-y-4"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label
                                    htmlFor={`preco-compra-${produto.id}`}
                                    className="flex items-center gap-1"
                                  >
                                    Preço de Compra (R$){" "}
                                    <span className="text-red-500">*</span>
                                  </Label>
                                  <Input
                                    id={`preco-compra-${produto.id}`}
                                    type="string"
                                    value={produto.precoCompra}
                                    onChange={(e) =>
                                      updateProduct(
                                        produto.id,
                                        "precoCompra",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Ex: 100.00"
                                    className={
                                      validationErrors[
                                        `produto-${produtoIndex}-precoCompra`
                                      ]
                                        ? "border-red-500"
                                        : ""
                                    }
                                  />
                                  {validationErrors[
                                    `produto-${produtoIndex}-precoCompra`
                                  ] && (
                                    <p className="text-xs text-red-500">
                                      {
                                        validationErrors[
                                          `produto-${produtoIndex}-precoCompra`
                                        ][0]
                                      }
                                    </p>
                                  )}
                                </div>

                                <div className="space-y-2">
                                  <Label
                                    htmlFor={`preco-venda-${produto.id}`}
                                    className="flex items-center gap-1"
                                  >
                                    Preço de Venda (R$){" "}
                                    <span className="text-red-500">*</span>
                                  </Label>
                                  <Input
                                    id={`preco-venda-${produto.id}`}
                                    type="string"
                                    value={produto.precoVenda}
                                    onChange={(e) =>
                                      updateProduct(
                                        produto.id,
                                        "precoVenda",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Ex: 150.00"
                                    className={
                                      validationErrors[
                                        `produto-${produtoIndex}-precoVenda`
                                      ]
                                        ? "border-red-500"
                                        : ""
                                    }
                                  />
                                  {validationErrors[
                                    `produto-${produtoIndex}-precoVenda`
                                  ] && (
                                    <p className="text-xs text-red-500">
                                      {
                                        validationErrors[
                                          `produto-${produtoIndex}-precoVenda`
                                        ][0]
                                      }
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="pt-2">
                                <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                                  Fornecedor{" "}
                                  <span className="text-red-500">*</span>
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label
                                      htmlFor={`fornecedor-nome-${produto.id}`}
                                      className="flex items-center gap-1"
                                    >
                                      Nome do Fornecedor{" "}
                                      <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                      id={`fornecedor-nome-${produto.id}`}
                                      value={produto.fornecedor.nome}
                                      onChange={(e) =>
                                        updateNestedProduct(
                                          produto.id,
                                          "fornecedor",
                                          "nome",
                                          null,
                                          e.target.value
                                        )
                                      }
                                      placeholder="Nome do fornecedor"
                                      className={
                                        validationErrors[
                                          `produto-${produtoIndex}-fornecedor-nome`
                                        ]
                                          ? "border-red-500"
                                          : ""
                                      }
                                    />
                                    {validationErrors[
                                      `produto-${produtoIndex}-fornecedor-nome`
                                    ] && (
                                      <p className="text-xs text-red-500">
                                        {
                                          validationErrors[
                                            `produto-${produtoIndex}-fornecedor-nome`
                                          ][0]
                                        }
                                      </p>
                                    )}
                                  </div>

                                  <div className="space-y-2">
                                    <Label
                                      htmlFor={`fornecedor-cnpj-${produto.id}`}
                                      className="flex items-center gap-1"
                                    >
                                      CNPJ do Fornecedor{" "}
                                      <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                      id={`fornecedor-cnpj-${produto.id}`}
                                      value={produto.fornecedor.cnpj}
                                      onChange={(e) =>
                                        updateNestedProduct(
                                          produto.id,
                                          "fornecedor",
                                          "cnpj",
                                          null,
                                          e.target.value
                                        )
                                      }
                                      placeholder="Ex: 12.345.678/0001-90"
                                      className={
                                        validationErrors[
                                          `produto-${produtoIndex}-fornecedor-cnpj`
                                        ]
                                          ? "border-red-500"
                                          : ""
                                      }
                                    />
                                    {validationErrors[
                                      `produto-${produtoIndex}-fornecedor-cnpj`
                                    ] && (
                                      <p className="text-xs text-red-500">
                                        {
                                          validationErrors[
                                            `produto-${produtoIndex}-fornecedor-cnpj`
                                          ][0]
                                        }
                                      </p>
                                    )}
                                  </div>

                                  <div className="space-y-2">
                                    <Label
                                      htmlFor={`fornecedor-estado-${produto.id}`}
                                      className="flex items-center gap-1"
                                    >
                                      Estado do Fornecedor{" "}
                                      <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                      value={produto.fornecedor.estado}
                                      onValueChange={(value) =>
                                        updateNestedProduct(
                                          produto.id,
                                          "fornecedor",
                                          "estado",
                                          null,
                                          value
                                        )
                                      }
                                    >
                                      <SelectTrigger
                                        id={`fornecedor-estado-${produto.id}`}
                                        className={
                                          validationErrors[
                                            `produto-${produtoIndex}-fornecedor-estado`
                                          ]
                                            ? "border-red-500"
                                            : ""
                                        }
                                      >
                                        <SelectValue placeholder="Selecione o estado" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {estados.map((estado) => (
                                          <SelectItem
                                            key={estado}
                                            value={estado}
                                          >
                                            {estado}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    {validationErrors[
                                      `produto-${produtoIndex}-fornecedor-estado`
                                    ] && (
                                      <p className="text-xs text-red-500">
                                        {
                                          validationErrors[
                                            `produto-${produtoIndex}-fornecedor-estado`
                                          ][0]
                                        }
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </TabsContent>

                            <TabsContent
                              value="historico"
                              className="space-y-6"
                            >
                              <Accordion
                                type="single"
                                collapsible
                                defaultValue="notasFiscais"
                              >
                                <AccordionItem value="notasFiscais">
                                  <AccordionTrigger>
                                    Histórico de Notas Fiscais
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <div className="pt-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          const notasFiscais =
                                            produto.notasFiscais || [];
                                          const novaNota = {
                                            numero: "",
                                            dataEmissao: new Date()
                                              .toISOString()
                                              .split("T")[0],
                                            valorTotal: "0",
                                          };
                                          updateProduct(
                                            produto.id,
                                            "notasFiscais",
                                            [...notasFiscais, novaNota]
                                          );
                                        }}
                                        className="mb-4"
                                      >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Adicionar Nota Fiscal
                                      </Button>

                                      {produto.notasFiscais &&
                                      produto.notasFiscais.length > 0 ? (
                                        <div className="space-y-4">
                                          {produto.notasFiscais.map(
                                            (nota, index) => (
                                              <div
                                                key={index}
                                                className="grid grid-cols-1 md:grid-cols-3 gap-4 border p-3 rounded-md"
                                              >
                                                <div className="space-y-2">
                                                  <Label
                                                    htmlFor={`nota-numero-${produto.id}-${index}`}
                                                  >
                                                    Número da NF
                                                  </Label>
                                                  <Input
                                                    id={`nota-numero-${produto.id}-${index}`}
                                                    value={nota.numero}
                                                    onChange={(e) => {
                                                      const notasFiscais = [
                                                        ...(produto.notasFiscais ||
                                                          []),
                                                      ];
                                                      notasFiscais[index] = {
                                                        ...nota,
                                                        numero: e.target.value,
                                                      };
                                                      updateProduct(
                                                        produto.id,
                                                        "notasFiscais",
                                                        notasFiscais
                                                      );
                                                    }}
                                                    placeholder="Ex: 12345"
                                                  />
                                                </div>

                                                <div className="space-y-2">
                                                  <Label
                                                    htmlFor={`nota-data-${produto.id}-${index}`}
                                                  >
                                                    Data de Emissão
                                                  </Label>
                                                  <Input
                                                    id={`nota-data-${produto.id}-${index}`}
                                                    type="date"
                                                    value={nota.dataEmissao}
                                                    onChange={(e) => {
                                                      const notasFiscais = [
                                                        ...(produto.notasFiscais ||
                                                          []),
                                                      ];
                                                      notasFiscais[index] = {
                                                        ...nota,
                                                        dataEmissao:
                                                          e.target.value,
                                                      };
                                                      updateProduct(
                                                        produto.id,
                                                        "notasFiscais",
                                                        notasFiscais
                                                      );
                                                    }}
                                                  />
                                                </div>

                                                <div className="space-y-2">
                                                  <Label
                                                    htmlFor={`nota-valor-${produto.id}-${index}`}
                                                  >
                                                    Valor Total (R$)
                                                  </Label>
                                                  <div className="flex items-center gap-2">
                                                    <Input
                                                      id={`nota-valor-${produto.id}-${index}`}
                                                      type="string"
                                                      value={nota.valorTotal}
                                                      onChange={(e) => {
                                                        const notasFiscais = [
                                                          ...(produto.notasFiscais ||
                                                            []),
                                                        ];
                                                        notasFiscais[index] = {
                                                          ...nota,
                                                          valorTotal:
                                                            e.target.value,
                                                        };
                                                        updateProduct(
                                                          produto.id,
                                                          "notasFiscais",
                                                          notasFiscais
                                                        );
                                                      }}
                                                      placeholder="Ex: 1000.00"
                                                    />
                                                    <Button
                                                      variant="ghost"
                                                      size="icon"
                                                      onClick={() => {
                                                        const notasFiscais = [
                                                          ...(produto.notasFiscais ||
                                                            []),
                                                        ];
                                                        notasFiscais.splice(
                                                          index,
                                                          1
                                                        );
                                                        updateProduct(
                                                          produto.id,
                                                          "notasFiscais",
                                                          notasFiscais
                                                        );
                                                      }}
                                                      className="h-8 w-8 text-destructive"
                                                    >
                                                      <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                  </div>
                                                </div>
                                              </div>
                                            )
                                          )}
                                        </div>
                                      ) : (
                                        <div className="text-center py-4 bg-muted/50 rounded-lg">
                                          <p className="text-muted-foreground">
                                            Nenhuma nota fiscal adicionada.
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="beneficios">
                                  <AccordionTrigger>
                                    Benefícios Fiscais
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <div className="pt-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          const beneficios =
                                            produto.beneficiosFiscais || [];
                                          const novoBeneficio = {
                                            tipo: "Isenção" as
                                              | "Isenção"
                                              | "Redução de Base"
                                              | "Diferimento"
                                              | "Crédito Presumido",
                                            descricao: "",
                                            estadoAplicavel: "",
                                          };
                                          updateProduct(
                                            produto.id,
                                            "beneficiosFiscais",
                                            [...beneficios, novoBeneficio]
                                          );
                                        }}
                                        className="mb-4"
                                      >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Adicionar Benefício Fiscal
                                      </Button>

                                      {produto.beneficiosFiscais &&
                                      produto.beneficiosFiscais.length > 0 ? (
                                        <div className="space-y-4">
                                          {produto.beneficiosFiscais.map(
                                            (beneficio, index) => (
                                              <div
                                                key={index}
                                                className="grid grid-cols-1 md:grid-cols-3 gap-4 border p-3 rounded-md"
                                              >
                                                <div className="space-y-2">
                                                  <Label
                                                    htmlFor={`beneficio-tipo-${produto.id}-${index}`}
                                                  >
                                                    Tipo de Benefício
                                                  </Label>
                                                  <Select
                                                    value={beneficio.tipo}
                                                    onValueChange={(value) => {
                                                      const beneficios = [
                                                        ...(produto.beneficiosFiscais ||
                                                          []),
                                                      ];
                                                      beneficios[index] = {
                                                        ...beneficio,
                                                        tipo: value as any,
                                                      };
                                                      updateProduct(
                                                        produto.id,
                                                        "beneficiosFiscais",
                                                        beneficios
                                                      );
                                                    }}
                                                  >
                                                    <SelectTrigger
                                                      id={`beneficio-tipo-${produto.id}-${index}`}
                                                    >
                                                      <SelectValue placeholder="Selecione o tipo" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectItem value="Isenção">
                                                        Isenção
                                                      </SelectItem>
                                                      <SelectItem value="Redução de Base">
                                                        Redução de Base
                                                      </SelectItem>
                                                      <SelectItem value="Diferimento">
                                                        Diferimento
                                                      </SelectItem>
                                                      <SelectItem value="Crédito Presumido">
                                                        Crédito Presumido
                                                      </SelectItem>
                                                    </SelectContent>
                                                  </Select>
                                                </div>

                                                <div className="space-y-2">
                                                  <Label
                                                    htmlFor={`beneficio-descricao-${produto.id}-${index}`}
                                                  >
                                                    Descrição
                                                  </Label>
                                                  <Input
                                                    id={`beneficio-descricao-${produto.id}-${index}`}
                                                    value={beneficio.descricao}
                                                    onChange={(e) => {
                                                      const beneficios = [
                                                        ...(produto.beneficiosFiscais ||
                                                          []),
                                                      ];
                                                      beneficios[index] = {
                                                        ...beneficio,
                                                        descricao:
                                                          e.target.value,
                                                      };
                                                      updateProduct(
                                                        produto.id,
                                                        "beneficiosFiscais",
                                                        beneficios
                                                      );
                                                    }}
                                                    placeholder="Descrição do benefício"
                                                  />
                                                </div>

                                                <div className="space-y-2">
                                                  <Label
                                                    htmlFor={`beneficio-estado-${produto.id}-${index}`}
                                                  >
                                                    Estado Aplicável
                                                  </Label>
                                                  <div className="flex items-center gap-2">
                                                    <Select
                                                      value={
                                                        beneficio.estadoAplicavel
                                                      }
                                                      onValueChange={(
                                                        value
                                                      ) => {
                                                        const beneficios = [
                                                          ...(produto.beneficiosFiscais ||
                                                            []),
                                                        ];
                                                        beneficios[index] = {
                                                          ...beneficio,
                                                          estadoAplicavel:
                                                            value,
                                                        };
                                                        updateProduct(
                                                          produto.id,
                                                          "beneficiosFiscais",
                                                          beneficios
                                                        );
                                                      }}
                                                    >
                                                      <SelectTrigger
                                                        id={`beneficio-estado-${produto.id}-${index}`}
                                                      >
                                                        <SelectValue placeholder="Selecione o estado" />
                                                      </SelectTrigger>
                                                      <SelectContent>
                                                        {estados.map(
                                                          (estado) => (
                                                            <SelectItem
                                                              key={estado}
                                                              value={estado}
                                                            >
                                                              {estado}
                                                            </SelectItem>
                                                          )
                                                        )}
                                                      </SelectContent>
                                                    </Select>
                                                    <Button
                                                      variant="ghost"
                                                      size="icon"
                                                      onClick={() => {
                                                        const beneficios = [
                                                          ...(produto.beneficiosFiscais ||
                                                            []),
                                                        ];
                                                        beneficios.splice(
                                                          index,
                                                          1
                                                        );
                                                        updateProduct(
                                                          produto.id,
                                                          "beneficiosFiscais",
                                                          beneficios
                                                        );
                                                      }}
                                                      className="h-8 w-8 text-destructive"
                                                    >
                                                      <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                  </div>
                                                </div>
                                              </div>
                                            )
                                          )}
                                        </div>
                                      ) : (
                                        <div className="text-center py-4 bg-muted/50 rounded-lg">
                                          <p className="text-muted-foreground">
                                            Nenhum benefício fiscal adicionado.
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="historicoClassificacao">
                                  <AccordionTrigger>
                                    Histórico de Classificação Fiscal
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <div className="pt-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          const historico =
                                            produto.historicoClassificacao ||
                                            [];
                                          const novoHistorico = {
                                            ncmAnterior: "",
                                            dataAlteracao: new Date()
                                              .toISOString()
                                              .split("T")[0],
                                            motivo: "",
                                          };
                                          updateProduct(
                                            produto.id,
                                            "historicoClassificacao",
                                            [...historico, novoHistorico]
                                          );
                                        }}
                                        className="mb-4"
                                      >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Adicionar Histórico
                                      </Button>

                                      {produto.historicoClassificacao &&
                                      produto.historicoClassificacao.length >
                                        0 ? (
                                        <div className="space-y-4">
                                          {produto.historicoClassificacao.map(
                                            (historico, index) => (
                                              <div
                                                key={index}
                                                className="grid grid-cols-1 md:grid-cols-3 gap-4 border p-3 rounded-md"
                                              >
                                                <div className="space-y-2">
                                                  <Label
                                                    htmlFor={`historico-ncm-${produto.id}-${index}`}
                                                  >
                                                    NCM Anterior
                                                  </Label>
                                                  <Input
                                                    id={`historico-ncm-${produto.id}-${index}`}
                                                    value={
                                                      historico.ncmAnterior
                                                    }
                                                    onChange={(e) => {
                                                      const historicoList = [
                                                        ...(produto.historicoClassificacao ||
                                                          []),
                                                      ];
                                                      historicoList[index] = {
                                                        ...historico,
                                                        ncmAnterior:
                                                          e.target.value,
                                                      };
                                                      updateProduct(
                                                        produto.id,
                                                        "historicoClassificacao",
                                                        historicoList
                                                      );
                                                    }}
                                                    placeholder="Ex: 8471.30.19"
                                                  />
                                                </div>

                                                <div className="space-y-2">
                                                  <Label
                                                    htmlFor={`historico-data-${produto.id}-${index}`}
                                                  >
                                                    Data da Alteração
                                                  </Label>
                                                  <Input
                                                    id={`historico-data-${produto.id}-${index}`}
                                                    type="date"
                                                    value={
                                                      historico.dataAlteracao
                                                    }
                                                    onChange={(e) => {
                                                      const historicoList = [
                                                        ...(produto.historicoClassificacao ||
                                                          []),
                                                      ];
                                                      historicoList[index] = {
                                                        ...historico,
                                                        dataAlteracao:
                                                          e.target.value,
                                                      };
                                                      updateProduct(
                                                        produto.id,
                                                        "historicoClassificacao",
                                                        historicoList
                                                      );
                                                    }}
                                                  />
                                                </div>

                                                <div className="space-y-2">
                                                  <Label
                                                    htmlFor={`historico-motivo-${produto.id}-${index}`}
                                                  >
                                                    Motivo
                                                  </Label>
                                                  <div className="flex items-center gap-2">
                                                    <Input
                                                      id={`historico-motivo-${produto.id}-${index}`}
                                                      value={historico.motivo}
                                                      onChange={(e) => {
                                                        const historicoList = [
                                                          ...(produto.historicoClassificacao ||
                                                            []),
                                                        ];
                                                        historicoList[index] = {
                                                          ...historico,
                                                          motivo:
                                                            e.target.value,
                                                        };
                                                        updateProduct(
                                                          produto.id,
                                                          "historicoClassificacao",
                                                          historicoList
                                                        );
                                                      }}
                                                      placeholder="Ex: Atualização de legislação"
                                                    />
                                                    <Button
                                                      variant="ghost"
                                                      size="icon"
                                                      onClick={() => {
                                                        const historicoList = [
                                                          ...(produto.historicoClassificacao ||
                                                            []),
                                                        ];
                                                        historicoList.splice(
                                                          index,
                                                          1
                                                        );
                                                        updateProduct(
                                                          produto.id,
                                                          "historicoClassificacao",
                                                          historicoList
                                                        );
                                                      }}
                                                      className="h-8 w-8 text-destructive"
                                                    >
                                                      <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                  </div>
                                                </div>
                                              </div>
                                            )
                                          )}
                                        </div>
                                      ) : (
                                        <div className="text-center py-4 bg-muted/50 rounded-lg">
                                          <p className="text-muted-foreground">
                                            Nenhum histórico de classificação
                                            adicionado.
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
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
                    Nenhum produto adicionado. Clique em "Adicionar Produto"
                    para começar.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() =>
                router.push(`/dashboard/nova-analise?client_id=${clientId}`)
              }
              disabled={isLoading}
            >
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
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Iniciar Análise
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
