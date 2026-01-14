import express from "express";
import tareasRoutes from "./routes/tareas.js";
import path from "path";
import { fileURLToPath } from "url";
import usuariosRoutes from "./routes/usuarios.js";




const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});

app.use(express.json());

// Rutas de API
app.use("/tareas", tareasRoutes);
app.use("/usuarios", usuariosRoutes);
// Ruta inicial de prueba
app.get("/", (req, res) => {
  res.send("API de tareas funcionando 🚀");
});

// 🔹 Servir frontend SOLO en producción
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "vistade-la-app/build")));
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "vistade-la-app/build", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});