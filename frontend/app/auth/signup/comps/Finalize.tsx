import { Button } from "@/components/ui/button";
import Typography from "@/components/ui/Typography";

const SignupFinalize = () => {
    return ( 
        <div className="space-y-8 text-center">
            <div className="space-y-3">
                <Typography variant={`title`} className="font-semibold leading-[1.1]">
                    Account created successfully
                </Typography>
                <Typography variant={`sectionTitle2Var`}>
                    Your account has been successfully created. Click below to log in magically.
                </Typography>
            </div>
            <Button className="w-full" onClick={() => {window.location.href = "/dashboard"}}>
                Continue
            </Button>
            
        </div>
     );
}
 
export default SignupFinalize;