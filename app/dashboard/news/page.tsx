"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getCurrentUser, logout } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function DashboardNewsPage() {
  const router = useRouter();

  const [news, setNews] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [selectedSection, setSelectedSection] = useState<string>("Todas");
  const [filter, setFilter] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const user = await getCurrentUser();
      if (!user) {
        router.push("/");
        return;
      }

      const { data: userProfile } = await supabase
        .from("users")
        .select("nombre, rol")
        .eq("id", user.id)
        .single();

      setUserRole(userProfile?.rol || "reportero");
      setUserName(userProfile?.nombre || "Usuario");

      const { data: sectionsData } = await supabase
        .from("sections")
        .select("id, nombre")
        .order("nombre", { ascending: true });
      setSections(sectionsData || []);

      const { data: newsData, error } = await supabase
        .from("news")
        .select("id, titulo, estado, categoria, fechacreacion, autor")
        .order("fechacreacion", { ascending: false });

      if (error) toast.error("Error cargando noticias");
      else setNews(newsData || []);

      setLoading(false);
    };

    fetchData();
  }, [router]);

  const filteredNews = news
    .filter((n) =>
      selectedSection === "Todas" ? true : n.categoria === selectedSection
    )
    .filter(
      (n) =>
        n.titulo.toLowerCase().includes(filter.toLowerCase()) ||
        n.autor.toLowerCase().includes(filter.toLowerCase())
    )
    .filter((n) => (userRole === "editor" ? true : n.autor === userName));

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Sesión cerrada correctamente 👋");
      router.push("/");
    } catch (error) {
      console.error("❌ Error al cerrar sesión:", error);
      toast.error("Error al cerrar sesión");
    }
  };

  if (loading) return <p className="p-6">Cargando...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* 🔹 Encabezado principal con logo */}
      <div className="flex justify-between items-center flex-wrap gap-4 border-b pb-4">
        <Link href="/" className="flex items-center gap-3">
          <img
            src="https://www.qhuboibague.com/wp-content/uploads/2021/10/cropped-Logo_Q_hubo.png"
            alt="Logo Q'hubo Ibagué"
            className="h-12 w-auto hover:opacity-90 transition-opacity"
          />
        </Link>

        <div className="flex gap-2 items-center">
          {userRole === "reportero" && (
            <Link href="/dashboard/news/new">
              <Button>+ Nueva noticia</Button>
            </Link>
          )}
          <Button variant="outline" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </div>
      </div>

      {/* 🔍 Barra de búsqueda */}
      <div className="flex gap-3">
        <Input
          placeholder="Buscar por título o autor..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full"
        />
      </div>

      {/* 🏷️ Filtro por secciones */}
      <div className="flex flex-wrap gap-2 border-b pb-4">
        <Button
          variant={selectedSection === "Todas" ? "default" : "outline"}
          onClick={() => setSelectedSection("Todas")}
          className="rounded-full"
        >
          Todas
        </Button>
        {sections.map((section) => (
          <Button
            key={section.id}
            variant={
              selectedSection === section.nombre ? "default" : "outline"
            }
            onClick={() => setSelectedSection(section.nombre)}
            className="rounded-full"
          >
            {section.nombre}
          </Button>
        ))}
      </div>

      {/* 📰 Listado de noticias */}
      {filteredNews.length === 0 ? (
        <p className="text-muted-foreground text-center mt-10">
          No hay noticias que coincidan con el filtro.
        </p>
      ) : (
        <div className="space-y-4">
          {filteredNews.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{item.titulo}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Autor: {item.autor}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Categoría: {item.categoria}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Estado: <Badge>{item.estado}</Badge>
                    </p>
                  </div>
                  {userRole === "editor" && (
                    <Link href={`/dashboard/news/${item.id}`}>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </Link>
                  )}
                </div>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                Fecha:{" "}
                {item.fechacreacion
                  ? new Date(item.fechacreacion).toLocaleDateString("es-CO")
                  : "Sin fecha"}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
