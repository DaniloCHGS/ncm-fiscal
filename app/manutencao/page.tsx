"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Wrench, Clock, ArrowLeft, RefreshCw } from "lucide-react"

export default function ManutencaoPage() {
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
              <div className="rounded-full bg-blue-100 p-3">
                <Wrench className="h-12 w-12 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Sistema em Manutenção</CardTitle>
            <CardDescription>Estamos realizando melhorias para oferecer uma experiência ainda melhor.</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center justify-center gap-2 text-blue-600 mb-4">
              <Clock className="h-5 w-5" />
              <p className="font-medium">Previsão de retorno: 22:00h</p>
            </div>
            <p className="text-gray-600">
              Nossa equipe está trabalhando para concluir a manutenção o mais rápido possível. Agradecemos sua
              compreensão e paciência.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center gap-4 pb-6">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">
              <RefreshCw className="mr-2 h-4 w-4" />
              Tentar novamente
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

