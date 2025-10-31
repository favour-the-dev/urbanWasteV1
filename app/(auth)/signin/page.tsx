"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Lock, Trash2, MapPin, ArrowRight } from "lucide-react";
import InputField from "../../../components/ui/InputField";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../../components/ui/Navbar";

const schema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type Inputs = z.infer<typeof schema>;

export default function SignInPage() {
    const router = useRouter();
    const { register, handleSubmit, formState, watch } = useForm<Inputs>({
        resolver: zodResolver(schema),
    });

    const isLoading = formState.isSubmitting;

    async function onSubmit(values: Inputs) {
        const toastId = toast.loading("Signing in...");
        try {
            const res = await signIn("credentials", {
                redirect: false,
                email: values.email,
                password: values.password,
            });

            if (res && (res as any).error) {
                toast.error("Invalid credentials", { id: toastId });
                return;
            }

            toast.success("Signed in successfully", { id: toastId });

            // fetch session to get role and redirect client-side
            const resp = await fetch("/api/auth/session");
            const json = await resp.json();
            const role = json?.user?.role;

            if (role === "admin") {
                router.push("/admin/dashboard");
            } else if (role === "operator") {
                router.push("/operator/dashboard");
            } else {
                router.push("/citizen/dashboard");
            }
        } catch (error) {
            toast.error("Something went wrong", { id: toastId });
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50">
            <Navbar />

            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-teal-600/10" />
                <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-24">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Side - Branding */}
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-2xl">
                                        <Trash2 className="w-8 h-8 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                            UrbanWaste
                                        </h1>
                                        <p className="text-gray-600 font-medium">
                                            Smart Waste Management
                                        </p>
                                    </div>
                                </div>

                                <p className="text-xl text-gray-700 leading-relaxed">
                                    Optimizing waste collection routes across
                                    Port Harcourt with intelligent algorithms
                                    and real-time tracking.
                                </p>
                            </div>

                            {/* Features */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <MapPin className="w-5 h-5 text-emerald-500" />
                                    <span>Real-time route optimization</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <ArrowRight className="w-5 h-5 text-emerald-500" />
                                    <span>Efficient waste collection</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Sign In Form */}
                        <div className="flex justify-center">
                            <Card className="w-full max-w-md p-8">
                                <div className="space-y-6">
                                    <div className="text-center space-y-2">
                                        <h2 className="text-2xl font-bold text-gray-900">
                                            Welcome back
                                        </h2>
                                        <p className="text-gray-600">
                                            Sign in to your account to continue
                                        </p>
                                    </div>

                                    <form
                                        onSubmit={handleSubmit(onSubmit)}
                                        className="space-y-6"
                                    >
                                        <InputField
                                            label="Email address"
                                            type="email"
                                            placeholder="Enter your email"
                                            icon={<Mail className="w-4 h-4" />}
                                            {...register("email")}
                                            error={
                                                formState.errors.email?.message
                                            }
                                        />

                                        <InputField
                                            label="Password"
                                            type="password"
                                            placeholder="Enter your password"
                                            icon={<Lock className="w-4 h-4" />}
                                            {...register("password")}
                                            error={
                                                formState.errors.password
                                                    ?.message
                                            }
                                        />

                                        <Button
                                            type="submit"
                                            className="w-full"
                                            loading={isLoading}
                                        >
                                            {isLoading
                                                ? "Signing in..."
                                                : "Sign in"}
                                        </Button>
                                    </form>

                                    <div className="text-center">
                                        <p className="text-sm text-gray-600">
                                            Don't have an account?{" "}
                                            <Link
                                                href="/signup"
                                                className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
                                            >
                                                Sign up here
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
