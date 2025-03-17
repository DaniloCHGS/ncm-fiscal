"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowRight, Loader2, Calendar, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function TesteGratuitoPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isAgreed, setIsAgreed] = useState(false)

  const handleContinue = () => {
    if (!isAgreed) return

    setIsLoading(true)

    // Simulando processamento
    setTimeout(() => {
      setIsLoading(false)
      router.push("/cadastro/sucesso")
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Teste Gratuito</h1>
          <p className="text-gray-600">Experimente todas as funcionalidades do NCM IA gratuitamente por 3 dias.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-blue-600">Período de Teste</CardTitle>
              <CardDescription className="text-center">
                Conheça os benefícios do seu período de teste gratuito
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-blue-800">3 dias de acesso completo</h3>
                    <p className="text-sm text-blue-700">Sem compromisso e sem necessidade de cartão de crédito</p>
                  </div>
                </div>

                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Acesso a todas as funcionalidades do plano Profissional</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Até 50 análises de produtos durante o período de teste</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Suporte técnico completo por email e chat</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Cancelamento automático ao final do período de teste</span>
                  </li>
                </ul>
              </div>

              <div className="flex items-start space-x-2 pt-4">
                <Checkbox
                  id="terms"
                  checked={isAgreed}
                  onCheckedChange={(checked) => setIsAgreed(checked as boolean)}
                  className="mt-1"
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Estou ciente que este é um período de teste gratuito de 3 dias
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Ao final do período, sua conta será automaticamente convertida para o plano gratuito com recursos
                    limitados.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                onClick={handleContinue}
                disabled={!isAgreed || isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    Criar minha conta gratuita
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <div className="text-center text-sm text-gray-500">
                <Link href="/cadastro/planos" className="text-blue-600 hover:underline">
                  Voltar para os planos
                </Link>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

