import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const employeeSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    status: { type: String, enum: ["active", "on_leave", "inactive"], default: "active" },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  },
);

export const EmployeeModel = models.Employee || model("Employee", employeeSchema);


