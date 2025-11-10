import { supabase } from "./supabase";

/**
 * 🔹 Registra un nuevo usuario y lo inserta en la tabla "users".
 */
export async function register(
  email: string,
  password: string,
  nombre: string,
  rol: string = "reportero"
) {
  // Crear el usuario en el sistema de autenticación
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error("❌ Error al registrar usuario:", error.message);
    throw error;
  }

  // Si el usuario se creó correctamente, insertarlo en la tabla "users"
  if (data.user) {
    const { error: userError } = await supabase.from("users").insert([
      {
        id: data.user.id,
        email,
        nombre,
        rol,
      },
    ]);

    if (userError) {
      console.error("❌ Error al insertar usuario en tabla users:", userError.message);
      throw userError;
    }
  }

  return data.user;
}

/**
 * 🔹 Inicia sesión con email y contraseña.
 */
export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("❌ Error al iniciar sesión:", error.message);
    throw error;
  }

  return data.user;
}

/**
 * 🔹 Cierra la sesión actual.
 */
export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("❌ Error al cerrar sesión:", error.message);
    throw error;
  }
}

/**
 * 🔹 Obtiene el usuario autenticado actual (si existe sesión).
 */
export async function getCurrentUser() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error("❌ Error al obtener el usuario actual:", error.message);
      return null;
    }

    return user;
  } catch (err: any) {
    console.error("❌ Error inesperado al obtener el usuario:", err.message);
    return null;
  }
}

/**
 * 🔹 Retorna el perfil completo desde la tabla "users" según el ID del usuario autenticado.
 * (opcional pero útil si guardas nombre y rol aparte en la DB)
 */
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from("users")
    .select("id, nombre, email, rol")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("❌ Error al obtener perfil del usuario:", error.message);
    return null;
  }

  return data;
}
