import { Users, FileText, Sprout, Wrench, ChevronRight, FlaskConical } from 'lucide-react';
import FinancialSnapshot from '@/components/sections/Finances';
import Nav from '@/components/common/Nav';
import AuthNav from '@/components/common/AuthNav';
import EmployeeOverview from '@/components/sections/EmployeeOverview';
import FarmlandHealth from '@/components/sections/FarmlandHealth';
import AISuggestion from '@/components/common/AISuggestion';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Dashboard - Hingaguru",
  description: "A glimpse into everything",
};

export default function HingaguruDashboard() {

    return (
        <div className="flex h-screen bg-gray-50">
            <Nav />

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {/* Header */}
                <AuthNav />

                {/* Dashboard Content */}
                <div className="p-8">
                    {/* Welcome Section */}
                    <div className="flex items-start justify-between mb-8 text-black">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome back, Visualizer!</h1>
                            <p className="text-gray-500">Monday, 03 November 2025</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <Users size={18} />
                                <span className="font-medium">Add New Employee</span>
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <FileText size={18} />
                                <span className="font-medium">Log Expense</span>
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                <Sprout size={18} />
                                <span className="font-medium">Scan Crop Disease</span>
                            </button>
                        </div>
                    </div>

                    {/* Top Cards Row */}
                    <div className="grid grid-cols-3 gap-6 mb-6">
                        {/* Employee Overview */}
                        <EmployeeOverview />

                        {/* Farmland Health */}
                        <FarmlandHealth />

                        {/* AI Assistant */}
                        <AISuggestion />
                    </div>

                    <FinancialSnapshot />

                    {/* Current Crop Cycle */}
                    <div className="mt-6 bg-white rounded-xl p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">Current Crop Cycle</h3>
                            <button className="text-green-600 font-medium hover:text-green-700">
                                Track Crops
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}