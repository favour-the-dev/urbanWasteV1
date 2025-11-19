"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { LogOut, Trash2, User } from "lucide-react";
import Button from "./Button";

export default function Navbar() {
    const { data: session, status } = useSession();

    return (
        <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-gray-200 shadow-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200">
                            <Trash2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-slate-900">
                                Ecoroute
                            </h1>
                            <p className="text-xs text-slate-500 -mt-0.5">
                                Smart Waste Management
                            </p>
                        </div>
                    </Link>

                    {/* Navigation Items */}
                    <div className="flex items-center gap-3">
                        {status === "loading" ? (
                            <div className="w-20 h-8 bg-gray-200 rounded-lg animate-pulse" />
                        ) : session ? (
                            <div className="flex items-center gap-3">
                                {/* User Info */}
                                <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                                        <User className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="text-sm">
                                        <p className="font-medium text-slate-900">
                                            {session.user?.name}
                                        </p>
                                    </div>
                                </div>

                                {/* Sign Out Button */}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                        signOut({ callbackUrl: "/signin" })
                                    }
                                    className="text-slate-600 hover:text-red-600 hover:bg-red-50 gap-2 rounded-lg"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span className="hidden sm:inline">
                                        Sign out
                                    </span>
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 sm:gap-3">
                                <Link href="/signin">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="rounded-full"
                                    >
                                        Sign in
                                    </Button>
                                </Link>
                                <Link href="/signup">
                                    <Button size="sm" className="rounded-full">
                                        Sign up
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
