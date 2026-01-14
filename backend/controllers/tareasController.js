import fs from "fs";

const FILE = "./tareas.json";
let tareas = [];

// Inicializar tareas desde el archivo si existe
try {
  if (fs.existsSync(FILE)) {
    const contenido = fs.readFileSync(FILE, "utf-8");
    tareas = contenido ? JSON.parse(contenido) : [];
  }
} catch (error) {
  console.error("Error al leer tareas.json, inicializando vacío:", error);
  tareas = [];
}

// Guardar tareas en archivo
function guardarTareas() {
  fs.writeFileSync(FILE, JSON.stringify(tareas, null, 2));
}

// Listar tareas
export function listarTareas(req, res) {
  res.json(tareas);
}

// Crear tarea
export function crearTarea(req, res) {
  const { id, titulo, categoria, responsable } = req.body;
  if (!id || !titulo) {
    return res.status(400).json({ error: "La tarea debe tener 'id' y 'titulo'" });
  }
  if (tareas.find(t => t.id == id)) {
    return res.status(400).json({ error: "Ya existe una tarea con ese id" });
  }
  const nuevaTarea = { 
    id, 
    titulo, 
    categoria: categoria || "General", 
    responsable: responsable || "Sin asignar", 
    estado: "pendiente" 
  };
  tareas.push(nuevaTarea);
  guardarTareas();
  res.status(201).json(nuevaTarea);
}

// Actualizar estado de tarea
export function actualizarEstado(req, res) {
  const { id } = req.params;
  const { estado } = req.body;
  const validos = ["pendiente", "en curso", "completada"];
  if (!validos.includes(estado)) {
    return res.status(400).json({ error: "Estado inválido" });
  }
  const tarea = tareas.find(t => t.id == id);
  if (!tarea) return res.status(404).send("Tarea no encontrada");
  tarea.estado = estado;
  guardarTareas();
  res.json(tarea);
}

// Asignar responsable
export function asignarResponsable(req, res) {
  const { id } = req.params;
  const { responsable } = req.body;
  const tarea = tareas.find(t => t.id == id);
  if (!tarea) return res.status(404).send("Tarea no encontrada");
  tarea.responsable = responsable || "Sin asignar";
  guardarTareas();
  res.json(tarea);
}

// Eliminar tarea
export function eliminarTarea(req, res) {
  const { id } = req.params;
  const tareaExistente = tareas.find(t => t.id == id);
  if (!tareaExistente) return res.status(404).send("Tarea no encontrada");
  tareas = tareas.filter(t => t.id != id);
  guardarTareas();
  res.send("Tarea eliminada");
}