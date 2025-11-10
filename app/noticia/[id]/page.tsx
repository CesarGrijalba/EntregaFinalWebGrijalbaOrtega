"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { getNewsById, type News } from "@/lib/news"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Calendar, User, Share2 } from "lucide-react"

export default function NewsDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [news, setNews] = useState<News | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadNews = () => {
      const id = params.id as string
      const item = getNewsById(id)

      if (!item || item.estado !== "Publicado") {
        router.push("/")
        return
      }

      setNews(item)
      setLoading(false)
    }

    loadNews()
  }, [params.id, router])

  if (loading || !news) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground text-lg">Cargando noticia...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <header className="border-b bg-gradient-to-r from-primary via-secondary to-accent shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <Button
            variant="secondary"
            onClick={() => router.push("/")}
            size="lg"
            className="shadow-lg hover:scale-105 transition-transform"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Volver al inicio
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <article>
          <div className="mb-8">
            <Badge className="bg-gradient-to-r from-primary to-secondary text-white font-semibold px-4 py-2 text-base mb-4">
              {news.categoria}
            </Badge>
            <h1 className="text-5xl font-bold mb-6 text-balance leading-tight bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              {news.titulo}
            </h1>
            <h2 className="text-2xl text-muted-foreground mb-8 text-pretty leading-relaxed">{news.subtitulo}</h2>

            <Card className="p-6 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 border-2">
              <div className="flex flex-wrap items-center gap-6 text-base">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Autor</p>
                    <p className="font-semibold text-foreground">{news.autor}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary/10 rounded-full">
                    <Calendar className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Publicado</p>
                    <p className="font-semibold text-foreground">
                      {new Date(news.fechaCreacion).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="ml-auto bg-transparent">
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartir
                </Button>
              </div>
            </Card>
          </div>

          {news.imagen && (
            <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl border-4 border-primary/20">
              <img src={news.imagen || "/placeholder.svg"} alt={news.titulo} className="w-full h-auto" />
            </div>
          )}

          <Card className="p-8 md:p-12 shadow-xl border-2">
            <div className="prose prose-lg max-w-none">
              <p className="whitespace-pre-wrap text-foreground leading-relaxed text-lg">{news.contenido}</p>
            </div>
          </Card>

          <div className="mt-12 text-center">
            <Button
              onClick={() => router.push("/")}
              size="lg"
              className="shadow-lg hover:scale-105 transition-transform"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Ver más noticias
            </Button>
          </div>
        </article>
      </main>
    </div>
  )
}
