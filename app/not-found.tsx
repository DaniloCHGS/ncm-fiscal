"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, ArrowLeft, Home } from "lucide-react"

export default function NotFoundPage() {
  const router = useRouter()

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
            <CardTitle className="text-2xl font-bold">Página não encontrada</CardTitle>
            <CardDescription>Desculpe, não conseguimos encontrar a página que você está procurando.</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="bg-red-50 p-4 rounded-lg text-center mb-4">
              <p className="text-sm text-red-800">O endereço que você tentou acessar não existe ou foi movido.</p>
            </div>
            <p className="text-gray-600">Verifique se o URL está correto ou volte para a página inicial.</p>
          </CardContent>
          <CardFooter className="flex justify-center gap-4 pb-6">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <Button onClick={() => router.push("/dashboard")} className="bg-blue-600 hover:bg-blue-700">
              <Home className="mr-2 h-4 w-4" />
              Página inicial
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

