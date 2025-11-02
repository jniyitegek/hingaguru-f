import { ChevronRight, Sprout } from "lucide-react";

const FarmlandHealth = () => {
    return ( 
        <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Farmland Health</h3>
                <Sprout className="text-gray-400" size={24} />
            </div>
            <div className="mb-4">
                <div className="text-5xl font-bold text-gray-800 mb-1">78%</div>
                <div className="text-gray-500 text-sm">Soil Moisture Avg.</div>
            </div>
            <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-600">Optimal</span>
            </div>
            <button className="text-green-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">
                View All Farmlands <ChevronRight size={16} />
            </button>
        </div>
     );
}
 
export default FarmlandHealth;