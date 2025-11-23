import { Router } from "express";
import mongoose from "mongoose";
import { FarmlandModel } from "../models/Farmland.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { toPlain, toPlainList } from "../utils/serialize.js";
import { parseDate, parseStringArray } from "../utils/parse.js";
import { getDummyUserId } from "../services/dummyUser.js";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
    const ownerId = getDummyUserId();

    const filter = { ownerId };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { area: { $regex: search, $options: "i" } },
        { crops: { $regex: search, $options: "i" } },
      ];
    }

    const farmlands = await FarmlandModel.find(filter).sort({ createdAt: -1 }).exec();
    res.json(toPlainList(farmlands));
  }),
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const ownerId = getDummyUserId();
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid farmland id" });
    }

    const farmland = await FarmlandModel.findOne({ _id: id, ownerId }).exec();
    if (!farmland) {
      return res.status(404).json({ message: "Farmland not found" });
    }

    res.json(toPlain(farmland));
  }),
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const ownerId = getDummyUserId();
    const {
      name,
      area,
      crops,
      nextIrrigationDate,
      nextFertilizingDate,
      plannedPlantingDate,
      status,
      imageUrl,
    } = req.body ?? {};

    if (typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({ message: "Name is required" });
    }

    const farmland = await FarmlandModel.create({
      name: name.trim(),
      area: typeof area === "string" ? area.trim() : undefined,
      crops: parseStringArray(crops),
      nextIrrigationDate: parseDate(nextIrrigationDate),
      nextFertilizingDate: parseDate(nextFertilizingDate),
      plannedPlantingDate: parseDate(plannedPlantingDate),
      status: typeof status === "string" ? status : "active",
      imageUrl: typeof imageUrl === "string" ? imageUrl : undefined,
      ownerId,
    });

    res.status(201).json(toPlain(farmland));
  }),
);

router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const ownerId = getDummyUserId();
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid farmland id" });
    }

    const updates = {};
    const {
      name,
      area,
      crops,
      nextIrrigationDate,
      nextFertilizingDate,
      plannedPlantingDate,
      status,
      imageUrl,
    } = req.body ?? {};

    if (typeof name === "string") updates.name = name.trim();
    if (typeof area === "string") updates.area = area.trim();
    if (typeof status === "string") updates.status = status;
    if (typeof imageUrl === "string") updates.imageUrl = imageUrl;

    const parsedCrops = parseStringArray(crops);
    if (parsedCrops.length > 0 || Array.isArray(crops)) {
      updates.crops = parsedCrops;
    }

    if (nextIrrigationDate !== undefined) {
      updates.nextIrrigationDate = parseDate(nextIrrigationDate) ?? null;
    }
    if (nextFertilizingDate !== undefined) {
      updates.nextFertilizingDate = parseDate(nextFertilizingDate) ?? null;
    }
    if (plannedPlantingDate !== undefined) {
      updates.plannedPlantingDate = parseDate(plannedPlantingDate) ?? null;
    }

    const farmland = await FarmlandModel.findOneAndUpdate({ _id: id, ownerId }, updates, {
      new: true,
      runValidators: true,
    }).exec();

    if (!farmland) {
      return res.status(404).json({ message: "Farmland not found" });
    }

    res.json(toPlain(farmland));
  }),
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const ownerId = getDummyUserId();
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid farmland id" });
    }

    const farmland = await FarmlandModel.findOneAndDelete({ _id: id, ownerId }).exec();
    if (!farmland) {
      return res.status(404).json({ message: "Farmland not found" });
    }

    res.json({ id, message: "Deleted" });
  }),
);

export default router;


