"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
    CheckCircle,
    Route as RouteIcon,
    MapPin,
    Calendar,
    Clock,
    Award,
    TrendingUp,
    Package,
} from "lucide-react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";

type CompletedRoute = {
    _id: string;
    totalDistance: number;
    nodes: any[];
    completedAt?: string;
    createdAt?: string;
};

export default function CompletedRoutes() {
    const { data: session } = useSession();
    const [routes, setRoutes] = useState<CompletedRoute[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const id = (session as any)?.user?.id;
            if (!id) return;
            try {
                const res = await fetch(
                    `/api/operator/routes/completed?operatorId=${id}`
                );
                const json = await res.json();
                setRoutes(json.data || []);
            } catch (e) {
                console.error("Failed to load completed routes", e);
            } finally {
                setLoading(false);
            }
        })();
    }, [session]);

    const totalDistance = routes.reduce(
        (sum, r) => sum + (r.totalDistance || 0),
        0
    );
    const totalStops = routes.reduce(
        (sum, r) => sum + (r.nodes?.length || 0),
        0
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-emerald-50/50 p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading completed routes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-emerald-50/50 p-6 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        Completed Routes
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Your collection history and achievements
                    </p>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span suppressHydrationWarning>
                        {new Date().toLocaleDateString()}
                    </span>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">
                                Total Routes
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {routes.length}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">
                                Total Distance
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {totalDistance.toFixed(1)} km
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                            <RouteIcon className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">
                                Collection Points
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {totalStops}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                            <MapPin className="w-6 h-6 text-emerald-600" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Routes List */}
            {routes.length > 0 ? (
                <Card className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                            <Package className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Route History
                            </h2>
                            <p className="text-gray-600 text-sm">
                                All your completed collection routes
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {routes.map((route, index) => (
                            <div
                                key={route._id}
                                className="p-6 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 bg-white"
                            >
                                <div className="flex items-center justify-between flex-wrap gap-4">
                                    {/* Route Info */}
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                                            <span className="text-green-700 font-bold text-lg">
                                                #{routes.length - index}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-lg">
                                                Route {route._id.slice(-8)}
                                            </h3>
                                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    <span
                                                        suppressHydrationWarning
                                                    >
                                                        {route.completedAt
                                                            ? new Date(
                                                                  route.completedAt
                                                              ).toLocaleDateString()
                                                            : route.createdAt
                                                            ? new Date(
                                                                  route.createdAt
                                                              ).toLocaleDateString()
                                                            : "N/A"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex items-center gap-6">
                                        <div className="text-center">
                                            <p className="text-sm text-gray-600">
                                                Distance
                                            </p>
                                            <p className="text-lg font-semibold text-blue-600">
                                                {route.totalDistance?.toFixed?.(
                                                    1
                                                ) || "0"}{" "}
                                                km
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm text-gray-600">
                                                Stops
                                            </p>
                                            <p className="text-lg font-semibold text-emerald-600">
                                                {route.nodes?.length || 0}
                                            </p>
                                        </div>
                                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            ) : (
                <Card className="p-12 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <TrendingUp className="w-10 h-10 text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                        No Completed Routes Yet
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Start and complete your first route to see your history
                        here.
                    </p>
                    <Button
                        onClick={() =>
                            (window.location.href = "/operator/dashboard")
                        }
                        variant="outline"
                    >
                        Go to Dashboard
                    </Button>
                </Card>
            )}
        </div>
    );
}
