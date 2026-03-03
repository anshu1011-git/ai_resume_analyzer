import { cn } from "../../lib/utils";

export const Skeleton = ({ className, ...props }) => {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-slate-200/50 dark:bg-slate-700/50", className)}
            {...props}
        />
    )
}

export const Loader = () => {
    return (
        <div className="flex items-center justify-center w-full h-full min-h-[200px]">
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-t-2 border-primary-500 animate-spin" style={{ animationDuration: '1s' }}></div>
                <div className="absolute inset-2 rounded-full border-r-2 border-secondary-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                <div className="absolute inset-4 rounded-full border-b-2 border-blue-400 animate-spin" style={{ animationDuration: '2s' }}></div>
            </div>
        </div>
    )
}
