"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ArrowLeft } from "lucide-react"

export default function FormularioEnviadoPage() {
  const router = useRouter()

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
            <CardTitle className="text-2xl font-bold">Formulário Enviado!</CardTitle>
            <CardDescription>Seus produtos foram enviados com sucesso para análise.</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-gray-600">
              Obrigado por enviar seus produtos para análise. Nossa equipe irá processar as informações e entraremos em
              contato em breve.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center pb-6">
            <Button onClick={() => router.push("/")} className="bg-blue-600 hover:bg-blue-700">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para o início
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

