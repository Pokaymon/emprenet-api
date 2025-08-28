import { alertError } from "../utils/alert.utils.js";

export async function toggleFollow(userId) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No autenticado");

  try {
    const res = await fetch("/users/follow", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ userId })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Error en follow/unfollow");
    }

    return await res.json();
  } catch (err) {
    console.error("Error en toggleFollow:", err);
    alertError("No se pudo procesar la acción.");
    throw err;
  }
}
