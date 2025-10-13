"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { LogOut, Trash2, User } from "lucide-react";
import Button from "./Button";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="sticky top-0 z-50 w-full px-6 py-4 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
            <Trash2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              UrbanWaste
            </h1>
            <p className="text-xs text-gray-500 -mt-1">Port Harcourt</p>
          </div>
        </Link>

        {/* Navigation Items */}
        <div className="flex items-center gap-4">
          {status === "loading" ? (
            <div className="w-20 h-8 bg-gray-200 rounded-lg animate-pulse" />
          ) : session ? (
            <div className="flex items-center gap-3">
              {/* User Info */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100/50 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">
                    {session.user?.name}
                  </p>
                  {/* <p className="text-xs text-gray-500 capitalize">
                    {session.user?.role}
                  </p> */}
                </div>
              </div>

              {/* Sign Out Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/signin" })}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/signin"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl hover:from-emerald-600 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
