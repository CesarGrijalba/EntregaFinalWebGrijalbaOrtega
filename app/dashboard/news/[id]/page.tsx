"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { getNewsById, updateNews } from "@/lib/news"
import { getSections } from "@/lib/sections"
import { uploadImage } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"

export default function EditNewsPage() {
  const router = useRouter()
  const params = useParams()
  const { user, loading } = useAuth()
  const [sections, setSections] = useState<string[]>([])
  const [titulo, setTitulo] = useState("")
  const [subtitulo, setSubtitulo] = useState("")
  const [contenido, setContenido] = useState("")
  const [categoria, setCategoria] = useState("")
  const [imagen, setImagen] = useState("")
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [newsLoaded, setNewsLoaded] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
      return
    }

    if (user && !newsLoaded) {
      const id = params.id as string
      const news = getNewsById(id)

      if (!news) {
        router.push("/dashboard")
        return
      }

      if (user.rol === "reportero" && news.autorId !== user.id) {
        toast.error("No tienes permiso para editar esta noticia")
        router.push("/dashboard")
        return
      }

      setTitulo(news.titulo)
      setSubtitulo(news.subtitulo)
      setContenido(news.contenido)
      setCategoria(news.categoria)
      setImagen(news.imagen)

      const sectionsList = getSections()
      setSections(sectionsList.map((s) => s.nombre))
      setNewsLoaded(true)
    }
  }, [user, loading, router, params.id, newsLoaded])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const url = await uploadImage(file)
      setImagen(url)
      toast.success("Imagen cargada")
    } catch (error) {
      toast.error("Error al cargar imagen")
    }
    setUploading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSaving(true)
    try {
      const id = params.id as string
      updateNews(id, {
        titulo,
        subtitulo,
        contenido,
        categoria,
        imagen,
      })
      toast.success("Noticia actualizada")
      router.push("/dashboard")
    } catch (error) {
      toast.error("Error al actualizar noticia")
    }
    setSaving(false)
  }

  if (loading || !user || !newsLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Editar Noticia</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título *</Label>
                <Input id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitulo">Subtítulo / Bajante *</Label>
                <Input id="subtitulo" value={subtitulo} onChange={(e) => setSubtitulo(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoria">Categoría *</Label>
                <Select value={categoria} onValueChange={setCategoria}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map((section) => (
                      <SelectItem key={section} value={section}>
                        {section}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contenido">Contenido *</Label>
                <Textarea
                  id="contenido"
                  value={contenido}
                  onChange={(e) => setContenido(e.target.value)}
                  rows={10}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imagen">Imagen</Label>
                <div className="flex gap-2">
                  <Input id="imagen" type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                  {uploading && <span className="text-sm text-muted-foreground">Subiendo...</span>}
                </div>
                {imagen && (
                  <div className="mt-2">
                    <img src={imagen || "/placeholder.svg"} alt="Preview" className="max-w-xs rounded-lg" />
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>
                  {saving ? "Guardando..." : "Guardar Cambios"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
