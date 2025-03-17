"use client"

import LoginForm from "@/components/login-form"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <header className="w-full py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">NCM IA</div>
          <div className="text-sm text-gray-600">
            Precisa de ajuda?{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Contato
            </a>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left side - Features */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden md:block"
          >
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-800">
                Simplifique a classificação fiscal com Inteligência Artificial
              </h2>
              <p className="text-gray-600">
                Nossa plataforma utiliza tecnologia avançada para automatizar a classificação NCM dos seus produtos,
                reduzindo erros e economizando tempo.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-medium">Classificação Rápida</h3>
                  <p className="text-sm text-gray-500 mt-1">Processe centenas de produtos em minutos</p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-medium">Alta Precisão</h3>
                  <p className="text-sm text-gray-500 mt-1">Algoritmos treinados com milhares de produtos</p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-medium">Relatórios Detalhados</h3>
                  <p className="text-sm text-gray-500 mt-1">Documentação completa para auditoria fiscal</p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-medium">Suporte Especializado</h3>
                  <p className="text-sm text-gray-500 mt-1">Equipe de especialistas em comércio exterior</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right side - Login form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-md mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-8">
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <h1 className="text-3xl font-bold text-gray-800">Bem-vindo</h1>
                    <p className="text-gray-500 mt-2">Faça login para continuar</p>
                  </motion.div>
                </div>
                <LoginForm />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-4 px-6 bg-white border-t">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <div>© {new Date().getFullYear()} NCM IA. Todos os direitos reservados.</div>
          <div className="flex gap-6 mt-2 md:mt-0">
            <a href="#" className="hover:text-blue-600">
              Termos de Uso
            </a>
            <a href="#" className="hover:text-blue-600">
              Privacidade
            </a>
            <a href="#" className="hover:text-blue-600">
              Suporte
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

