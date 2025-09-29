import express from "express";
import Message from "../models/Message.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Historial con un usuario
router.get("/:userId", authMiddleware, async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const myId = Number(req.user.id);

    const messages = await Message.find({
      $or: [
        { from: myId, to: userId },
        { from: userId, to: myId }
      ]
    }).sort({ timestamp: 1 });

    res.json({ messages });
  } catch (err) {
    console.error("Error al obtener mensajes:", err);
    res.status(500).json({ error: "Error interno" });
  }
});

export default router;
