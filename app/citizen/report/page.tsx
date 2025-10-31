"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    AlertCircle,
    MapPin,
    Navigation,
    Send,
    Upload as UploadIcon,
} from "lucide-react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import InputField from "../../../components/ui/InputField";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const reportSchema = z.object({
    type: z.enum([
        "Full Bin",
        "Flooding",
        "Road Block",
        "Damaged Bin",
        "Other",
    ]),
    description: z
        .string()
        .min(10, "Description must be at least 10 characters"),
    location: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    priority: z.enum(["low", "medium", "high", "urgent"]),
});

type ReportForm = z.infer<typeof reportSchema>;

const reportTypes = [
    { value: "Full Bin", label: "Full Bin", icon: "🗑️" },
    { value: "Flooding", label: "Flooding", icon: "🌊" },
    { value: "Road Block", label: "Road Block", icon: "🚧" },
    { value: "Damaged Bin", label: "Damaged Bin", icon: "🔨" },
    { value: "Other", label: "Other Issue", icon: "📋" },
];

const priorityLevels = [
    { value: "low", label: "Low", color: "bg-gray-100 text-gray-700" },
    { value: "medium", label: "Medium", color: "bg-blue-100 text-blue-700" },
    { value: "high", label: "High", color: "bg-orange-100 text-orange-700" },
    { value: "urgent", label: "Urgent", color: "bg-red-100 text-red-700" },
];

export default function ReportPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [gettingLocation, setGettingLocation] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<ReportForm>({
        resolver: zodResolver(reportSchema),
        defaultValues: {
            priority: "medium",
        },
    });

    const selectedType = watch("type");
    const selectedPriority = watch("priority");
    const latitude = watch("latitude");
    const longitude = watch("longitude");

    const getLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }

        setGettingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setValue("latitude", position.coords.latitude);
                setValue("longitude", position.coords.longitude);
                toast.success("Location captured successfully!");
                setGettingLocation(false);
            },
            (error) => {
                toast.error("Failed to get location");
                setGettingLocation(false);
            }
        );
    };

    const onSubmit = async (data: ReportForm) => {
        const citizenId = (session as any)?.user?.id;
        if (!citizenId) {
            toast.error("Please sign in to submit a report");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/reports", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...data,
                    citizenId,
                    coordinates:
                        data.latitude && data.longitude
                            ? {
                                  latitude: data.latitude,
                                  longitude: data.longitude,
                              }
                            : undefined,
                }),
            });

            const result = await res.json();

            if (result.success) {
                toast.success("Report submitted successfully!");
                reset();
                router.push("/citizen/reports");
            } else {
                toast.error(result.error || "Failed to submit report");
            }
        } catch (error) {
            console.error("Error submitting report:", error);
            toast.error("Failed to submit report");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/50 p-6">
            <div className="max-w-3xl mx-auto space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        Submit a Report
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Help us improve waste management in your area
                    </p>
                </motion.div>

                {/* Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="p-8">
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            {/* Report Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Report Type{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {reportTypes.map((type) => (
                                        <label
                                            key={type.value}
                                            className={`relative flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                                selectedType === type.value
                                                    ? "border-emerald-500 bg-emerald-50"
                                                    : "border-gray-200 hover:border-emerald-200"
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                value={type.value}
                                                {...register("type")}
                                                className="sr-only"
                                            />
                                            <span className="text-3xl mb-2">
                                                {type.icon}
                                            </span>
                                            <span className="text-sm font-medium text-gray-900">
                                                {type.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                                {errors.type && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.type.message}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    {...register("description")}
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors resize-none"
                                    placeholder="Provide detailed information about the issue..."
                                />
                                {errors.description && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.description.message}
                                    </p>
                                )}
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Location (Optional)
                                </label>
                                <InputField
                                    {...register("location")}
                                    placeholder="e.g., Near Market Square"
                                />
                            </div>

                            {/* Geolocation */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    GPS Coordinates (Optional)
                                </label>
                                <div className="flex gap-4">
                                    <Button
                                        type="button"
                                        onClick={getLocation}
                                        loading={gettingLocation}
                                        variant="outline"
                                        className="flex-1"
                                    >
                                        <Navigation className="w-4 h-4" />
                                        {latitude && longitude
                                            ? "Update Location"
                                            : "Get My Location"}
                                    </Button>
                                </div>
                                {latitude && longitude && (
                                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-green-600" />
                                        <span className="text-sm text-green-800">
                                            Location: {latitude.toFixed(6)},{" "}
                                            {longitude.toFixed(6)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Priority */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Priority Level
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {priorityLevels.map((priority) => (
                                        <label
                                            key={priority.value}
                                            className={`relative flex items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all ${
                                                selectedPriority ===
                                                priority.value
                                                    ? "border-emerald-500 shadow-sm"
                                                    : "border-gray-200 hover:border-emerald-200"
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                value={priority.value}
                                                {...register("priority")}
                                                className="sr-only"
                                            />
                                            <span
                                                className={`text-sm font-medium px-3 py-1 rounded-full ${priority.color}`}
                                            >
                                                {priority.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-4 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    loading={isSubmitting}
                                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                                >
                                    <Send className="w-4 h-4" />
                                    Submit Report
                                </Button>
                            </div>
                        </form>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
