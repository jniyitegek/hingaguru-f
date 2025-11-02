"use client"

import AuthTitle from "@/components/sections/auth/Title";
import Typography from "@/components/ui/Typography";
import Link from "next/link";
import { useState, useEffect } from "react";
import SignupBasics from "./comps/Basics";
import ProfileInfo from "./comps/ProfileInfo";
import SignupFinalize from "./comps/Finalize";
import { cn } from "@/lib/utils";

const SignupPage = () => {
    const [currentSection, setCurrentSection] = useState(0);
    const [transitioning, setTransitioning] = useState(false);
    const [visibleSection, setVisibleSection] = useState(0);

    useEffect(() => {
        setTransitioning(true);
        const timeout = setTimeout(() => {
            setVisibleSection(currentSection);
            setTransitioning(false);
        }, 150);
        return () => clearTimeout(timeout);
    }, [currentSection]);

    const sections = [
        <SignupBasics key="step-0" setCurrentSection={setCurrentSection} />,
        <ProfileInfo key="step-1" setCurrentSection={setCurrentSection} />,
        <SignupFinalize key="step-2" />,
    ];

    return (
        <div>
            <AuthTitle title="Sign up" subtitle="" />

            <div
                className={cn(
                    "transition-al durations]",
                    transitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
                )}
            >
                {sections[visibleSection]}
            </div>

            <Typography
                className={cn(
                    "mx-auto w-fit my-8 transition-opacity durations]",
                    currentSection === 2 && "opacity-0 pointer-events-none"
                )}
            >
                Already have an account?{" "}
                <Link href="/auth/login" className="text-primary-700 font-medium">
                    Login
                </Link>
            </Typography>

            <div className="flex justify-center gap-2">
                {[0, 1, 2].map((item) => (
                    <div
                        key={item}
                        className={cn(
                            "w-[8px] h-[8px] rounded-full transition-all duration-300",
                            item === currentSection
                                ? "bg-primary-700 scale-125"
                                : "bg-primary-700/40"
                        )}
                    />
                ))}
            </div>
        </div>
    );
};

export default SignupPage;
