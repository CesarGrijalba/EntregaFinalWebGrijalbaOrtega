export interface Section {
  id: string
  nombre: string
  descripcion: string
  orden: number
  activa: boolean
}

const SECTIONS_KEY = "cms_sections"

export function initializeSections() {
  if (typeof window === "undefined") return

  const sections = getSections()
  if (sections.length === 0) {
    const defaultSections: Section[] = [
      { id: "1", nombre: "Tecnología", descripcion: "Noticias sobre tecnología e innovación", orden: 1, activa: true },
      { id: "2", nombre: "Deportes", descripcion: "Noticias deportivas", orden: 2, activa: true },
      { id: "3", nombre: "Política", descripcion: "Noticias políticas y gubernamentales", orden: 3, activa: true },
      { id: "4", nombre: "Cultura", descripcion: "Arte, música y entretenimiento", orden: 4, activa: true },
      { id: "5", nombre: "Economía", descripcion: "Noticias económicas y financieras", orden: 5, activa: true },
    ]
    localStorage.setItem(SECTIONS_KEY, JSON.stringify(defaultSections))
  }
}

export function getSections(): Section[] {
  if (typeof window === "undefined") return []
  const sections = localStorage.getItem(SECTIONS_KEY)
  return sections ? JSON.parse(sections) : []
}

export function getActiveSections(): Section[] {
  return getSections()
    .filter((s) => s.activa)
    .sort((a, b) => a.orden - b.orden)
}

export function createSection(section: Omit<Section, "id">): Section {
  const sections = getSections()
  const newSection: Section = {
    ...section,
    id: Date.now().toString(),
  }

  sections.push(newSection)
  localStorage.setItem(SECTIONS_KEY, JSON.stringify(sections))

  return newSection
}

export function updateSection(id: string, updates: Partial<Section>): Section | null {
  const sections = getSections()
  const index = sections.findIndex((s) => s.id === id)

  if (index === -1) return null

  sections[index] = { ...sections[index], ...updates }
  localStorage.setItem(SECTIONS_KEY, JSON.stringify(sections))

  return sections[index]
}

export function deleteSection(id: string): boolean {
  const sections = getSections()
  const filtered = sections.filter((s) => s.id !== id)

  if (filtered.length === sections.length) return false

  localStorage.setItem(SECTIONS_KEY, JSON.stringify(filtered))
  return true
}
