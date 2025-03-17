"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { Moon, Sun, Monitor, Save, Lock, Globe } from "lucide-react"
import { useTheme } from "next-themes"

export default function ConfiguracoesPage() {
  const { theme, setTheme } = useTheme()
  const [notifications, setNotifications] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [language, setLanguage] = useState("pt-BR")
  const [saving, setSaving] = useState(false)

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      toast({
        title: "Configurações salvas",
        description: "Suas preferências foram atualizadas com sucesso.",
      })
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-blue-600">Configurações</h1>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Tabs defaultValue="appearance" className="space-y-6">
          <TabsList>
            <TabsTrigger value="appearance">Aparência</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="language">Idioma</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
          </TabsList>

          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Aparência</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Tema</Label>
                  <RadioGroup
                    defaultValue={theme}
                    onValueChange={(value) => setTheme(value)}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    <div>
                      <RadioGroupItem value="light" id="theme-light" className="peer sr-only" />
                      <Label
                        htmlFor="theme-light"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 [&:has([data-state=checked])]:border-blue-600 [&:has([data-state=checked])]:bg-blue-50 cursor-pointer"
                      >
                        <Sun className="h-6 w-6 mb-2 text-amber-500" />
                        <span className="font-medium">Claro</span>
                      </Label>
                    </div>

                    <div>
                      <RadioGroupItem value="dark" id="theme-dark" className="peer sr-only" />
                      <Label
                        htmlFor="theme-dark"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 [&:has([data-state=checked])]:border-blue-600 [&:has([data-state=checked])]:bg-blue-50 cursor-pointer"
                      >
                        <Moon className="h-6 w-6 mb-2 text-blue-700" />
                        <span className="font-medium">Escuro</span>
                      </Label>
                    </div>

                    <div>
                      <RadioGroupItem value="system" id="theme-system" className="peer sr-only" />
                      <Label
                        htmlFor="theme-system"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 [&:has([data-state=checked])]:border-blue-600 [&:has([data-state=checked])]:bg-blue-50 cursor-pointer"
                      >
                        <Monitor className="h-6 w-6 mb-2 text-gray-700" />
                        <span className="font-medium">Sistema</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700" disabled={saving}>
                    {saving ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Salvar alterações
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notificações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notificações no sistema</Label>
                      <p className="text-sm text-gray-500">
                        Receba notificações sobre atualizações e atividades no sistema.
                      </p>
                    </div>
                    <Switch checked={notifications} onCheckedChange={setNotifications} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notificações por e-mail</Label>
                      <p className="text-sm text-gray-500">
                        Receba notificações por e-mail sobre atualizações importantes.
                      </p>
                    </div>
                    <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700" disabled={saving}>
                    {saving ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Salvar alterações
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="language">
            <Card>
              <CardHeader>
                <CardTitle>Idioma</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Selecione o idioma</Label>
                  <RadioGroup
                    defaultValue={language}
                    onValueChange={setLanguage}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div>
                      <RadioGroupItem value="pt-BR" id="lang-pt" className="peer sr-only" />
                      <Label
                        htmlFor="lang-pt"
                        className="flex items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 [&:has([data-state=checked])]:border-blue-600 [&:has([data-state=checked])]:bg-blue-50 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <Globe className="h-5 w-5 text-blue-600" />
                          <div>
                            <span className="font-medium">Português (Brasil)</span>
                            <p className="text-xs text-gray-500">Português do Brasil</p>
                          </div>
                        </div>
                      </Label>
                    </div>

                    <div>
                      <RadioGroupItem value="en-US" id="lang-en" className="peer sr-only" />
                      <Label
                        htmlFor="lang-en"
                        className="flex items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 [&:has([data-state=checked])]:border-blue-600 [&:has([data-state=checked])]:bg-blue-50 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <Globe className="h-5 w-5 text-blue-600" />
                          <div>
                            <span className="font-medium">English (US)</span>
                            <p className="text-xs text-gray-500">American English</p>
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700" disabled={saving}>
                    {saving ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Salvar alterações
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Segurança</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Autenticação de dois fatores</Label>
                      <p className="text-sm text-gray-500">Adicione uma camada extra de segurança à sua conta.</p>
                    </div>
                    <Button variant="outline" className="gap-2">
                      <Lock className="h-4 w-4" />
                      Configurar
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Sessões ativas</Label>
                      <p className="text-sm text-gray-500">Gerencie os dispositivos conectados à sua conta.</p>
                    </div>
                    <Button variant="outline" className="gap-2">
                      Gerenciar
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700" disabled={saving}>
                    {saving ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Salvar alterações
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}

