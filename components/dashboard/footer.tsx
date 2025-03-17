"use client"

import { useRouter } from "next/navigation"
import { HelpCircle, LogOut, CreditCard } from "lucide-react"

export default function Footer() {
  const router = useRouter()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t py-4 px-6 bg-muted/50 text-muted-foreground text-sm dark:bg-muted/10 dark:border-gray-800">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <p>© {currentYear} NCM IA. Todos os direitos reservados.</p>
          <p className="text-xs mt-1">Versão 1.0.2</p>
        </div>

        <div className="flex gap-6">
          <button
            onClick={() => router.push("/suporte")}
            className="flex items-center gap-1 hover:text-primary transition-colors"
          >
            <HelpCircle size={14} />
            <span>Suporte</span>
          </button>

          <button
            onClick={() => router.push("/planos")}
            className="flex items-center gap-1 hover:text-primary transition-colors"
          >
            <CreditCard size={14} />
            <span>Planos</span>
          </button>

          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1 hover:text-destructive transition-colors"
          >
            <LogOut size={14} />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </footer>
  )
}

