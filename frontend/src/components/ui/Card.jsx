import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export const Card = React.forwardRef(({ className, children, hoverEffect = true, ...props }, ref) => {
    return (
        <motion.div
            ref={ref}
            whileHover={hoverEffect ? { y: -3, transition: { duration: 0.2 } } : {}}
            className={cn(
                "bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700",
                hoverEffect && "hover:shadow-md",
                className
            )}
            {...props}
        >
            <div className="w-full h-full">
                {children}
            </div>
        </motion.div>
    )
});

Card.displayName = "Card";

export const CardHeader = ({ className, ...props }) => (
    <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
)

export const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight text-slate-900 dark:text-slate-100", className)} {...props} />
))
CardTitle.displayName = "CardTitle"

export const CardContent = React.forwardRef(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"
