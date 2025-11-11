"use client"
import { Users, Grid3x3, Sprout, DollarSign, Briefcase, Wrench, LogOut } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";


interface NavItem {
    id: string;
    label: string;
    icon: React.ElementType;
    href: string;
}


const Nav = () => {

        const pathname = usePathname();
    
        const navItems: NavItem[] = [
            { id: 'dashboard', label: 'Dashboard', icon: Grid3x3, href: "/dashboard" },
            { id: 'employees', label: 'Employees', icon: Users, href: "/dashboard/employees" },
            { id: 'farmlands', label: 'Farmlands', icon: Sprout, href: "/dashboard/farmlands" },
            { id: 'crops', label: 'Crops', icon: Sprout, href: "/dashboard/crops" },
            { id: 'finances', label: 'Finances', icon: DollarSign, href: "/dashboard/finances" },
            { id: 'aitools', label: 'AI Tools', icon: Wrench, href: "/dashboard/ai-tools" },
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
                        const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                                    isActive
                                        ? 'bg-green-50 text-green-700'
                                        : 'text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <Icon size={20} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
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