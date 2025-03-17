"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Loader2, CreditCard, Building2, ArrowRight, Check, ArrowLeft } from "lucide-react"

const checkoutSchema = z
  .object({
    paymentMethod: z.enum(["credit", "invoice"]),
    cardName: z.string().min(2, { message: "Nome no cartão é obrigatório" }).optional(),
    cardNumber: z.string().min(16, { message: "Número do cartão inválido" }).max(19).optional(),
    cardExpiry: z.string().min(5, { message: "Data de expiração inválida" }).optional(),
    cardCvc: z.string().min(3, { message: "CVC inválido" }).optional(),
    address: z.string().min(5, { message: "Endereço é obrigatório" }),
    city: z.string().min(2, { message: "Cidade é obrigatória" }),
    state: z.string().min(2, { message: "Estado é obrigatório" }),
    zipCode: z.string().min(5, { message: "CEP é obrigatório" }),
  })
  .refine(
    (data) => {
      // Validar campos do cartão apenas se o método de pagamento for cartão de crédito
      if (data.paymentMethod === "credit") {
        return !!data.cardName && !!data.cardNumber && !!data.cardExpiry && !!data.cardCvc
      }
      return true
    },
    {
      message: "Preencha todos os campos do cartão de crédito",
      path: ["cardName"],
    },
  )

type CheckoutFormValues = z.infer<typeof checkoutSchema>

interface PlanInfo {
  id: string
  name: string
  price: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planId = searchParams.get("plan")

  const [isLoading, setIsLoading] = useState(false)
  const [planInfo, setPlanInfo] = useState<PlanInfo | null>(null)

  // Planos disponíveis
  const availablePlans: Record<string, PlanInfo> = {
    basic: { id: "basic", name: "Básico", price: "R$ 49,90" },
    pro: { id: "pro", name: "Profissional", price: "R$ 99,90" },
    enterprise: { id: "enterprise", name: "Empresarial", price: "R$ 199,90" },
  }

  useEffect(() => {
    if (planId && availablePlans[planId]) {
      setPlanInfo(availablePlans[planId])
    } else {
      router.push("/cadastro/planos")
    }
  }, [planId, router])

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      cardName: "",
      cardNumber: "",
      cardExpiry: "",
      cardCvc: "",
      paymentMethod: "credit",
      address: "",
      city: "",
      state: "",
      zipCode: "",
    },
  })

  const paymentMethod = form.watch("paymentMethod")

  const handleSubmit = async (values: CheckoutFormValues) => {
    setIsLoading(true)

    // Simulando processamento de pagamento
    setTimeout(() => {
      setIsLoading(false)
      router.push("/cadastro/sucesso")
    }, 2000)
  }

  if (!planInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl font-bold mb-2">Finalizar assinatura</h1>
            <p className="text-gray-600">
              Complete suas informações de pagamento para começar a usar o plano {planInfo.name}
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="md:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle>Informações de pagamento</CardTitle>
                <CardDescription>Escolha como deseja pagar sua assinatura</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-3"
                            >
                              <div className="flex items-center space-x-3 rounded-md border p-4">
                                <RadioGroupItem value="credit" id="credit" />
                                <Label htmlFor="credit" className="flex items-center gap-2 cursor-pointer">
                                  <CreditCard className="h-5 w-5 text-blue-600" />
                                  <div>
                                    <p className="font-medium">Cartão de crédito</p>
                                    <p className="text-sm text-gray-500">Pague com seu cartão de crédito</p>
                                  </div>
                                </Label>
                              </div>

                              <div className="flex items-center space-x-3 rounded-md border p-4">
                                <RadioGroupItem value="invoice" id="invoice" />
                                <Label htmlFor="invoice" className="flex items-center gap-2 cursor-pointer">
                                  <Building2 className="h-5 w-5 text-blue-600" />
                                  <div>
                                    <p className="font-medium">Boleto bancário</p>
                                    <p className="text-sm text-gray-500">Pague via boleto bancário</p>
                                  </div>
                                </Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {paymentMethod === "credit" && (
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="cardName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700">Nome no cartão</FormLabel>
                              <FormControl>
                                <Input {...field} className="h-11" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="cardNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700">Número do cartão</FormLabel>
                              <FormControl>
                                <Input {...field} className="h-11" placeholder="0000 0000 0000 0000" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="cardExpiry"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700">Data de expiração</FormLabel>
                                <FormControl>
                                  <Input {...field} className="h-11" placeholder="MM/AA" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="cardCvc"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700">CVC</FormLabel>
                                <FormControl>
                                  <Input {...field} className="h-11" placeholder="123" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Endereço de cobrança</h3>

                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Endereço</FormLabel>
                            <FormControl>
                              <Input {...field} className="h-11" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700">Cidade</FormLabel>
                              <FormControl>
                                <Input {...field} className="h-11" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700">Estado</FormLabel>
                                <FormControl>
                                  <Input {...field} className="h-11" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="zipCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-700">CEP</FormLabel>
                                <FormControl>
                                  <Input {...field} className="h-11" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full sm:w-auto"
                        onClick={() => router.push("/cadastro/planos")}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar
                      </Button>

                      <Button
                        type="submit"
                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processando...
                          </>
                        ) : (
                          <>
                            Finalizar assinatura
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Card>
              <CardHeader>
                <CardTitle>Resumo do pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="font-medium">Plano</span>
                    <span>{planInfo.name}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium">Período</span>
                    <span>Mensal</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-medium">
                    <span>Subtotal</span>
                    <span>{planInfo.price}</span>
                  </div>

                  <div className="flex justify-between text-gray-500">
                    <span>Impostos</span>
                    <span>Inclusos</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">{planInfo.price}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 rounded-b-lg">
                <div className="w-full space-y-2">
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5" />
                    <span className="text-sm">Você pode cancelar a qualquer momento. Sem taxas de cancelamento.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5" />
                    <span className="text-sm">Suporte técnico incluído em todos os planos.</span>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

