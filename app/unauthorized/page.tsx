"use client";
import { ShieldAlert } from "lucide-react";
import Button from "../../components/ui/Button";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-6">
            <div className="text-center max-w-md">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
                    <ShieldAlert className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Access Denied
                </h1>
                <p className="text-gray-600 mb-8">
                    You don't have permission to access this page. Please
                    contact your administrator if you believe this is an error.
                </p>
                <div className="flex gap-4 justify-center">
                    <Button onClick={() => router.back()} variant="outline">
                        Go Back
                    </Button>
                    <Button onClick={() => router.push("/signin")}>
                        Sign In
                    </Button>
                </div>
            </div>
        </div>
    );
}
