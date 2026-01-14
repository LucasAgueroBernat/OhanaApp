import { useEffect, useState } from "react";
import "./App.css";
import React from "react";

const BASE_URL = "/tareas"; // proxy al backend

function App() {
  const [tareas, setTareas] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("General");
  const [responsable, setResponsable] = useState("");
  const [usuario, setUsuario] = useState(null);

  // auth
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");

  // edición de perfil
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoPassword, setNuevoPassword] = useState("");

  // fondo
  const [fondo, setFondo] = useState("white");

  // Login
  async function login(e) {
    e.preventDefault();
    const res = await fetch("/usuarios/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, password }),
    });
    const data = await res.json();
    if (res.ok) {
      setUsuario({ ...data.usuario, password });
      setFondo(data.usuario.fondo || "white");
      setNombre("");
      setPassword("");
    } else {
      alert(data.error || "Error de login");
    }
  }

  // Registro
  async function registro(e) {
    e.preventDefault();
    const res = await fetch("/usuarios/registro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, password }),
    });
    const data = await res.json();
    if (res.ok) {
      alert("Usuario creado, ahora podés ingresar");
      setNombre("");
      setPassword("");
    } else {
      alert(data.error || "No se pudo crear el usuario");
    }
  }

  // Editar perfil
  async function editarPerfil(e) {
    e.preventDefault();
    try {
      const res = await fetch("/usuarios/editar", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: usuario.nombre,
          password: usuario.password,
          nuevoNombre,
          nuevoPassword,
        }),
      });

      const text = await res.text();
      if (!res.ok) {
        alert("Error al actualizar perfil");
        return;
      }

      const data = JSON.parse(text);
      setUsuario({
        ...data.usuario,
        password: nuevoPassword || usuario.password,
      });
      setNuevoNombre("");
      setNuevoPassword("");
      alert("Perfil actualizado");
    } catch (err) {
      console.error("Error en fetch editar:", err);
      alert("No se pudo conectar al servidor");
    }
  }

  // Cambiar fondo
  async function cambiarFondoAPI(nuevoFondo) {
    const res = await fetch("/usuarios/fondo", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre: usuario.nombre, fondo: nuevoFondo }),
    });

    const text = await res.text();
    try {
      const data = JSON.parse(text);
      if (res.ok) {
        setUsuario(data.usuario);
        setFondo(data.usuario.fondo);
      } else {
        alert(data.error || "No se pudo cambiar el fondo");
      }
    } catch {
      console.error("Respuesta no JSON (fondo):", text);
      alert("Error al cambiar el fondo");
    }
  }

  // Logout
  function logout() {
    setUsuario(null);
    setNombre("");
    setPassword("");
    setNuevoNombre("");
    setNuevoPassword("");
    setFondo("white");
  }

  const miembros = ["Mamá", "Papá", "Lucas", "Jonas", "Alana", "Ainhoa"];

  // Cargar tareas
  useEffect(() => {
    cargarTareas();
  }, []);

  async function cargarTareas() {
    const res = await fetch(BASE_URL);
    const data = await res.json();
    setTareas(data);
  }

  async function crearTarea(e) {
    e.preventDefault();
    if (!titulo.trim()) return;
    const id = Date.now();
    await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, titulo, categoria, responsable }),
    });
    setTitulo("");
    setResponsable("");
    setCategoria("General");
    cargarTareas();
  }

  async function setEstado(id, estado) {
    await fetch(`${BASE_URL}/${id}/estado`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado }),
    });
    cargarTareas();
  }

  async function setResponsableAPI(id, responsable) {
    await fetch(`${BASE_URL}/${id}/responsable`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ responsable }),
    });
    cargarTareas();
  }

  async function eliminarTarea(id) {
    await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
    cargarTareas();
  }

  function renderTarea(t) {
    return (
      <li
        key={t.id}
        style={{
          margin: "8px 0",
          padding: "10px",
          background: "#f9f9f9",
          borderRadius: 8,
        }}
      >
        <div>
          <strong>{t.titulo}</strong> — <em>{t.categoria}</em>
          <div>Responsable: {t.responsable || "Sin asignar"}</div>
          <div>Estado: {t.estado}</div>
        </div>
        <div style={{ marginTop: 8 }}>
          <button onClick={() => setEstado(t.id, "pendiente")}>Pendiente</button>
          <button
            onClick={() => setEstado(t.id, "en curso")}
            style={{ marginLeft: 6 }}
          >
            En curso
          </button>
          <button
            onClick={() => setEstado(t.id, "completada")}
            style={{ marginLeft: 6 }}
          >
            Completada
          </button>
          <button
            onClick={() => eliminarTarea(t.id)}
            style={{ marginLeft: 6 }}
          >
            Eliminar
          </button>
        </div>
        <div style={{ marginTop: 8 }}>
          <select
            value={t.responsable}
            onChange={(e) => setResponsableAPI(t.id, e.target.value)}
          >
            <option value="">Sin asignar</option>
            {miembros.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </li>
    );
  }

  const pendientes = tareas.filter((t) => t.estado === "pendiente");
  const enCurso = tareas.filter((t) => t.estado === "en curso");
  const completadas = tareas.filter((t) => t.estado === "completada");

  return (
    <div
      style={{
        margin: "20px",
        fontFamily: "Arial",
        background: fondo,
        minHeight: "100vh",
      }}
    >
      {!usuario ? (
        <div style={{ maxWidth: 420, margin: "60px auto" }}>
          <h1>Ingreso a Ohana 🏡</h1>
          <form onSubmit={login} style={{ display: "grid", gap: 10 }}>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Usuario"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
            />
            <button type="submit">Ingresar</button>
          </form>
          <button onClick={registro} style={{ marginTop: 10 }}>
            Registrarse
          </button>
        </div>
      ) : (
        <div>
          <h1>Tareas del Hogar 🏡 — Bienvenido {usuario.nombre}</h1>
          <button onClick={logout} style={{ marginBottom: 20 }}>
            Cerrar sesión
          </button>

          {/* Editar perfil */}
          <form
            onSubmit={editarPerfil}
            style={{ marginBottom: 20, display: "grid", gap: 10, maxWidth: 520 }}
          >
            <input
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
              placeholder="Nuevo nombre"
            />
            <input
              type="password"
              value={nuevoPassword}
              onChange={(e) => setNuevoPassword(e.target.value)}
              placeholder="Nueva contraseña"
            />
            <button type="submit">Actualizar perfil</button>
          </form>

          {/* Cambiar fondo */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ marginRight: 8 }}>Fondo:</label>
            <select onChange={(e) => cambiarFondoAPI(e.target.value)} value={fondo}>
              <option value="white">Blanco</option>
              <option value="linear-gradient(135deg, #fceabb, #f8b500)">Amarillo cálido</option>
              <option value="linear-gradient(135deg, #89f7fe, #66a6ff)">Azul fresco</option>
              <option value="linear-gradient(135deg, #fddb92, #d1fdff)">Suave pastel</option>
              <option value="linear-gradient(135deg, #ff9a9e, #fad0c4)">Rosa cálido</option>
              <option value="linear-gradient(135deg, #a1c4fd, #c2e9fb)">Celeste suave</option>
            </select>
          </div>

          {/* Formulario de tareas */}
          <form onSubmit={crearTarea} style={{ marginBottom: 20 }}>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Nueva tarea..."
              required
            />
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)} style={{ marginLeft: 10 }}>
              <option value="General">General</option>
              <option value="Cocina">Cocina</option>
              <option value="Limpieza">Limpieza</option>
              <option value="Lavandería">Lavandería</option>
              <option value="Compras">Compras</option>
              <option value="Jardín">Jardín</option>
            </select>
            <select value={responsable} onChange={(e) => setResponsable(e.target.value)} style={{ marginLeft: 10 }}>
              <option value="">Sin asignar</option>
              {miembros.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <button type="submit" style={{ marginLeft: 10 }}>Agregar</button>
          </form>

          {/* Columnas */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <section>
              <h2>🟡 Pendientes</h2>
              <ul style={{ listStyle: "none", padding: 0 }}>{pendientes.map(renderTarea)}</ul>
            </section>
            <section>
              <h2>🔵 En curso</h2>
              <ul style={{ listStyle: "none", padding: 0 }}>{enCurso.map(renderTarea)}</ul>
            </section>
            <section>
              <h2>✅ Completadas</h2>
              <ul style={{ listStyle: "none", padding: 0 }}>{completadas.map(renderTarea)}</ul>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

