"use client";
import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    size?: "sm" | "md" | "lg" | "xl";
    footer?: ReactNode;
}

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = "md",
    footer,
}: ModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: "max-w-md",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
                {/* Backdrop */}
                <div
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />

                {/* Modal */}
                <div
                    className={`
            relative w-full ${sizeClasses[size]} bg-white rounded-2xl shadow-xl 
            border border-slate-200 transition-all duration-200 transform
          `}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 rounded-t-2xl">
                        <h2 className="text-xl font-semibold text-slate-900">
                            {title}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-4">{children}</div>

                    {/* Footer */}
                    {footer && (
                        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
