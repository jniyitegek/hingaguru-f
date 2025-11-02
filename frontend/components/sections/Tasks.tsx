import { Calendar, DollarSign, Droplet, FlaskConical, Package } from "lucide-react";

const Tasks = () => {
    return ( 
        <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Upcoming Tasks</h3>
                <Calendar className="text-gray-400" size={20} />
            </div>

            <div className="space-y-4">
                <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                    <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                        <Droplet className="text-red-500" size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-800 text-sm">Irrigate Plot C</div>
                        <div className="text-xs text-red-500">Due Today</div>
                    </div>
                </div>

                <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                    <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center shrink-0">
                        <FlaskConical className="text-yellow-500" size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-800 text-sm">Fertilize Plot A</div>
                        <div className="text-xs text-yellow-500">Due Tomorrow</div>
                    </div>
                </div>

                <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                        <DollarSign className="text-blue-500" size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-800 text-sm">Pay Employee: John Doe</div>
                        <div className="text-xs text-gray-500">Due in 3 days</div>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                        <Package className="text-gray-500" size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-800 text-sm">Order new seeds</div>
                        <div className="text-xs text-gray-500">Due in 5 days</div>
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default Tasks;