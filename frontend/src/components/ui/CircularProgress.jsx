import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const CircularProgress = ({
    value,
    max = 100,
    size = 120,
    strokeWidth = 10,
    label,
    color = "primary" // primary, secondary, success, warning, danger
}) => {
    const [progress, setProgress] = useState(0);
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / max) * circumference;

    useEffect(() => {
        // slight delay for animation effect
        const timer = setTimeout(() => {
            setProgress(value);
        }, 300);
        return () => clearTimeout(timer);
    }, [value]);

    const colors = {
        primary: "text-primary-500",
        secondary: "text-secondary-500",
        success: "text-green-500",
        warning: "text-yellow-500",
        danger: "text-red-500"
    };

    return (
        <div className="flex flex-col items-center justify-center relative" style={{ width: size, height: size }}>
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="transform -rotate-90"
            >
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    className="text-slate-200 dark:text-slate-800"
                />

                {/* Foreground circle with animation */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    className={colors[color] || colors.primary}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeDasharray={circumference}
                />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black bg-gradient-to-br from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    {Math.round(progress)}<span className="text-sm text-slate-400">%</span>
                </span>
                {label && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-1">
                        {label}
                    </span>
                )}
            </div>
        </div>
    );
};
