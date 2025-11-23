import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const taskSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    note: { type: String, default: "" },
    dueDate: { type: Date },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    status: { type: String, enum: ["pending", "completed"], default: "pending" },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    farmlandId: { type: Schema.Types.ObjectId, ref: "Farmland", default: null },
  },
  { timestamps: true },
);

export const TaskModel = models.Task || model("Task", taskSchema);
