import { Router } from "express";
import {
  listarTareas,
  crearTarea,
  actualizarEstado,
  asignarResponsable,
  eliminarTarea
} from "../controllers/tareasController.js";

const router = Router();

// Listar todas las tareas
router.get("/", listarTareas);

// Crear nueva tarea
router.post("/", crearTarea);

// Cambiar estado de una tarea (pendiente, en curso, completada)
router.put("/:id/estado", actualizarEstado);

// Asignar responsable a una tarea
router.put("/:id/responsable", asignarResponsable);

// Eliminar tarea
router.delete("/:id", eliminarTarea);

export default router;