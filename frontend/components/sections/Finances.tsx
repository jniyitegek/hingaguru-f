"use client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import Tasks from './Tasks';

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                <p className="text-sm font-semibold text-gray-800 mb-1">{payload[0].payload.week}</p>
                <p className="text-sm text-green-600">Income: ${payload[0].value?.toLocaleString()}</p>
                <p className="text-sm text-blue-600">Expenses: ${payload[1].value?.toLocaleString()}</p>
            </div>
        );
    }
    return null;
};

interface FinancialData {
    week: string;
    income: number;
    expense: number;
}


const FinancialSnapshot = () => {

        const financialData: FinancialData[] = [
        { week: 'W1', income: 8500, expense: 6200 },
        { week: 'W2', income: 9800, expense: 5800 },
        { week: 'W3', income: 7200, expense: 6500 },
        { week: 'W4', income: 12450, expense: 7890 },
        { week: 'W1', income: 11200, expense: 6800 },
        { week: 'W2', income: 9600, expense: 7200 },
        { week: 'W3', income: 10800, expense: 6400 },
        { week: 'W4', income: 11500, expense: 7100 },
    ];
    
    return ( 
        <div className="grid grid-cols-3 gap-6">
            {/* Financial Snapshot */}
            <div className="col-span-2 bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">Financial Snapshot</h3>
                        <p className="text-sm text-gray-500">Last 30 days</p>
                    </div>
                    <button className="text-green-600 font-medium hover:text-green-700">
                        View Full Report
                    </button>
                </div>

                {/* Chart */}
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart 
                        data={financialData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                            dataKey="week" 
                            tick={{ fill: '#6b7280', fontSize: 12 }}
                            axisLine={{ stroke: '#e5e7eb' }}
                        />
                        <YAxis 
                            tick={{ fill: '#6b7280', fontSize: 12 }}
                            axisLine={{ stroke: '#e5e7eb' }}
                            tickFormatter={(value: number) => `$${(value / 1000).toFixed(0)}k`}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
                        <Bar 
                            dataKey="income" 
                            fill="#16a34a" 
                            radius={[8, 8, 0, 0]}
                            maxBarSize={40}
                        />
                        <Bar 
                            dataKey="expense" 
                            fill="#3b82f6" 
                            radius={[8, 8, 0, 0]}
                            maxBarSize={40}
                        />
                    </BarChart>
                </ResponsiveContainer>

                {/* Legend */}
                <div className="flex items-center justify-center gap-8 mt-6">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                        <span className="text-sm text-gray-600">Income</span>
                        <span className="text-lg font-bold text-gray-800 ml-2">$12,450</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                        <span className="text-sm text-gray-600">Expenses</span>
                        <span className="text-lg font-bold text-gray-800 ml-2">$7,890</span>
                    </div>
                </div>
            </div>

            {/* Upcoming Tasks */}
            <Tasks />
        </div>
     );
}
 
export default FinancialSnapshot;