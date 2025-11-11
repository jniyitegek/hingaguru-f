"use client";

import React, { ElementType } from "react";
import clsx from "clsx";
import { cn } from "@/lib/utils";
import Typography from "./Typography";
import { SearchIcon } from "lucide-react";

type InputVariant = "text" | "email" | "password" | "number" | "date" | "textarea" | "select";

interface SelectOption {
    value: string;
    label: React.ReactNode;
}

interface InputProps {
    variant?: InputVariant;
    label?: string;
    error?: string;
    options?: SelectOption[];
    name?: string;
    id: string;
    value?: string;
    placeholder?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
    required?: boolean;
    wrapperClassName?: string;
    labelClassName?: string;
    className?: string;
    border?: boolean;
}

export default function Input({
    variant = "text",
    label,
    error,
    options = [],
    name,
    id,
    value,
    placeholder,
    onChange,
    disabled,
    required,
    wrapperClassName,
    labelClassName,
    border = true,
    className: inputClassName,
}: InputProps) {
    const inputId = id;

    const tagMap: Record<InputVariant, ElementType> = {
        text: "input",
        email: "input",
        password: "input",
        number: "input",
        date: "input",
        textarea: "textarea",
        select: "select",
    };

    const Component = tagMap[variant];

    
    let isSearch: boolean = false;
    let ParentComponent: ElementType = "div";
    
    if (id.startsWith("search")) {
        isSearch = true
        ParentComponent = "label";
    }

    const baseClasses =
        "px-[14px] py-[10px] rounded-md outline-none transition ring-[1.2px] text-[16px] text-gray-700 font-normal placeholder:font-light placeholder:text-gray w-auto h-10";
    const errorClasses = error ? "ring-red-500 focus:ring-red-500" : "ring-gray-300 focus:ring-primary-500";
    const searchClasses = isSearch ? "ring-0 focus:ring-0 px-0 py-3 m-0" : "";
    const mergedClasses = cn(baseClasses, errorClasses, searchClasses, !border && "ring-0", inputClassName);

    return (
        <ParentComponent className={cn(`flex flex-col gap-1 ${isSearch && (mergedClasses + "w-full flex flex-row px-[14px] my-3 py-0 items-center ring-[1.2px] ring-gray-300 h-10")} ${!border && "ring-0"}`, wrapperClassName)}>
            {label && (
                <label
                    htmlFor={inputId}
                    className={clsx("", labelClassName)}
                >
                    <Typography weight={`medium`} color={`gray_900`}>
                        {label} {required && <span>*</span>}
                    </Typography>
                </label>
            )}
            {
                isSearch && (
                    <SearchIcon className={`text-gray-500`}/>
                )
            }
            {variant === "select" ? (
                <select
                    id={inputId}
                    name={name}
                    value={value}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange?.(e.target.value)}
                    disabled={disabled}
                    required={required}
                    className={mergedClasses}
                >
                    {options.map((opt) => (
                        <option key={String(opt.value)} value={String(opt.value)}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            ) : (
                <Component
                    id={inputId}
                    name={name}
                    {...(variant !== "textarea" ? { type: variant } : {})}
                    value={value}
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                        onChange?.((e.target as HTMLInputElement | HTMLTextAreaElement).value)
                    }
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    className={mergedClasses}
                    {...(variant === "textarea" ? { rows: 4 } : {})}
                />
            )}

            {error && <Typography className={`text-red-500`}>{error}</Typography>}
        </ParentComponent>
    );
}
