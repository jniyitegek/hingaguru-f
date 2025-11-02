import { ChevronRight, Users } from "lucide-react";

const EmployeeOverview = () => {
    return ( 
        <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Employee Overview</h3>
                <Users className="text-gray-400" size={24} />
            </div>
            <div className="mb-4">
                <div className="text-5xl font-bold text-gray-800 mb-1">24</div>
                <div className="text-gray-500 text-sm">Total Employees</div>
            </div>
            <div className="flex gap-6 mb-4">
                <div>
                    <div className="text-2xl font-bold text-green-600">21</div>
                    <div className="text-xs text-gray-500">Active</div>
                </div>
                <div>
                    <div className="text-2xl font-bold text-yellow-500">3</div>
                    <div className="text-xs text-gray-500">On Leave</div>
                </div>
            </div>
            <button className="text-green-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">
                Manage Team <ChevronRight size={16} />
            </button>
        </div>
     );
}
 
export default EmployeeOverview;