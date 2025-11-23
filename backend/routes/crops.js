import { Router } from "express";
import mongoose from "mongoose";
import { CropModel } from "../models/Crop.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { toPlain, toPlainList } from "../utils/serialize.js";
import { getDummyUserId } from "../services/dummyUser.js";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { scientificName: { $regex: search, $options: "i" } },
        { "diseases.name": { $regex: search, $options: "i" } },
        { tips: { $regex: search, $options: "i" } },
      ];
    }

    const crops = await CropModel.find(filter).sort({ name: 1 }).exec();
    res.json(toPlainList(crops));
  }),
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid crop id" });
    }

    const crop = await CropModel.findById(id).exec();
    if (!crop) {
      return res.status(404).json({ message: "Crop not found" });
    }

    res.json(toPlain(crop));
  }),
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const ownerId = getDummyUserId();
    const { name, scientificName, description, optimalTemp, soil, water, tips, market, diseases } = req.body ?? {};

    if (typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({ message: "Name is required" });
    }

    const crop = await CropModel.create({
      name: name.trim(),
      scientificName: typeof scientificName === "string" ? scientificName.trim() : undefined,
      description: typeof description === "string" ? description.trim() : undefined,
      optimalTemp: typeof optimalTemp === "string" ? optimalTemp.trim() : undefined,
      soil: typeof soil === "string" ? soil.trim() : undefined,
      water: typeof water === "string" ? water.trim() : undefined,
      tips: Array.isArray(tips)
        ? tips
            .filter((tip) => typeof tip === "string" && tip.trim().length > 0)
            .map((tip) => tip.trim())
        : [],
      diseases: Array.isArray(diseases)
        ? diseases
            .filter(
              (d) => typeof d?.name === "string" && typeof d?.symptoms === "string" && typeof d?.treatment === "string",
            )
            .map((d) => ({
              name: d.name.trim(),
              symptoms: d.symptoms.trim(),
              treatment: d.treatment.trim(),
            }))
        : [],
      market:
        typeof market === "object" && market !== null
          ? {
              pricePerKgUsd: Number(market.pricePerKgUsd) || 0,
              trend:
                market.trend === "up" || market.trend === "down" || market.trend === "flat"
                  ? market.trend
                  : "flat",
              note: typeof market.note === "string" ? market.note.trim() : "",
            }
          : { pricePerKgUsd: 0, trend: "flat", note: "" },
      ownerId,
    });

    res.status(201).json(toPlain(crop));
  }),
);

export default router;


