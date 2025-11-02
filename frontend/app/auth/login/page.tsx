"use client"
import AuthTitle from "@/components/sections/auth/Title";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Input from "@/components/ui/Input";
import Typography from "@/components/ui/Typography";
import Link from "next/link";
import { useState } from "react";

const LoginPage = () => {

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [checked, setChecked] = useState(false);
    
    return ( 
        <div>
            <AuthTitle title="Welcome back!" subtitle="Sign in to your account" />
            <div className="w-full flex flex-col gap-y-[24px]">
                <div className="flex flex-col gap-y-[20px]">
                    <Input id="email" label="Email" variant="email" placeholder="Enter your email" onChange={setEmail}/>
                    <Input id="password" label="Password" variant="password" placeholder="••••••••" onChange={setPassword}/>
                </div>

                <div className="flex justify-between">
                    <label htmlFor="remember" className="cursor-pointer">
                        <Typography color={`gray_900`} className="flex items-center gap-2">
                            <Checkbox id="remember" checked={checked} onCheckedChange={() => setChecked(value => !value)}/>
                            Remember for 30 days
                        </Typography>
                    </label>
                    <Link href={`#`}>
                        <Typography color={`primary_700`} weight={`medium`}>
                            Forgot Password?
                        </Typography>
                    </Link>
                </div>
                
                <div className="flex flex-col gap-y-[20px]">
                    <Button width={`full`} onClick={() => window.location.href = "/dashboard"}>Sign in</Button>
                </div>

            </div>
            <Typography className="mx-auto w-fit mt-8">
                Don&apos;t have an account? <Link href="/auth/signup" className="text-primary-700 font-medium">Sign up</Link>
            </Typography>
        </div>
     );
}
 
export default LoginPage;