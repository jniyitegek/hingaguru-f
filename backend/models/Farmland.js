import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const farmlandSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    area: { type: String, trim: true },
    crops: {
      type: [String],
      default: [],
      set: (values) => values.map((value) => value.trim()).filter((value) => value.length > 0),
    },
    nextIrrigationDate: { type: Date },
    nextFertilizingDate: { type: Date },
    plannedPlantingDate: { type: Date },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    imageUrl: { type: String },
    farmId: { type: String },
    plotId: { type: String },
    status: { type: String, default: "active" },
  },
  {
    timestamps: true,
  },
);

export const FarmlandModel = models.Farmland || model("Farmland", farmlandSchema);


