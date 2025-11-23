import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const transactionSchema = new Schema(
  {
    type: { type: String, enum: ["income", "expense"], required: true },
    amountRwf: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true },
    category: { type: String, required: true, trim: true },
    note: { type: String },
    farmlandId: { type: Schema.Types.ObjectId, ref: "Farmland" },
    employeeId: { type: Schema.Types.ObjectId, ref: "Employee" },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    currency: { type: String, default: "RWF" },
  },
  { timestamps: true },
);

export const TransactionModel = models.Transaction || model("Transaction", transactionSchema);


