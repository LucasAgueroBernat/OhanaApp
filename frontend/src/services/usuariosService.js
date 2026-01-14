const API_URL = "https://ohanaapp.onrender.com";

/**
 * Registro de usuario
 * @param {Object} datos { nombre, email, password }
 */
export async function registroUsuario(datos) {
  const res = await fetch(`${API_URL}/usuarios/registro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  return res.json();
}

/**
 * Login de usuario
 * @param {Object} datos { email, password }
 */
export async function loginUsuario(datos) {
  const res = await fetch(`${API_URL}/usuarios/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  return res.json();
}

/**
 * Editar perfil de usuario
 * @param {Object} datos { email, nuevoNombre, nuevaPassword }
 */
export async function editarUsuario(datos) {
  const res = await fetch(`${API_URL}/usuarios/editar`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  return res.json();
}

/**
 * Cambiar fondo de usuario
 * @param {Object} datos { email, fondo }
 */
export async function cambiarFondo(datos) {
  const res = await fetch(`${API_URL}/usuarios/fondo`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  return res.json();
}