"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { getSections, createSection, updateSection, deleteSection, type Section } from "@/lib/sections"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Plus, Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"

export default function SectionsPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [sections, setSections] = useState<Section[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSection, setEditingSection] = useState<Section | null>(null)
  const [nombre, setNombre] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [orden, setOrden] = useState(1)
  const [activa, setActiva] = useState(true)

  useEffect(() => {
    if (!loading && (!user || user.rol !== "editor")) {
      router.push("/dashboard")
      return
    }

    loadSections()
  }, [user, loading, router])

  const loadSections = () => {
    setSections(getSections().sort((a, b) => a.orden - b.orden))
  }

  const handleOpenDialog = (section?: Section) => {
    if (section) {
      setEditingSection(section)
      setNombre(section.nombre)
      setDescripcion(section.descripcion)
      setOrden(section.orden)
      setActiva(section.activa)
    } else {
      setEditingSection(null)
      setNombre("")
      setDescripcion("")
      setOrden(sections.length + 1)
      setActiva(true)
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingSection) {
      updateSection(editingSection.id, { nombre, descripcion, orden, activa })
      toast.success("Sección actualizada")
    } else {
      createSection({ nombre, descripcion, orden, activa })
      toast.success("Sección creada")
    }

    loadSections()
    setIsDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de eliminar esta sección?")) {
      deleteSection(id)
      loadSections()
      toast.success("Sección eliminada")
    }
  }

  if (loading || !user) {
    return null
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

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Gestión de Secciones</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Nueva Sección
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingSection ? "Editar Sección" : "Nueva Sección"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Input id="descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orden">Orden</Label>
                  <Input
                    id="orden"
                    type="number"
                    value={orden}
                    onChange={(e) => setOrden(Number.parseInt(e.target.value))}
                    min={1}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="activa" checked={activa} onCheckedChange={setActiva} />
                  <Label htmlFor="activa">Sección activa</Label>
                </div>
                <Button type="submit" className="w-full">
                  {editingSection ? "Guardar Cambios" : "Crear Sección"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {sections.map((section) => (
            <Card key={section.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{section.nombre}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{section.descripcion}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>Orden: {section.orden}</span>
                      <span className={section.activa ? "text-green-600" : "text-red-600"}>
                        {section.activa ? "Activa" : "Inactiva"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleOpenDialog(section)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(section.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
