"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getPublishedNews, type News } from "@/lib/news"
import { getActiveSections, type Section } from "@/lib/sections"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Newspaper, User, Calendar, ArrowRight, Sparkles } from "lucide-react"

export default function HomePage() {
  const [news, setNews] = useState<News[]>([])
  const [sections, setSections] = useState<Section[]>([])
  const [selectedSection, setSelectedSection] = useState<string>("Todas")

  useEffect(() => {
    setNews(getPublishedNews())
    setSections(getActiveSections())
  }, [])

  const filteredNews = selectedSection === "Todas" ? news : news.filter((n) => n.categoria === selectedSection)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <header className="border-b bg-gradient-to-r from-primary via-secondary to-accent shadow-lg">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Newspaper className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white text-balance">Noticias Corporativas</h1>
                <p className="text-white/90 text-lg mt-1">Tu fuente de información empresarial</p>
              </div>
            </div>
            <Link href="/auth/login">
              <Button variant="secondary" size="lg" className="shadow-xl hover:scale-105 transition-transform">
                <User className="mr-2 h-5 w-5" />
                Acceso Admin
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="sticky top-0 z-10 border-b bg-card/95 backdrop-blur-md shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Explora por sección</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <Button
              variant={selectedSection === "Todas" ? "default" : "outline"}
              onClick={() => setSelectedSection("Todas")}
              size="lg"
              className="rounded-full font-semibold shadow-sm hover:shadow-md transition-all"
            >
              Todas las Noticias
            </Button>
            {sections.map((section) => (
              <Button
                key={section.id}
                variant={selectedSection === section.nombre ? "default" : "outline"}
                onClick={() => setSelectedSection(section.nombre)}
                size="lg"
                className="rounded-full font-semibold shadow-sm hover:shadow-md transition-all whitespace-nowrap"
              >
                {section.nombre}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            {selectedSection === "Todas" ? "Todas las Noticias" : selectedSection}
          </h2>
          <p className="text-muted-foreground text-lg">
            {filteredNews.length} {filteredNews.length === 1 ? "noticia encontrada" : "noticias encontradas"}
          </p>
        </div>

        {filteredNews.length === 0 ? (
          <Card className="border-2 border-dashed">
            <CardContent className="py-16 text-center">
              <Newspaper className="h-20 w-20 mx-auto text-muted-foreground/50 mb-6" />
              <h3 className="text-2xl font-semibold mb-3 text-foreground">No hay noticias en esta sección</h3>
              <p className="text-muted-foreground text-lg">Vuelve pronto para ver las últimas actualizaciones</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredNews.map((item) => (
              <Link key={item.id} href={`/noticia/${item.id}`} className="group">
                <Card className="h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 overflow-hidden">
                  {item.imagen && (
                    <div className="aspect-video w-full overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
                      <img
                        src={item.imagen || "/placeholder.svg"}
                        alt={item.titulo}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <CardHeader className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-gradient-to-r from-primary to-secondary text-white font-semibold px-3 py-1">
                        {item.categoria}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(item.fechaCreacion).toLocaleDateString("es-ES")}
                      </div>
                    </div>
                    <CardTitle className="line-clamp-2 text-2xl group-hover:text-primary transition-colors text-balance">
                      {item.titulo}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-base text-pretty">{item.subtitulo}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">{item.contenido}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span className="font-medium">{item.autor}</span>
                      </div>
                      <div className="flex items-center gap-1 text-primary font-semibold group-hover:gap-2 transition-all">
                        Leer más
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 mt-20">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">
            © 2025 Portal de Noticias Corporativas - Cesar Grijalba y Ana Sofia Pérez
          </p>
        </div>
      </footer>
    </div>
  )
}
