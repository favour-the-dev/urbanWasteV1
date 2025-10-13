"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  User,
  Mail,
  Lock,
  UserCheck,
  Trash2,
  Shield,
  Truck,
} from "lucide-react";
import InputField from "../../../components/ui/InputField";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../../components/ui/Navbar";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "operator"]),
});

type Inputs = z.infer<typeof schema>;

export default function SignUpPage() {
  const router = useRouter();
  const { register, handleSubmit, formState, watch } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: { role: "operator" },
  });

  const selectedRole = watch("role");
  const isLoading = formState.isSubmitting;

  async function onSubmit(values: Inputs) {
    const toastId = toast.loading("Creating account...");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json?.error || "Signup failed", { id: toastId });
        return;
      }
      toast.success("Account created successfully", { id: toastId });
      router.push("/signin");
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
                      Join UrbanWaste
                    </h1>
                    <p className="text-gray-600 font-medium">
                      Smart Waste Management Team
                    </p>
                  </div>
                </div>

                <p className="text-xl text-gray-700 leading-relaxed">
                  Be part of the solution for cleaner, more efficient waste
                  management in Port Harcourt.
                </p>
              </div>

              {/* Role Benefits */}
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/50 backdrop-blur-sm">
                  <Shield className="w-6 h-6 text-blue-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Admin Role</h3>
                    <p className="text-gray-600 text-sm">
                      Manage operations, optimize routes, and oversee the entire
                      waste management system.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/50 backdrop-blur-sm">
                  <Truck className="w-6 h-6 text-emerald-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Operator Role
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Execute collection routes, update statuses, and ensure
                      efficient waste collection.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Sign Up Form */}
            <div className="flex justify-center">
              <Card className="w-full max-w-md p-8">
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Create your account
                    </h2>
                    <p className="text-gray-600">
                      Join the waste management revolution
                    </p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <InputField
                      label="Full name"
                      placeholder="Enter your full name"
                      icon={<User className="w-4 h-4" />}
                      {...register("name")}
                      error={formState.errors.name?.message}
                    />

                    <InputField
                      label="Email address"
                      type="email"
                      placeholder="Enter your email"
                      icon={<Mail className="w-4 h-4" />}
                      {...register("email")}
                      error={formState.errors.email?.message}
                    />

                    <InputField
                      label="Password"
                      type="password"
                      placeholder="Create a strong password"
                      icon={<Lock className="w-4 h-4" />}
                      {...register("password")}
                      error={formState.errors.password?.message}
                    />

                    {/* Role Selection */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gray-700">
                        Choose your role
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <label
                          className={`
                          relative flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                          ${
                            selectedRole === "operator"
                              ? "border-emerald-500 bg-emerald-50"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }
                        `}
                        >
                          <input
                            type="radio"
                            value="operator"
                            {...register("role")}
                            className="sr-only"
                          />
                          <Truck
                            className={`w-6 h-6 mb-2 ${
                              selectedRole === "operator"
                                ? "text-emerald-600"
                                : "text-gray-400"
                            }`}
                          />
                          <span
                            className={`text-sm font-medium ${
                              selectedRole === "operator"
                                ? "text-emerald-900"
                                : "text-gray-600"
                            }`}
                          >
                            Operator
                          </span>
                        </label>

                        <label
                          className={`
                          relative flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                          ${
                            selectedRole === "admin"
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }
                        `}
                        >
                          <input
                            type="radio"
                            value="admin"
                            {...register("role")}
                            className="sr-only"
                          />
                          <Shield
                            className={`w-6 h-6 mb-2 ${
                              selectedRole === "admin"
                                ? "text-blue-600"
                                : "text-gray-400"
                            }`}
                          />
                          <span
                            className={`text-sm font-medium ${
                              selectedRole === "admin"
                                ? "text-blue-900"
                                : "text-gray-600"
                            }`}
                          >
                            Admin
                          </span>
                        </label>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      loading={isLoading}
                    >
                      {isLoading ? "Creating account..." : "Create account"}
                    </Button>
                  </form>

                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Already have an account?{" "}
                      <Link
                        href="/signin"
                        className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
                      >
                        Sign in here
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
