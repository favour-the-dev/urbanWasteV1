"use client";
import Link from "next/link";
import { ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
    Home,
    FileText,
    AlertCircle,
    LogOut,
    User,
    Trash2,
    Menu,
    X,
} from "lucide-react";

const navigation = [
    { name: "Dashboard", href: "/citizen/dashboard", icon: Home },
    { name: "Submit Report", href: "/citizen/report", icon: AlertCircle },
    { name: "My Reports", href: "/citizen/reports", icon: FileText },
];

export default function CitizenLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    function handleSignOut() {
        signOut({ callbackUrl: "/signin" });
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-emerald-50/40 via-white to-teal-50/40">
            {/* Mobile Header */}
            <div className="md:hidden bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                            <Trash2 className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h1 className="text-base font-bold text-gray-900">
                                Ecoroute
                            </h1>
                            <p className="text-xs text-emerald-600 font-medium">
                                Citizen
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-6 h-6 text-gray-600" />
                        ) : (
                            <Menu className="w-6 h-6 text-gray-600" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-slate-900/50 z-40"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 shadow-lg
          transform transition-transform duration-300 ease-in-out
          md:translate-x-0 md:shadow-sm
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
            >
                <div className="flex flex-col h-full">
                    {/* Logo - Desktop Only */}
                    <div className="hidden md:flex items-center gap-3 px-6 py-6 border-b border-slate-200">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                            <Trash2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">
                                Ecoroute
                            </h1>
                            <p className="text-xs text-emerald-600 font-medium">
                                Citizen Portal
                            </p>
                        </div>
                    </div>

                    {/* Mobile Close Button */}
                    <div className="md:hidden flex items-center justify-between px-4 py-4 border-b border-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                                <Trash2 className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-gray-900">
                                    Ecoroute
                                </h1>
                                <p className="text-xs text-emerald-600 font-medium">
                                    Citizen Portal
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`
                    group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200
                    ${
                        isActive
                            ? "bg-emerald-50 text-emerald-700 shadow-sm"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }
                  `}
                                >
                                    <item.icon
                                        className={`w-5 h-5 ${
                                            isActive
                                                ? "text-emerald-600"
                                                : "text-slate-400 group-hover:text-slate-600"
                                        }`}
                                    />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Profile */}
                    <div className="p-4 border-t border-slate-200">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 truncate">
                                    {session?.user?.name || "Citizen"}
                                </p>
                                <p className="text-xs text-slate-500">
                                    Citizen
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleSignOut}
                            className="w-full mt-3 flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 md:pl-64 pt-14 md:pt-0">{children}</div>
        </div>
    );
}
