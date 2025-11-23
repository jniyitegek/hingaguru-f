import Typography from "@/components/ui/Typography";
import Image from "next/image";

const AuthLayout = ({children}: {children: React.ReactNode}) => {
    return ( 
        <div className={`flex justify-center w-full h-screen`}>
            <Image src={`/logo-new.png`} alt="Logo" width={120} height={50} className="absolute top-6 left-6"/>
            <div className="flex flex-col w-1/2 justify-center items-center">
                <div className={`w-full max-w-[360px]`}>
                    {children}
                </div>
            </div>
        </div>
     );
}
 
export default AuthLayout;