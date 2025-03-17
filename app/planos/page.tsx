"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, ArrowRight, Loader2, Crown, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface PlanFeature {
  included: boolean
  text: string
}

interface Plan {
  id: string
  name: string
  price: string
  description: string
  features: PlanFeature[]
  popular?: boolean
}

export default function PlanosPage() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const plans: Plan[] = [
    {
      id: "basic",
      name: "Básico",
      price: "R$ 49,90",
      description: "Ideal para pequenos negócios",
      features: [
        { included: true, text: "Até 100 clientes" },
        { included: true, text: "Até 3 usuários" },
        { included: true, text: "Suporte por email" },
        { included: false, text: "Relatórios avançados" },
        { included: false, text: "API de integração" },
        { included: false, text: "Suporte prioritário" },
      ],
    },
    {
      id: "pro",
      name: "Profissional",
      price: "R$ 99,90",
      description: "Para empresas em crescimento",
      features: [
        { included: true, text: "Até 1.000 clientes" },
        { included: true, text: "Até 10 usuários" },
        { included: true, text: "Suporte por email e chat" },
        { included: true, text: "Relatórios avançados" },
        { included: false, text: "API de integração" },
        { included: false, text: "Suporte prioritário" },
      ],
      popular: true,
    },
    {
      id: "enterprise",
      name: "Empresarial",
      price: "R$ 199,90",
      description: "Para grandes empresas",
      features: [
        { included: true, text: "Clientes ilimitados" },
        { included: true, text: "Usuários ilimitados" },
        { included: true, text: "Suporte por email, chat e telefone" },
        { included: true, text: "Relatórios avançados" },
        { included: true, text: "API de integração" },
        { included: true, text: "Suporte prioritário" },
      ],
    },
  ]

  const handleContinue = () => {
    if (!selectedPlan) return

    setIsLoading(true)

    // Simulando processamento
    setTimeout(() => {
      setIsLoading(false)
      router.push(`/cadastro/checkout?plan=${selectedPlan}`)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Atualize seu plano</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Escolha o plano que melhor se adapta às suas necessidades e aproveite todos os recursos disponíveis.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className={cn(
                  "h-full flex flex-col relative overflow-hidden transition-all duration-200",
                  selectedPlan === plan.id && "ring-2 ring-blue-600 shadow-lg",
                  plan.popular && "shadow-lg",
                )}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
                      Mais popular
                    </div>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {plan.name}
                    {plan.popular && <Crown className="ml-2 h-4 w-4 text-amber-500" />}
                  </CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-gray-500 ml-1">/mês</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <div
                          className={cn(
                            "rounded-full p-1 mr-2 mt-0.5",
                            feature.included ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400",
                          )}
                        >
                          <Check className="h-3 w-3" />
                        </div>
                        <span className={feature.included ? "text-gray-700" : "text-gray-400"}>{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    variant={selectedPlan === plan.id ? "default" : "outline"}
                    className={cn("w-full", selectedPlan === plan.id && "bg-blue-600 hover:bg-blue-700")}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {selectedPlan === plan.id ? "Selecionado" : "Selecionar"}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center space-y-4">
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!selectedPlan || isLoading}
            className="bg-blue-600 hover:bg-blue-700 px-8"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                Continuar para pagamento
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

          <div className="text-center text-sm text-gray-500">
            <Button variant="link" onClick={() => router.push("/dashboard")} className="text-blue-600">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para o dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

