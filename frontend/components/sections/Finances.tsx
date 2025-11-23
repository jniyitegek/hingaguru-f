"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, type TooltipProps } from "recharts";
import Tasks from "./Tasks";

type ChartPoint = {
  label: string;
  income: number;
  expense: number;
};

type Props = {
  loading?: boolean;
  title?: string;
  chartData: ChartPoint[];
  totals: {
    income: number;
    expense: number;
  };
};

const rwfFormat = new Intl.NumberFormat("en-UG", {
  style: "currency",
  currency: "RWF",
  maximumFractionDigits: 0,
});

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const row = payload[0]?.payload as ChartPoint | undefined;
    if (!row) return null;
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="text-sm font-semibold text-gray-800 mb-1">{row.label}</p>
        <p className="text-sm text-green-600">Income: {rwfFormat.format(row.income)}</p>
        <p className="text-sm text-blue-600">Expenses: {rwfFormat.format(row.expense)}</p>
      </div>
    );
  }
  return null;
};

const FinancialSnapshot = ({ loading = false, title = "Financial Snapshot", chartData, totals }: Props) => {
  const incomeTotal = totals.income ?? 0;
  const expenseTotal = totals.expense ?? 0;

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Financial Snapshot */}
      <div className="col-span-2 bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-500">Rolling 8 weeks</p>
          </div>
          <span className="text-sm text-gray-400">{loading ? "Loading data…" : null}</span>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="label" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={{ stroke: "#e5e7eb" }} />
            <YAxis
              tick={{ fill: "#6b7280", fontSize: 12 }}
              axisLine={{ stroke: "#e5e7eb" }}
              tickFormatter={(value: number) => `${Math.round(value / 1000)}k`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} />
            <Bar dataKey="income" fill="#16a34a" radius={[8, 8, 0, 0]} maxBarSize={40} />
            <Bar dataKey="expense" fill="#3b82f6" radius={[8, 8, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>

        <div className="flex items-center justify-center gap-8 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-600 rounded-full" />
            <span className="text-sm text-gray-600">Income</span>
            <span className="text-lg font-bold text-gray-800 ml-2">{rwfFormat.format(incomeTotal)}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full" />
            <span className="text-sm text-gray-600">Expenses</span>
            <span className="text-lg font-bold text-gray-800 ml-2">{rwfFormat.format(expenseTotal)}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full" />
            <span className="text-sm text-gray-600">Balance</span>
            <span
              className={`text-lg font-bold ml-2 ${
                incomeTotal - expenseTotal >= 0 ? "text-green-700" : "text-red-600"
              }`}
            >
              {rwfFormat.format(incomeTotal - expenseTotal)}
            </span>
          </div>
        </div>
      </div>

      {/* Upcoming Tasks */}
      <Tasks />
    </div>
  );
};

export default FinancialSnapshot;

