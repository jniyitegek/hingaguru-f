import { Bell, Search, Settings } from "lucide-react";

const AuthNav = () => {
    return ( 
        <header className="bg-white border-b border-gray-200 px-8 py-4">
            <div className="flex items-center justify-between">
                <div className="flex-1 max-w-xl">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search anything..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4 ml-4">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Bell size={20} className="text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Settings size={20} className="text-gray-600" />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-orange-200 flex items-center justify-center">
                        <span className="text-orange-800 font-semibold">V</span>
                    </div>
                </div>
            </div>
        </header>
     );
}
 
export default AuthNav;