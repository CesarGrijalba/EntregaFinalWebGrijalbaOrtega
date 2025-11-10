"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function EditNewsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [news, setNews] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .eq("id", id)
        .single();
      if (error) toast.error("Error cargando noticia");
      else setNews(data);
      setLoading(false);
    };
    fetchNews();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!news) return;
    const { error } = await supabase
      .from("news")
      .update({
        titulo: news.titulo,
        subtitulo: news.subtitulo,
        contenido: news.contenido,
        categoria: news.categoria,
        estado: news.estado,
        fecha_actualizacion: new Date().toISOString(),
      })
      .eq("id", id);
    if (error) toast.error("Error al actualizar");
    else toast.success("Noticia actualizada");
    router.push("/dashboard/news");
  };

  if (loading) return <p className="p-6">Cargando...</p>;
  if (!news) return <p className="p-6">Noticia no encontrada</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Editar noticia</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdate} className="space-y-4">
            <Input
              value={news.titulo}
              onChange={(e) => setNews({ ...news, titulo: e.target.value })}
              placeholder="Título"
            />
            <Input
              value={news.subtitulo}
              onChange={(e) => setNews({ ...news, subtitulo: e.target.value })}
              placeholder="Subtítulo"
            />
            <Textarea
              value={news.contenido}
              onChange={(e) => setNews({ ...news, contenido: e.target.value })}
              placeholder="Contenido"
              rows={6}
            />
            <Input
              value={news.categoria}
              onChange={(e) => setNews({ ...news, categoria: e.target.value })}
              placeholder="Categoría"
            />
            <select
              value={news.estado}
              onChange={(e) => setNews({ ...news, estado: e.target.value })}
              className="border p-2 rounded w-full"
            >
              <option>Edicion</option>
              <option>Terminado</option>
              <option>Publicado</option>
              <option>Desactivado</option>
            </select>
            <Button type="submit" className="w-full">
              Guardar cambios
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
