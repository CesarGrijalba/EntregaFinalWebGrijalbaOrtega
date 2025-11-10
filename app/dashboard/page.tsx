// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { getNews, getNewsByAuthor, updateNews, deleteNews } from "@/lib/news";
import { logout } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogOut, Plus, Edit, Trash2, CheckCircle, XCircle, Settings } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, setUser } = useAuth();
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
      return;
    }

    if (user) {
      if (user.rol === "reportero") {
        setNews(getNewsByAuthor(user.id));
      } else {
        setNews(getNews());
      }
    }
  }, [user, loading, router]);

  const handleLogout = () => {
    logout();
    setUser(null);
    router.push("/");
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    const updated = updateNews(id, { estado: newStatus });
    if (updated) {
      setNews((prev) => prev.map((n) => (n.id === id ? updated : n)));
      toast.success("Estado actualizado");
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de eliminar esta noticia?")) {
      if (deleteNews(id)) {
        setNews((prev) => prev.filter((n) => n.id !== id));
        toast.success("Noticia eliminada");
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      Edición: "secondary",
      Terminado: "default",
      Publicado: "default",
      Desactivado: "destructive",
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Panel Administrativo</h1>
              <p className="text-sm text-muted-foreground">
                {user.nombre} - {user.rol === "reportero" ? "Reportero" : "Editor"}
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/">
                <Button variant="outline">Ver Sitio Público</Button>
              </Link>
              {user.rol === "editor" && (
                <Link href="/dashboard/sections">
                  <Button variant="outline">
                    <Settings className="mr-2 h-4 w-4" />
                    Secciones
                  </Button>
                </Link>
              )}
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">{user.rol === "reportero" ? "Mis Noticias" : "Todas las Noticias"}</h2>
          <Link href="/dashboard/news/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Noticia
            </Button>
          </Link>
        </div>

        {news.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No hay noticias aún</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {news.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusBadge(item.estado)}
                        <span className="text-xs text-muted-foreground">{item.categoria}</span>
                      </div>
                      <CardTitle>{item.titulo}</CardTitle>
                      <CardDescription>{item.subtitulo}</CardDescription>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Por {item.autor} • {new Date(item.fechaCreacion).toLocaleDateString("es-ES")}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {user.rol === "reportero" && (item.estado === "Edición" || item.estado === "Terminado") && (
                        <>
                          <Link href={`/dashboard/news/${item.id}`}>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          {item.estado === "Edición" && (
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleStatusChange(item.id, "Terminado")}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Marcar Terminado
                            </Button>
                          )}
                        </>
                      )}
                      {user.rol === "editor" && (
                        <>
                          <Link href={`/dashboard/news/${item.id}`}>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          {item.estado === "Terminado" && (
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleStatusChange(item.id, "Publicado")}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Publicar
                            </Button>
                          )}
                          {item.estado === "Publicado" && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleStatusChange(item.id, "Desactivado")}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Desactivar
                            </Button>
                          )}
                          <Button size="sm" variant="outline" onClick={() => handleDelete(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}