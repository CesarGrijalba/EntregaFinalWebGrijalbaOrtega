export type NewsStatus = "Edición" | "Terminado" | "Publicado" | "Desactivado"

export interface News {
  id: string
  titulo: string
  subtitulo: string
  contenido: string
  categoria: string
  imagen: string
  autor: string
  autorId: string
  fechaCreacion: string
  fechaActualizacion: string
  estado: NewsStatus
}

const NEWS_KEY = "cms_news"

export function getNews(): News[] {
  if (typeof window === "undefined") return []
  const news = localStorage.getItem(NEWS_KEY)
  return news ? JSON.parse(news) : []
}

export function getNewsByAuthor(autorId: string): News[] {
  return getNews().filter((n) => n.autorId === autorId)
}

export function getPublishedNews(): News[] {
  return getNews().filter((n) => n.estado === "Publicado")
}

export function getNewsById(id: string): News | null {
  return getNews().find((n) => n.id === id) || null
}

export function createNews(news: Omit<News, "id" | "fechaCreacion" | "fechaActualizacion">): News {
  const allNews = getNews()
  const newNews: News = {
    ...news,
    id: Date.now().toString(),
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString(),
  }

  allNews.push(newNews)
  localStorage.setItem(NEWS_KEY, JSON.stringify(allNews))

  return newNews
}

export function updateNews(id: string, updates: Partial<News>): News | null {
  const allNews = getNews()
  const index = allNews.findIndex((n) => n.id === id)

  if (index === -1) return null

  allNews[index] = {
    ...allNews[index],
    ...updates,
    fechaActualizacion: new Date().toISOString(),
  }

  localStorage.setItem(NEWS_KEY, JSON.stringify(allNews))

  return allNews[index]
}

export function deleteNews(id: string): boolean {
  const allNews = getNews()
  const filtered = allNews.filter((n) => n.id !== id)

  if (filtered.length === allNews.length) return false

  localStorage.setItem(NEWS_KEY, JSON.stringify(filtered))
  return true
}
