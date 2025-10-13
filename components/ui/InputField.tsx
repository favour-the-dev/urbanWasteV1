"use client";
import { forwardRef } from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  variant?: "default" | "ghost";
};

const InputField = forwardRef<HTMLInputElement, Props>(
  (
    { label, error, icon, variant = "default", className = "", ...props },
    ref
  ) => {
    const baseStyles =
      "w-full h-12 rounded-xl border-2 px-4 text-gray-900 placeholder:text-gray-500 transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

    const variantStyles = {
      default:
        "border-gray-200 bg-white/50 backdrop-blur-sm hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20",
      ghost:
        "border-transparent bg-gray-100/50 backdrop-blur-sm hover:bg-gray-100 hover:border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white/80",
    };

    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              ${baseStyles}
              ${variantStyles[variant]}
              ${icon ? "pl-10" : "px-4"}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="text-sm text-red-500 flex items-center gap-2">
            <span className="w-1 h-1 bg-red-500 rounded-full" />
            {error}
          </p>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";
export default InputField;
