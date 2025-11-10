// lib/news.ts
import { supabase } from '@/lib/supabase';

export type News = {
  id: string;
  titulo: string;
  subtitulo: string;
  contenido: string;
  categoria: string;
  imagen: string;
  autor: string;
  autorId: string;
  estado: 'Edición' | 'Terminado' | 'Publicado' | 'Desactivado';
  fechaCreacion: string;
  fechaActualizacion: string;
};

export const createNews = async (data: Omit<News, 'id' | 'fechaCreacion' | 'fechaActualizacion' | 'autorId'>) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('Usuario no autenticado');

  const { data: newNews, error } = await supabase
    .from('news')
    .insert([
      {
        ...data,
        autorId: user.id,
        autor: data.autor,
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return newNews as News;
};

export const getPublishedNews = async (): Promise<News[]> => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('estado', 'Publicado')
    .order('fechaCreacion', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getNewsByAuthor = async (authorId: string): Promise<News[]> => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('autorId', authorId)
    .order('fechaCreacion', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getNews = async (): Promise<News[]> => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('fechaCreacion', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getNewsById = async (id: string): Promise<News | null> => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data as News;
};

export const updateNews = async (id: string, updates: Partial<News>): Promise<News> => {
  const { data, error } = await supabase
    .from('news')
    .update({
      ...updates,
      fechaActualizacion: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as News;
};

export const deleteNews = async (id: string): Promise<void> => {
  const { error } = await supabase.from('news').delete().eq('id', id);
  if (error) throw error;
};