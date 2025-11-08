"use client";

import { useState } from "react";
import { X } from "lucide-react";

type AlertBannerProps = {
    message: string;
    variant?: "info" | "warning" | "error" | "success";
};

export default function Alert({ message, variant = "info" }: AlertBannerProps) {
    const [visible, setVisible] = useState(true);
    const [closing, setClosing] = useState(false);

    const variants = {
        info: "bg-indigo-200 text-indigo-950 dark:bg-indigo-900 dark:text-indigo-100",
        warning: "bg-amber-200 text-amber-950 dark:bg-amber-900 dark:text-amber-100",
        error: "bg-rose-200 text-rose-950 dark:bg-rose-900 dark:text-rose-100",
        success: "bg-emerald-200 text-emerald-950 dark:bg-emerald-900 dark:text-emerald-100",
    };

    const handleClose = () => {
        setClosing(true);
        setTimeout(() => setVisible(false), 300);
    };

    if (!visible) return null;

    return (
        <div
            className={`fixed top-0 right-0 z-50 flex w-full items-center justify-between px-4 py-4 font-medium transition-all duration-300 ease-in-out ${
                closing ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
            } ${variants[variant]}`}
        >
            <div className="flex-1 text-center">
                <p className="mx-auto max-w-[90%]">{message}</p>
            </div>
            <button
                onClick={handleClose}
                className="ml-2 shrink-0 rounded-lg p-2 transition-colors duration-200 ease-in-out hover:bg-black/10 dark:hover:bg-white/10"
                aria-label="Close alert"
            >
                <X className="h-5 w-5" />
            </button>
        </div>
    );
}
