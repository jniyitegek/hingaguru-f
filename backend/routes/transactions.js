import { Router } from "express";
import mongoose from "mongoose";
import { TransactionModel } from "../models/Transaction.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { toPlain, toPlainList } from "../utils/serialize.js";
import { getDummyUserId } from "../services/dummyUser.js";
import { parseDate } from "../utils/parse.js";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const ownerId = getDummyUserId();
    const filter = { ownerId };

    if (typeof req.query.type === "string") {
      filter.type = req.query.type;
    }

    if (typeof req.query.category === "string") {
      filter.category = req.query.category;
    }

    if (typeof req.query.farmlandId === "string" && mongoose.Types.ObjectId.isValid(req.query.farmlandId)) {
      filter.farmlandId = req.query.farmlandId;
    }

    if (typeof req.query.employeeId === "string" && mongoose.Types.ObjectId.isValid(req.query.employeeId)) {
      filter.employeeId = req.query.employeeId;
    }

    if (typeof req.query.from === "string") {
      const fromDate = parseDate(req.query.from);
      if (fromDate) {
        filter.date = { ...(filter.date ?? {}), $gte: fromDate };
      }
    }

    if (typeof req.query.to === "string") {
      const toDate = parseDate(req.query.to);
      if (toDate) {
        filter.date = { ...(filter.date ?? {}), $lte: toDate };
      }
    }

    const transactions = await TransactionModel.find(filter).sort({ date: -1 }).exec();
    res.json(toPlainList(transactions));
  }),
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const ownerId = getDummyUserId();
    const { type, amountRwf, date, category, note, farmlandId, employeeId } = req.body ?? {};

    if (type !== "income" && type !== "expense") {
      return res.status(400).json({ message: "Type must be income or expense" });
    }

    const amountNum = Number(amountRwf);
    if (!Number.isFinite(amountNum) || amountNum <= 0) {
      return res.status(400).json({ message: "Amount must be a positive number" });
    }

    const parsedDate = parseDate(date);
    if (!parsedDate) {
      return res.status(400).json({ message: "Date is required" });
    }

    if (typeof category !== "string" || category.trim().length === 0) {
      return res.status(400).json({ message: "Category is required" });
    }

    const transaction = await TransactionModel.create({
      type,
      amountRwf: Math.round(amountNum),
      date: parsedDate,
      category: category.trim().toLowerCase(),
      note: typeof note === "string" ? note.trim() : undefined,
      farmlandId:
        typeof farmlandId === "string" && mongoose.Types.ObjectId.isValid(farmlandId)
          ? new mongoose.Types.ObjectId(farmlandId)
          : undefined,
      employeeId:
        typeof employeeId === "string" && mongoose.Types.ObjectId.isValid(employeeId)
          ? new mongoose.Types.ObjectId(employeeId)
          : undefined,
      currency: "RWF",
      ownerId,
    });

    res.status(201).json(toPlain(transaction));
  }),
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const ownerId = getDummyUserId();
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid transaction id" });
    }

    const transaction = await TransactionModel.findOneAndDelete({ _id: id, ownerId }).exec();
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({ id, message: "Deleted" });
  }),
);

export default router;


