"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full p-4 flex justify-between items-center bg-transparent">
      <div className="text-lg font-semibold">UrbanWaste</div>
      <div className="space-x-4">
        <Link className="text-sm text-gray-300" href="/signin">
          Sign in
        </Link>
        <Link
          className="text-sm text-white bg-blue-600 px-3 py-1 rounded"
          href="/signup"
        >
          Sign up
        </Link>
      </div>
    </nav>
  );
}
