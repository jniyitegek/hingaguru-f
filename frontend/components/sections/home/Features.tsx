import { Sprout, MapPin, Users, DollarSign, Handshake } from 'lucide-react';



const HomeFeatures = () => {
    return ( 
        <section className="py-20 bg-white" id="features">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Key Features</h2>
                        <p className="text-lg text-gray-600">
                            Hingaguru offers a range of tools to streamline your farm management and boost productivity.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Farmland Management */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-8 transition-shadow">
                            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-6">
                                <MapPin className="text-green-600" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Farmland Management</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Visualize and manage your land with detailed mapping and historical data analysis.
                            </p>
                        </div>

                        {/* Crop Management */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-8 transition-shadow">
                            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-6">
                                <Sprout className="text-green-600" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Crop Management</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Track crop cycles, monitor growth, and optimize yields with real-time data.
                            </p>
                        </div>

                        {/* Employee Management */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-8 transition-shadow">
                            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-6">
                                <Users className="text-green-600" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Employee Management</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Efficiently manage your workforce with scheduling, task assignments, and performance tracking.
                            </p>
                        </div>

                        {/* Financial Tracking */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-8 transition-shadow">
                            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-6">
                                <DollarSign className="text-green-600" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Financial Tracking</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Keep a close eye on your finances with detailed expense tracking and revenue analysis.
                            </p>
                        </div>

                        {/* Partner Collaboration */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-8 transition-shadow">
                            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-6">
                                <Handshake className="text-green-600" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Partner Collaboration</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Collaborate seamlessly with partners, suppliers, and buyers within the platform.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
     );
}
 
export default HomeFeatures;