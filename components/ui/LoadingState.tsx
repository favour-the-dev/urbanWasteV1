import LoadingSpinner from "./LoadingSpinner";

interface LoadingStateProps {
    message?: string;
    className?: string;
}

export default function LoadingState({
    message = "Loading...",
    className = "",
}: LoadingStateProps) {
    return (
        <div
            className={`min-h-[60vh] flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-emerald-50 via-white to-teal-50 ${className}`}
        >
            <LoadingSpinner size="lg" />
            <p className="text-sm text-slate-600">{message}</p>
        </div>
    );
}
