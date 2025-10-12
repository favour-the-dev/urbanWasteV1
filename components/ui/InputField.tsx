"use client";
import { forwardRef } from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

const InputField = forwardRef<HTMLInputElement, Props>(
  ({ label, error, ...props }, ref) => {
    return (
      <div className="mb-4">
        {label && <label className="block text-sm mb-1">{label}</label>}
        <input
          ref={ref}
          className="w-full px-3 py-2 rounded border bg-white/5"
          {...props}
        />
        {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
      </div>
    );
  }
);

InputField.displayName = "InputField";
export default InputField;
