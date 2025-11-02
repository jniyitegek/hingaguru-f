import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

const Header = () => {
    return ( 
        <nav className="bg-white border-b border-gray-200">
            <div>
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-8">
                            <Image src={`/logo.png`} alt="Logo" width={35} height={35} className=""/>
                            <h3 className="text-lg font-bold text-gray-900">Hingaguru</h3>
                            </div>
                            <div className="flex gap-4 items-center">
                                <a href="#features" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
                                    Features
                                </a>
                                <a href="#pricing" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
                                    Pricing
                                </a>
                                <a href="#support" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
                                    Support
                                </a>
                                <Link href={`/auth/login`}>
                                    <Button size={`lg`}>
                                        Logi in
                                    </Button>
                                </Link>
                                <Link href={`/auth/signup`}>
                                    <Button size={`lg`} variant={`outline`}>
                                        Sign up
                                    </Button>
                                </Link>

                            </div>
                        </div>
                    </div>
                </div>
            </nav>
     );
}
 
export default Header;