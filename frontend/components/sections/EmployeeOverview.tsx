import { ChevronRight, Users } from "lucide-react";

type Props = {
  onManageTeam?: () => void;
  loading?: boolean;
  data?: {
    total: number;
    active: number;
    onLeave: number;
  };
};

const EmployeeOverview = ({ onManageTeam, loading = false, data }: Props) => {
  const total = data?.total ?? 0;
  const active = data?.active ?? 0;
  const onLeave = data?.onLeave ?? 0;

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Employee Overview</h3>
        <Users className="text-gray-400" size={24} />
      </div>
      <div className="mb-4">
        <div className="text-5xl font-bold text-gray-800 mb-1">
          {loading ? <span className="text-2xl text-gray-400">…</span> : total}
        </div>
        <div className="text-gray-500 text-sm">Total Employees</div>
      </div>
      <div className="flex gap-6 mb-4">
        <div>
          <div className="text-2xl font-bold text-green-600">{loading ? "—" : active}</div>
          <div className="text-xs text-gray-500">Active</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-yellow-500">{loading ? "—" : onLeave}</div>
          <div className="text-xs text-gray-500">On Leave</div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeOverview;