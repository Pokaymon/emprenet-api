// test-socket.js
import { io } from "socket.io-client";

const socket = io("https://api.emprenet.work", {
  auth: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJqYXZpZXJzb2NoYSIsImVtYWlsIjoiYW5kcmVzc29jaGEyMjBAZ21haWwuY29tIiwiYXV0aF9wcm92aWRlciI6ImxvY2FsIiwiaWF0IjoxNzUzOTMwMTkzLCJleHAiOjE3NTM5MzM3OTN9.--6OkruGOnYmBj7XUNeqYljXeih66eWK3JTTXcKpx_A"
  }
});

socket.on("connect", () => {
  console.log("✅ Conectado como", socket.id);

  socket.emit("private_message", {
    to: "2", // Asegúrate que sea un ID válido
    content: "Hola desde cliente Node"
  });
});

socket.on("private_message", (data) => {
  console.log("📩 Recibido:", data);
});

socket.on("disconnect", () => {
  console.log("⛔ Desconectado");
});

socket.on("connect_error", (err) => {
  console.error("❌ Error:", err.message);
});
