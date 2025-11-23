"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarPlus, FileText, Sprout, Users } from "lucide-react";
import Nav from "@/components/common/Nav";
import AuthNav from "@/components/common/AuthNav";
import { useLocale } from "@/context/LocaleContext";
import { useAuth } from "@/context/AuthContext";
import EmployeeOverview from "@/components/sections/EmployeeOverview";
import FarmlandHealth from "@/components/sections/FarmlandHealth";
import FinancialSnapshot from "@/components/sections/Finances";
import AISuggestion from "@/components/common/AISuggestion";
import EmployeesManager from "@/components/sections/employees/EmployeesManager.client";
import GlobalScheduler from "@/components/sections/scheduling/GlobalScheduler.client";
import ScanCropModal from "@/components/sections/crops/ScanCropModal.client";
import TransactionManager from "@/components/sections/finances/TransactionManager.client";
import { api, type DashboardSummary, type FinanceTransaction } from "@/lib/api";
import Link from "next/link";

type ChartPoint = {
  label: string;
  income: number;
  expense: number;
};

function buildChartData(transactions: FinanceTransaction[]): ChartPoint[] {
  const map = new Map<
    string,
    {
      label: string;
      income: number;
      expense: number;
    }
  >();

  transactions.forEach((tx) => {
    const date = new Date(tx.date);
    const iso = date.toISOString().slice(0, 10);
    const label = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const entry =
      map.get(iso) ??
      ({
        label,
        income: 0,
        expense: 0,
      } as ChartPoint);

    if (tx.type === "income") {
      entry.income += tx.amountRwf;
    } else {
      entry.expense += tx.amountRwf;
    }

    entry.label = label;
    map.set(iso, entry);
  });

  const sorted = Array.from(map.entries())
    .sort(([isoA], [isoB]) => (isoA < isoB ? -1 : isoA > isoB ? 1 : 0))
    .map(([, value]) => value);

  const recent = sorted.slice(-8);
  if (recent.length === 0) {
    return [
      {
        label: "No data",
        income: 0,
        expense: 0,
      },
    ];
  }

  return recent;
}

export default function DashboardClient() {
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] ?? "Visualizer";
  const { t } = useLocale();
  const [showEmployees, setShowEmployees] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [showScan, setShowScan] = useState(false);
  const [showTx, setShowTx] = useState(false);

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getDashboardSummary();
      setSummary(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load dashboard data";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  const financialChart = useMemo(() => buildChartData(summary?.finances.recent ?? []), [summary]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Nav />
      <main className="flex-1 overflow-auto">
        <AuthNav />
        <div className="p-8">
          <div className="flex items-start justify-between mb-8 text-black">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{t("dashboard.welcome", { name: firstName })}</h1>
              <p className="text-gray-500">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowEmployees(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Users size={18} />
                <span className="font-medium">{t("common.addNewEmployee")}</span>
              </button>
              <button
                onClick={() => setShowScheduler(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <CalendarPlus size={18} />
                <span className="font-medium">{t("common.scheduleEvent")}</span>
              </button>
              <button
                onClick={() => setShowTx(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FileText size={18} />
                <span className="font-medium">{t("common.logExpense")}</span>
              </button>
              <Link
                href={"/dashboard/ai-tools"}
                >
                <button
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Sprout size={18} />
                  <span className="font-medium">{t("common.scanCrop")}</span>
                </button>
                </Link>
            </div>
          </div>

          {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

          <div className="grid grid-cols-3 gap-6 mb-6">
            <EmployeeOverview
              onManageTeam={() => setShowEmployees(true)}
              loading={loading}
              data={summary?.employees}
            />
            <FarmlandHealth
              loading={loading}
              score={summary?.farmlandHealth.score}
              status={summary?.farmlandHealth.status}
              onView={() => window.open("/dashboard/farmlands", "_self")}
            />
            <AISuggestion />
          </div>

          <FinancialSnapshot
            loading={loading}
            chartData={financialChart}
            totals={{
              income: summary?.finances.totalIncome ?? 0,
              expense: summary?.finances.totalExpenses ?? 0,
            }}
          />

          {/* <div className="mt-6 bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Current Crop Cycle</h3>
              <button className="text-green-600 font-medium hover:text-green-700" onClick={() => window.open("/dashboard/crops", "_self")}>
                Track Crops
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {summary?.farmlands.upcomingSchedules.length
                ? `Upcoming field activities scheduled for ${summary.farmlands.upcomingSchedules.length} farmland(s) within the next 7 days.`
                : "No upcoming field activities scheduled in the next 7 days."}
            </p>
          </div> */}
        </div>

        <EmployeesManager
          isOpen={showEmployees}
          onClose={() => setShowEmployees(false)}
          onCreated={() => {
            void loadSummary();
          }}
        />
        <GlobalScheduler isOpen={showScheduler} onClose={() => setShowScheduler(false)} />
        <ScanCropModal isOpen={showScan} onClose={() => setShowScan(false)} />
        <TransactionManager
          isOpen={showTx}
          onClose={() => {
            setShowTx(false);
          }}
          onSaved={() => {
            void loadSummary();
          }}
        />
      </main>
    </div>
  );
}

