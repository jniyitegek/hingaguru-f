import express from "express";
import mongoose from "mongoose";
import { TaskModel } from "../models/Task.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// GET /api/tasks - list user's tasks
router.get("/", protect, async (req, res) => {
  try {
    const tasks = await TaskModel.find({ ownerId: req.user._id }).sort({ dueDate: 1 }).exec();
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load tasks" });
  }
});

// POST /api/tasks - create
router.post("/", protect, async (req, res) => {
  try {
    const { title, note, dueDate, priority, farmlandId } = req.body ?? {};
    if (typeof title !== "string" || title.trim().length === 0) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await TaskModel.create({
      title: title.trim(),
      note: typeof note === "string" ? note.trim() : "",
      dueDate: dueDate ? new Date(dueDate) : undefined,
      priority: ["low", "medium", "high"].includes(priority) ? priority : "medium",
      ownerId: req.user._id,
      farmlandId: mongoose.Types.ObjectId.isValid(farmlandId) ? farmlandId : undefined,
    });

    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create task" });
  }
});

// PATCH /api/tasks/:id - update
router.patch("/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid id" });

    const task = await TaskModel.findOne({ _id: id, ownerId: req.user._id });
    if (!task) return res.status(404).json({ message: "Task not found" });

    const { title, note, dueDate, priority, status } = req.body ?? {};
    if (typeof title === "string") task.title = title.trim();
    if (typeof note === "string") task.note = note.trim();
    if (dueDate) task.dueDate = new Date(dueDate);
    if (["low", "medium", "high"].includes(priority)) task.priority = priority;
    if (["pending", "completed"].includes(status)) task.status = status;

    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update task" });
  }
});

// DELETE /api/tasks/:id
router.delete("/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid id" });

    const task = await TaskModel.findOneAndDelete({ _id: id, ownerId: req.user._id });
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json({ id: task._id, message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete task" });
  }
});

export default router;
