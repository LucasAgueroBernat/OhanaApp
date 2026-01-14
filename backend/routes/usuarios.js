import { Router } from "express";
import { crearUsuario, loginUsuario, editarUsuario, cambiarFondo } from "../controllers/usuariosController.js";

const router = Router();

router.post("/registro", crearUsuario);
router.post("/login", loginUsuario);
router.put("/editar", editarUsuario);
router.put("/fondo", cambiarFondo);

export default router;

