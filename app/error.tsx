"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    // Opcional: log do erro para um serviço de monitoramento
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white rounded-2xl shadow-xl overflow-hidden text-center">
          <CardHeader className="pb-2">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-red-100 p-3">
                <AlertTriangle className="h-12 w-12 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Ocorreu um erro</CardTitle>
            <CardDescription>Desculpe, encontramos um problema ao processar sua solicitação.</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="bg-red-50 p-4 rounded-lg text-left mb-4">
              <p className="text-sm text-red-800 font-mono break-all">{error.message || "Erro desconhecido"}</p>
            </div>
            <p className="text-gray-600">Você pode tentar novamente ou voltar para a página anterior.</p>
          </CardContent>
          <CardFooter className="flex justify-center gap-4 pb-6">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <Button onClick={() => reset()} className="bg-blue-600 hover:bg-blue-700">
              <RefreshCw className="mr-2 h-4 w-4" />
              Tentar novamente
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

