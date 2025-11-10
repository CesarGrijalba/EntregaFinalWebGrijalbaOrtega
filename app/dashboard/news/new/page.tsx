"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function NewNewsPage() {
  const router = useRouter();

  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [categoria, setCategoria] = useState("");
  const [imagen, setImagen] = useState("");
  const [autor, setAutor] = useState<string>("");
  const [autorId, setAutorId] = useState<string>("");
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Cargar usuario actual y secciones disponibles
  useEffect(() => {
    const fetchData = async () => {
      const user = await getCurrentUser();

      if (!user) {
        toast.error("No hay sesión activa.");
        router.push("/auth/login");
        return;
      }

      // Guardar ID de usuario en memoria
      setAutorId(user.id);

      // Obtener nombre desde tabla users
      const { data: userProfile, error: userError } = await supabase
        .from("users")
        .select("nombre")
        .eq("id", user.id)
        .single();

      if (userError) {
        console.error("Error al obtener usuario:", userError);
        toast.error("No se pudo cargar el perfil del autor.");
      } else if (userProfile) {
        setAutor(userProfile.nombre);
      }

      // Obtener secciones
      const { data: sectionsData, error: sectionsError } = await supabase
        .from("sections")
        .select("id, nombre")
        .order("nombre", { ascending: true });

      if (sectionsError) {
        console.error("Error cargando secciones:", sectionsError);
      } else {
        setSections(sectionsData || []);
      }
    };

    fetchData();
  }, [router]);

  // 🔹 Guardar noticia
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!titulo || !contenido || !categoria) {
      toast.warning("Por favor completa los campos obligatorios.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.from("news").insert([
        {
          titulo,
          subtitulo,
          contenido,
          categoria,
          imagen,
          autor,
          autor_id: autorId,
          estado: "Edición",
          fechacreacion: new Date().toISOString(),
          fecha_actualizacion: new Date().toISOString(),
        },
      ]);

      if (error) {
        console.error("Error al crear noticia:", error);
        toast.error("❌ Error al guardar la noticia");
      } else {
        toast.success("✅ Noticia creada correctamente");
        router.push("/dashboard/news");
      }
    } catch (err) {
      console.error("Error inesperado:", err);
      toast.error("Error inesperado al crear la noticia");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold text-foreground mb-4">
        📰 Crear nueva noticia
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label>Título *</Label>
          <Input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Título principal de la noticia"
          />
        </div>

        <div>
          <Label>Subtítulo</Label>
          <Input
            value={subtitulo}
            onChange={(e) => setSubtitulo(e.target.value)}
            placeholder="Subtítulo o resumen breve"
          />
        </div>

        <div>
          <Label>Contenido *</Label>
          <Textarea
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            placeholder="Escribe el cuerpo completo de la noticia"
            className="min-h-[180px]"
          />
        </div>

        <div>
          <Label>Categoría *</Label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="w-full border rounded-md p-2"
          >
            <option value="">Seleccionar categoría</option>
            {sections.map((section) => (
              <option key={section.id} value={section.nombre}>
                {section.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label>Imagen (URL)</Label>
          <Input
            value={imagen}
            onChange={(e) => setImagen(e.target.value)}
            placeholder="https://ejemplo.com/imagen.jpg"
          />
        </div>

        <div className="bg-muted rounded-md p-3 text-sm text-muted-foreground">
          Autor:{" "}
          <span className="font-semibold text-foreground">
            {autor || "Cargando..."}
          </span>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Guardar noticia"}
        </Button>
      </form>
    </div>
  );
}
