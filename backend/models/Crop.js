import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const diseaseSchema = new Schema(
  {
    name: { type: String, required: true },
    symptoms: { type: String, required: true },
    treatment: { type: String, required: true },
  },
  { _id: false },
);

const cropSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    scientificName: { type: String, trim: true },
    description: { type: String },
    optimalTemp: { type: String },
    soil: { type: String },
    water: { type: String },
    optimalSoilPH: { type: [Number], default: [] },
    commonPests: { type: [String], default: [] },
    diseases: { type: [diseaseSchema], default: [] },
    tips: { type: [String], default: [] },
    market: {
      pricePerKgUsd: { type: Number, default: 0 },
      trend: { type: String, enum: ["up", "down", "flat"], default: "flat" },
      note: { type: String, default: "" },
    },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  {
    timestamps: true,
  },
);

export const CropModel = models.Crop || model("Crop", cropSchema);


