import fs from "fs";

const FILE = "./usuarios.json";
let usuarios = [];

// Cargar usuarios desde archivo
try {
  if (fs.existsSync(FILE)) {
    const contenido = fs.readFileSync(FILE, "utf-8");
    usuarios = contenido ? JSON.parse(contenido) : [];
  }
} catch (error) {
  console.error("Error al leer usuarios.json:", error);
  usuarios = [];
}

// Guardar usuarios en archivo
function guardarUsuarios() {
  fs.writeFileSync(FILE, JSON.stringify(usuarios, null, 2));
}

// Crear usuario nuevo
export function crearUsuario(req, res) {
  const { nombre, password } = req.body;
  if (!nombre || !password) {
    return res.status(400).json({ error: "Faltan datos" });
  }
  if (usuarios.find(u => u.nombre === nombre)) {
    return res.status(400).json({ error: "Usuario ya existe" });
  }
  const nuevoUsuario = { nombre, password, fondo: "white" };
  usuarios.push(nuevoUsuario);
  guardarUsuarios();
  res.status(201).json({ mensaje: "Usuario creado", usuario: nuevoUsuario });
}

// Login
export function loginUsuario(req, res) {
  const { nombre, password } = req.body;
  const usuario = usuarios.find(u => u.nombre === nombre && u.password === password);
  if (!usuario) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }
  res.json({ mensaje: "Login exitoso", usuario });
}

// Editar perfil (nombre y/o contraseña)
export function editarUsuario(req, res) {
  const { nombre, password, nuevoNombre, nuevoPassword } = req.body;
  const usuario = usuarios.find(u => u.nombre === nombre && u.password === password);
  if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

  if (nuevoNombre) usuario.nombre = nuevoNombre;
  if (nuevoPassword) usuario.password = nuevoPassword;

  guardarUsuarios();
  res.json({ mensaje: "Perfil actualizado", usuario });
}

// Cambiar fondo
export function cambiarFondo(req, res) {
  const { nombre, fondo } = req.body;
  const usuario = usuarios.find(u => u.nombre === nombre);
  if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

  usuario.fondo = fondo;
  guardarUsuarios();
  res.json({ mensaje: "Fondo actualizado", usuario });
}

