import { supabaseServer as supabase } from "@/lib/supabaseServer";
import { notFound } from "next/navigation";
import { Calendar, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function NoticiaPage({
  params,
}: {
  params: { id: string };
}) {
  // 1️⃣ Traemos la noticia desde Supabase
  const { data: noticia, error } = await supabase
    .from("news")
    .select(
      "id, titulo, subtitulo, contenido, categoria, imagen, autor, fechacreacion, estado"
    )
    .eq("id", params.id)
    .eq("estado", "Publicado")
    .single();

  if (error || !noticia) {
    console.error("Error al cargar noticia:", error);
    notFound();
  }

  return (
    <main className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Botón volver */}
        <div className="flex justify-start">
          <Link
            href="/"
            className="flex items-center text-primary hover:underline mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Volver al inicio
          </Link>
        </div>

        {/* Contenedor principal */}
        <Card className="shadow-lg">
          {/* Imagen */}
          {noticia.imagen && (
            <div className="w-full aspect-video overflow-hidden rounded-t-lg">
              <img
                src={noticia.imagen}
                alt={noticia.titulo}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Cabecera */}
          <CardHeader>
            <Badge className="mb-2">{noticia.categoria}</Badge>
            <CardTitle className="text-3xl font-bold">
              {noticia.titulo}
            </CardTitle>
            {noticia.subtitulo && (
              <p className="text-muted-foreground text-lg mt-2">
                {noticia.subtitulo}
              </p>
            )}

            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" /> {noticia.autor}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />{" "}
                {new Date(noticia.fechacreacion).toLocaleDateString("es-CO", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </CardHeader>

          {/* Contenido */}
          <CardContent>
            <article className="prose max-w-none text-foreground leading-relaxed">
              {noticia.contenido}
            </article>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
