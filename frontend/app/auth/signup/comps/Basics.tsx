import { Button } from "@/components/ui/button";
import Input from "@/components/ui/Input";
import Typography from "@/components/ui/Typography";

const SignupBasics = ( { setCurrentSection }: { setCurrentSection: (section: number) => void}) => {
    return ( 
        <div>
            <div className="space-y-[24px]">
                <div className="flex flex-col gap-y-[20px]">
                    <Input id="name" label="Name" variant="text" placeholder="Enter your name"/>
                    <Input id="email" label="Email" variant="text" placeholder="Enter your email"/>
                    <div>
                        <Input id="password" label="Password" variant="password" placeholder="••••••••"/>
                        <Typography size={`sm`} className="mt-1">
                            Must be at least 8 characters
                        </Typography>
                    </div><div>
                        <Input id="confirmpassword" label="Confirm password" variant="password" placeholder="••••••••"/>
                        <Typography size={`sm`} className="mt-1">
                            Must be at least 8 characters
                        </Typography>
                    </div>
                </div>

                <div className="flex flex-col gap-y-[20px]">
                    <Button width={`full`} onClick={() => setCurrentSection(1)}>Get started</Button>
                </div>

            </div>
        </div>
     );
}
 
export default SignupBasics;