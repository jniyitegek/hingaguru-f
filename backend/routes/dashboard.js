import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { EmployeeModel } from "../models/Employee.js";
import { FarmlandModel } from "../models/Farmland.js";
import { TransactionModel } from "../models/Transaction.js";
import { toPlainList } from "../utils/serialize.js";
import { getDummyUserId } from "../services/dummyUser.js";

const router = Router();

router.get(
  "/summary",
  asyncHandler(async (_req, res) => {
    const ownerId = getDummyUserId();

    const [employees, farmlands, transactions] = await Promise.all([
      EmployeeModel.find({ ownerId }).exec(),
      FarmlandModel.find({ ownerId }).exec(),
      TransactionModel.find({ ownerId }).sort({ date: -1 }).limit(10).exec(),
    ]);

    const activeEmployees = employees.filter((e) => e.status === "active").length;
    const onLeaveEmployees = employees.filter((e) => e.status === "on_leave").length;

    const now = new Date();
    const upcomingWindow = new Date(now);
    upcomingWindow.setDate(now.getDate() + 7);

    const scheduledIrrigations = farmlands.filter((f) => f.nextIrrigationDate && f.nextIrrigationDate > now).length;
    const overdueIrrigation = farmlands.filter((f) => f.nextIrrigationDate && f.nextIrrigationDate < now).length;

    const farmlandHealthScore =
      farmlands.length === 0
        ? 0
        : Math.max(40, Math.round(((farmlands.length - overdueIrrigation) / farmlands.length) * 100));

    const upcomingSchedules = farmlands
      .filter((f) => {
        const irrigationSoon =
          f.nextIrrigationDate && f.nextIrrigationDate >= now && f.nextIrrigationDate <= upcomingWindow;
        const fertilizingSoon =
          f.nextFertilizingDate && f.nextFertilizingDate >= now && f.nextFertilizingDate <= upcomingWindow;
        const plantingSoon =
          f.plannedPlantingDate && f.plannedPlantingDate >= now && f.plannedPlantingDate <= upcomingWindow;
        return irrigationSoon || fertilizingSoon || plantingSoon;
      })
      .map((f) => ({
        id: f._id.toString(),
        name: f.name,
        nextIrrigationDate: f.nextIrrigationDate,
        nextFertilizingDate: f.nextFertilizingDate,
        plannedPlantingDate: f.plannedPlantingDate,
      }));

    const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, tx) => sum + tx.amountRwf, 0);
    const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, tx) => sum + tx.amountRwf, 0);

    res.json({
      employees: {
        total: employees.length,
        active: activeEmployees,
        onLeave: onLeaveEmployees,
      },
      farmlands: {
        total: farmlands.length,
        scheduledIrrigations,
        overdueIrrigation,
        upcomingSchedules,
      },
      farmlandHealth: {
        score: farmlandHealthScore,
        status: farmlandHealthScore >= 75 ? "optimal" : farmlandHealthScore >= 55 ? "watch" : "critical",
      },
      finances: {
        totalIncome,
        totalExpenses,
        balance: totalIncome - totalExpenses,
        recent: toPlainList(transactions),
      },
    });
  }),
);

export default router;


