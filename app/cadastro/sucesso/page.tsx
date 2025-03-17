"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ArrowRight } from "lucide-react"

export default function SucessoPage() {
  const router = useRouter()

  // Redirecionar para a página de login após 5 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/")
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white rounded-2xl shadow-xl overflow-hidden text-center">
          <CardHeader className="pb-2">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Cadastro concluído!</CardTitle>
            <CardDescription>Sua conta foi criada com sucesso e sua assinatura está ativa.</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-gray-600">
              Você será redirecionado para a página de login em alguns segundos. Use o email e senha que você cadastrou
              para acessar sua conta.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center pb-6">
            <Button onClick={() => router.push("/")} className="bg-blue-600 hover:bg-blue-700">
              Ir para o login
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

