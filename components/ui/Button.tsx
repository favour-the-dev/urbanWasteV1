import { forwardRef } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?:
        | "default"
        | "destructive"
        | "outline"
        | "secondary"
        | "ghost"
        | "link";
    size?: "default" | "sm" | "lg" | "icon";
    loading?: boolean;
    children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className = "",
            variant = "default",
            size = "default",
            loading = false,
            disabled,
            children,
            ...props
        },
        ref
    ) => {
        const baseClasses =
            "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

        const variants = {
            // Primary brand gradient (Emerald to Teal)
            default:
                "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md hover:from-emerald-600 hover:to-teal-700 hover:shadow-lg active:scale-[0.98]",
            destructive:
                "bg-error text-white shadow-md hover:bg-red-600 hover:shadow-lg active:scale-[0.98]",
            outline:
                "border-2 border-slate-200 bg-white text-slate-900 hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100",
            secondary:
                "bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-slate-300",
            ghost: "hover:bg-slate-100 text-slate-900 active:bg-slate-200",
            link: "text-emerald-600 underline-offset-4 hover:underline hover:text-emerald-700",
        };

        const sizes = {
            default: "h-11 px-6 py-2 text-base",
            sm: "h-9 px-4 text-sm",
            lg: "h-12 px-8 text-lg",
            icon: "h-10 w-10",
        };

        return (
            <button
                className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
                disabled={disabled || loading}
                ref={ref}
                {...props}
            >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);

Button.displayName = "Button";
export default Button;
