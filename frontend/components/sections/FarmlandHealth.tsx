import { ChevronRight, Sprout } from "lucide-react";
import Link from "next/link";

type Props = {
  score?: number;
  status?: "optimal" | "watch" | "critical";
  loading?: boolean;
  onView?: () => void;
};

const STATUS_STYLES: Record<NonNullable<Props["status"]>, string> = {
  optimal: "bg-green-500 text-green-600",
  watch: "bg-yellow-500 text-yellow-600",
  critical: "bg-red-500 text-red-600",
};

const STATUS_LABELS: Record<NonNullable<Props["status"]>, string> = {
  optimal: "Optimal",
  watch: "Monitor",
  critical: "Critical",
};

const FarmlandHealth = ({ score = 0, status = "watch", loading = false, onView }: Props) => {
  const badgeClass = STATUS_STYLES[status] ?? STATUS_STYLES.watch;
  const label = STATUS_LABELS[status] ?? STATUS_LABELS.watch;

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Farmland Health</h3>
        <Sprout className="text-gray-400" size={24} />
      </div>
      <div className="mb-4">
        <div className="text-5xl font-bold text-gray-800 mb-1">
          {loading ? <span className="text-2xl text-gray-400">…</span> : `${score}%`}
        </div>
        <div className="text-gray-500 text-sm">Composite Health Score</div>
      </div>
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-2 h-2 rounded-full ${badgeClass.split(" ")[0]}`} />
        <span className={`text-sm font-medium ${badgeClass.split(" ")[1]}`}>{loading ? "Loading…" : label}</span>
      </div>
      <Link
        href={"/dashboard/farmlands"}
        >
        <button
          className="text-green-600 font-medium flex items-center gap-1 hover:gap-2 transition-all"
        >
          View All Farmlands <ChevronRight size={16} />
        </button>
        </Link>
    </div>
  );
};

export default FarmlandHealth;