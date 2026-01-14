// src/components/Login.js
import React, { useState } from "react";
import { loginUsuario } from "../services/usuariosService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const respuesta = await loginUsuario({ email, password });
    console.log(respuesta); // acá podrías guardar token o mostrar mensaje
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
      />
      <button type="submit">Ingresar</button>
    </form>
  );
}