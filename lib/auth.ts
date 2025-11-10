// lib/auth.ts
import { supabase } from '@/lib/supabase';

export type AuthUser = {
  id: string;
  nombre: string;
  email: string;
  rol: 'reportero' | 'editor';
};

// lib/auth.ts
export const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;

  const user = data.user;
  const { data: profile } = await supabase
    .from('users')
    .select('nombre, rol')
    .eq('id', user.id)
    .single();

  if (!profile) {
    throw new Error('Perfil de usuario no encontrado');
  }

  return {
    id: user.id,
    email: user.email!,
    nombre: profile.nombre || email.split('@')[0],
    rol: (profile.rol as any) || 'reportero', // ← ¡Este campo es clave!
  };
};
export const register = async (email: string, password: string, nombre: string, rol: 'reportero' | 'editor' = 'reportero') => {
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: email.trim(),
    password: password.trim(),
  });

  if (signUpError) throw signUpError;
  if (!signUpData.user) throw new Error('No se creó el usuario');

  // Iniciar sesión inmediatamente
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password: password.trim(),
  });

  if (signInError) throw signInError;
  if (!signInData.user) throw new Error('No se pudo iniciar sesión');

  // Crear perfil en tabla users
  const { error: insertError } = await supabase
    .from('users')
    .insert({
      id: signInData.user.id,
      email: email.trim(),
      nombre: nombre || email.split('@')[0],
      rol,
    })
    .select()
    .single();

  if (insertError) {
    console.error("Error al crear perfil:", insertError);
    throw new Error("Error al crear el perfil del usuario");
  }

  return {
    id: signInData.user.id,
    email: email.trim(),
    nombre: nombre || email.split('@')[0],
    rol,
  };
};

export const logout = async () => {
  await supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('users')
    .select('nombre, rol')
    .eq('id', user.id)
    .single();

  return {
    id: user.id,
    email: user.email!,
    nombre: profile?.nombre || user.email!.split('@')[0],
    rol: (profile?.rol as any) || 'reportero',
  };
};