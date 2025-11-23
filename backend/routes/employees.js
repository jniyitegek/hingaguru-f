import { Router } from "express";
import mongoose from "mongoose";
import { EmployeeModel } from "../models/Employee.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { toPlain, toPlainList } from "../utils/serialize.js";
import { getDummyUserId } from "../services/dummyUser.js";

const router = Router();

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const ownerId = getDummyUserId();
    const employees = await EmployeeModel.find({ ownerId }).sort({ createdAt: -1 }).exec();
    console.log(employees);
    res.json(toPlainList(employees));
  }),
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const ownerId = getDummyUserId();
    const { fullName, role, phone, status } = req.body ?? {};

    if (typeof fullName !== "string" || fullName.trim().length < 2) {
      return res.status(400).json({ message: "Full name is required" });
    }
    if (typeof role !== "string" || role.trim().length < 2) {
      return res.status(400).json({ message: "Role is required" });
    }
    if (typeof phone !== "string" || phone.trim().length < 3) {
      return res.status(400).json({ message: "Phone is required" });
    }

    const employee = await EmployeeModel.create({
      fullName: fullName.trim(),
      role: role.trim(),
      phone: phone.trim(),
      status: typeof status === "string" ? status : "active",
      ownerId,
    });

    res.status(201).json(toPlain(employee));
  }),
);

router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const ownerId = getDummyUserId();
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid employee id" });
    }

    const updates = {};
    const { fullName, role, phone, status } = req.body ?? {};

    if (typeof fullName === "string") updates.fullName = fullName.trim();
    if (typeof role === "string") updates.role = role.trim();
    if (typeof phone === "string") updates.phone = phone.trim();
    if (typeof status === "string") updates.status = status;

    const employee = await EmployeeModel.findOneAndUpdate({ _id: id, ownerId }, updates, {
      new: true,
      runValidators: true,
    }).exec();

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(toPlain(employee));
  }),
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const ownerId = getDummyUserId();
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid employee id" });
    }

    const employee = await EmployeeModel.findOneAndDelete({ _id: id, ownerId }).exec();
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({ id, message: "Deleted" });
  }),
);

export default router;


