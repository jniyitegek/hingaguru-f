import Image from "next/image";

const Footer = () => {
    return ( 
        <footer className="bg-white border-t border-gray-200 py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        {/* Brand */}
                        <div>
                            <Image src={`/logo.png`} alt="Logo" width={80} height={80} className=""/>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Hingaguru</h3>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="text-sm font-bold text-green-600 uppercase tracking-wider mb-4">Quick Links</h4>
                            <ul className="space-y-3">
                                <li>
                                    <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">
                                        Home
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">
                                        About
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">
                                        Contact
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Company */}
                        <div>
                            <h4 className="text-sm font-bold text-green-600 uppercase tracking-wider mb-4">Company</h4>
                            <ul className="space-y-3">
                                <li>
                                    <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">
                                        Privacy Policy
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">
                                        Terms of Service
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">
                                        Contact
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="pt-8 border-t border-gray-200 text-center">
                        <p className="text-gray-500">
                            © 2025 Hingaguru, All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
     );
}
 
export default Footer;