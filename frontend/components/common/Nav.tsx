"use client"
import { useState } from "react";
import { Users, Grid3x3, Sprout, DollarSign, Briefcase, Wrench, LogOut } from 'lucide-react';
import Image from "next/image";


interface NavItem {
    id: string;
    label: string;
    icon: React.ElementType;
}


const Nav = () => {

        const [activeNav, setActiveNav] = useState<string>('dashboard');
    
        const navItems: NavItem[] = [
            { id: 'dashboard', label: 'Dashboard', icon: Grid3x3 },
            { id: 'employees', label: 'Employees', icon: Users },
            { id: 'farmlands', label: 'Farmlands', icon: Sprout },
            { id: 'crops', label: 'Crops', icon: Sprout },
            { id: 'finances', label: 'Finances', icon: DollarSign },
            { id: 'partners', label: 'Partners', icon: Briefcase },
            { id: 'aitools', label: 'AI Tools', icon: Wrench },
        ];
    
    return ( 
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <Image src="/logo.png" alt="Hingaguru Logo" width={32} height={32} />
                        <span className="text-2xl font-bold text-gray-800">Hingaguru</span>
                    </div>
                </div>

                <nav className="flex-1 p-4">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveNav(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                                    activeNav === item.id
                                        ? 'bg-green-50 text-green-700'
                                        : 'text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <Icon size={20} />
                                <span className="font-medium">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>
     );
}
 
export default Nav;