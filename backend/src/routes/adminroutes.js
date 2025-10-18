import express from "express";
import {
  getAllUsers,
  updateUser,
  deleteUser,
  resetPassword,
  getAllItems,
  updateItem,
  deleteItem,
} from "../controllers/adminController.js";

const router = express.Router();

// === USUÁRIOS ===
router.get("/usuarios", getAllUsers);
router.put("/usuarios/:id", updateUser);
router.delete("/usuarios/:id", deleteUser);
router.post("/usuarios/:id/reset-senha", resetPassword);

// === ITENS ===
router.get("/itens", getAllItems);
router.put("/itens/:id", updateItem);
router.delete("/itens/:id", deleteItem);

export default router;
