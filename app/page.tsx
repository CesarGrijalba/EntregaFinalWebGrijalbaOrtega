"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Newspaper, User, Calendar, ArrowRight, Sparkles } from "lucide-react";

export default function HomePage() {
  const [news, setNews] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [selectedSection, setSelectedSection] = useState<string>("Todas");
  const [loading, setLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // 🔹 Verificar sesión activa
      const user = await getCurrentUser();
      setIsLogged(!!user);

      // 🔹 Cargar noticias publicadas
      const { data: newsData, error: newsError } = await supabase
        .from("news")
        .select(
          "id, titulo, subtitulo, contenido, categoria, imagen, autor, fechacreacion"
        )
        .eq("estado", "Publicado")
        .order("fechacreacion", { ascending: false });

      if (!newsError && newsData) setNews(newsData);

      // 🔹 Cargar secciones
      const { data: sectionsData } = await supabase
        .from("sections")
        .select("id, nombre")
        .order("nombre", { ascending: true });

      setSections(sectionsData || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  const filteredNews =
    selectedSection === "Todas"
      ? news
      : news.filter((n) => n.categoria === selectedSection);

  // 🔹 Redirigir según sesión
  const handleAccessClick = () => {
    if (isLogged) router.push("/dashboard/news");
    else router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* HEADER */}
      <header className="border-b bg-gradient-to-r from-primary via-secondary to-accent shadow-lg">
        <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-4">
            <div className="p-2 bg-white/10 rounded-2xl backdrop-blur-sm">
              <img
                src="https://www.qhuboibague.com/wp-content/uploads/2021/10/cropped-Logo_Q_hubo.png"
                alt="Logo Q'hubo Ibagué"
                className="h-14 w-auto hover:opacity-90 transition-opacity"
              />
            </div>
          </Link>

          {/* Botón de acceso */}
          <Button
            onClick={handleAccessClick}
            variant="secondary"
            className="shadow-md hover:shadow-lg transition-all"
          >
            {isLogged ? "Ir al Panel" : "Acceso Admin"}
          </Button>
        </div>
      </header>

      {/* SECCIONES */}
      <div className="sticky top-0 z-10 border-b bg-card/95 backdrop-blur-md shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              Explora por sección
            </h2>
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
                variant={
                  selectedSection === section.nombre ? "default" : "outline"
                }
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

      {/* MAIN */}
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            {selectedSection === "Todas"
              ? "Todas las Noticias"
              : selectedSection}
          </h2>
          <p className="text-muted-foreground text-lg">
            {loading
              ? "Cargando noticias..."
              : `${filteredNews.length} ${
                  filteredNews.length === 1
                    ? "noticia encontrada"
                    : "noticias encontradas"
                }`}
          </p>
        </div>

        {loading ? (
          <Card className="border-2 border-dashed">
            <CardContent className="py-16 text-center">
              <Newspaper className="h-20 w-20 mx-auto text-muted-foreground/50 mb-6" />
              <h3 className="text-2xl font-semibold mb-3 text-foreground">
                Cargando noticias...
              </h3>
            </CardContent>
          </Card>
        ) : filteredNews.length === 0 ? (
          <Card className="border-2 border-dashed">
            <CardContent className="py-16 text-center">
              <Newspaper className="h-20 w-20 mx-auto text-muted-foreground/50 mb-6" />
              <h3 className="text-2xl font-semibold mb-3 text-foreground">
                No hay noticias en esta sección
              </h3>
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
                        {item.fechacreacion
                          ? new Date(item.fechacreacion).toLocaleDateString(
                              "es-CO"
                            )
                          : ""}
                      </div>
                    </div>
                    <CardTitle className="line-clamp-2 text-2xl group-hover:text-primary transition-colors text-balance">
                      {item.titulo}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-base text-pretty">
                      {item.subtitulo}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
                      {item.contenido}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span className="font-medium">
                          Publicado por {item.autor || "Anónimo"}
                        </span>
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

      {/* FOOTER */}
      <footer className="border-t bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 mt-20">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">
            © 2025 Portal Q'hubo Caquetá — Desarrollado por{" "}
            <span className="font-semibold text-primary">
              César Grijalba y Ana Sofía Pérez
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
}
