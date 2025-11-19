"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
    MapPin,
    Route as RouteIcon,
    Clock,
    CheckCircle,
    Play,
    Flag,
    Navigation,
    AlertCircle,
    Truck,
} from "lucide-react";
import MapView from "../../../components/maps/DynamicMap";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import toast from "react-hot-toast";

type NodeDoc = { _id: string; name: string; coordinates: [number, number] };
type RouteDoc = {
    _id: string;
    nodes: NodeDoc[];
    totalDistance: number;
    status: string;
    createdAt?: string;
};

const statusConfig = {
    pending: {
        color: "text-orange-600",
        bg: "bg-orange-100",
        icon: Clock,
        label: "Pending",
    },
    active: {
        color: "text-blue-600",
        bg: "bg-blue-100",
        icon: Play,
        label: "Active",
    },
    completed: {
        color: "text-green-600",
        bg: "bg-green-100",
        icon: CheckCircle,
        label: "Completed",
    },
};

export default function OperatorDashboard() {
    const { data: session } = useSession();
    const [route, setRoute] = useState<RouteDoc | null>(null);
    const [coords, setCoords] = useState<[number, number][]>([]);
    const [isUpdating, setIsUpdating] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchRoute = async (operatorId: string) => {
        const res = await fetch(`/api/operator/route?operatorId=${operatorId}`);
        const json = await res.json();
        if (!json.success) {
            toast.error(json.error || "Failed to load assigned route");
        }
        setRoute(json.data || null);
        setCoords((json.data?.nodes || []).map((n: NodeDoc) => n.coordinates));
    };

    useEffect(() => {
        (async () => {
            try {
                const operatorId = (session as any)?.user?.id;
                if (!operatorId) {
                    setLoading(false);
                    return;
                }
                await fetchRoute(operatorId);
            } catch (e: any) {
                console.error("Route fetch error:", e);
                toast.error("Failed to load assigned route");
            } finally {
                setLoading(false);
            }
        })();
    }, [session]);

    // Poll for updates every 15s when route isn't completed
    useEffect(() => {
        const operatorId = (session as any)?.user?.id;
        if (!operatorId) return;
        if (route?.status === "completed") return;
        const id = setInterval(() => {
            fetchRoute(operatorId).catch(() => {});
        }, 15000);
        return () => clearInterval(id);
    }, [session, route?.status]);

    const onStatus = async (status: "active" | "completed") => {
        if (!route?._id) return;

        setIsUpdating(true);
        try {
            const res = await fetch("/api/operator/status", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ routeId: route._id, status }),
            });
            const json = await res.json();
            if (!json.success) throw new Error(json.message || "Failed");

            toast.success(
                status === "active"
                    ? "Route started successfully"
                    : "Route completed successfully"
            );

            // Refresh route data
            const operatorId = (session as any)?.user?.id;
            const r = await fetch(
                `/api/operator/route?operatorId=${operatorId}`
            );
            const j = await r.json();
            setRoute(j.data || null);
            setCoords((j.data?.nodes || []).map((n: NodeDoc) => n.coordinates));
        } catch (e: any) {
            toast.error(e?.message || "Update failed");
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading your route...</p>
                </div>
            </div>
        );
    }

    const currentStatus = route?.status || "pending";
    const statusInfo =
        statusConfig[currentStatus as keyof typeof statusConfig] ||
        statusConfig.pending;

    return (
        <div className="min-h-screen bg-slate-50 p-6 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        My Route
                    </h1>
                    <p className="text-slate-600 mt-1">
                        Track and manage your assigned collection route
                    </p>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Clock className="w-4 h-4" />
                    <span suppressHydrationWarning>
                        {new Date().toLocaleDateString()}
                    </span>
                </div>
            </div>

            {route ? (
                <>
                    {/* Status Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Status
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div
                                            className={`w-8 h-8 rounded-full ${statusInfo.bg} flex items-center justify-center`}
                                        >
                                            <statusInfo.icon
                                                className={`w-4 h-4 ${statusInfo.color}`}
                                            />
                                        </div>
                                        <span
                                            className={`text-lg font-semibold ${statusInfo.color}`}
                                        >
                                            {statusInfo.label}
                                        </span>
                                    </div>
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
                                        {route.totalDistance?.toFixed(1) || "0"}{" "}
                                        km
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                                    <RouteIcon className="w-6 h-6 text-emerald-600" />
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
                                        {route.nodes?.length || 0}
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                                    <MapPin className="w-6 h-6 text-emerald-600" />
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Route ID
                                    </p>
                                    <p className="text-sm font-mono text-gray-900 truncate">
                                        {route._id?.slice(-8) || "N/A"}
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                                    <Navigation className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Route Actions */}
                    <Card className="p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center">
                                <Truck className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-slate-900">
                                    Route Controls
                                </h2>
                                <p className="text-slate-600 text-sm">
                                    Update your route status and progress
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            {currentStatus === "pending" && (
                                <Button
                                    onClick={() => onStatus("active")}
                                    loading={isUpdating}
                                    size="lg"
                                >
                                    <Play className="w-4 h-4" />
                                    Start Route
                                </Button>
                            )}

                            {currentStatus === "active" && (
                                <Button
                                    onClick={() => onStatus("completed")}
                                    loading={isUpdating}
                                    size="lg"
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    <Flag className="w-4 h-4" />
                                    Complete Route
                                </Button>
                            )}

                            {currentStatus === "completed" && (
                                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-50 border border-green-200">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    <span className="text-green-800 font-medium">
                                        Route completed successfully
                                    </span>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Map */}
                    <Card className="p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-slate-900">
                                    Route Map
                                </h2>
                                <p className="text-slate-600 text-sm">
                                    Your assigned collection route and waypoints
                                </p>
                            </div>
                        </div>
                        <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                            <MapView nodes={coords} path={coords} />
                        </div>
                    </Card>

                    {/* Collection Points List */}
                    {route.nodes && route.nodes.length > 0 && (
                        <Card className="p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-slate-900">
                                        Collection Points
                                    </h2>
                                    <p className="text-slate-600 text-sm">
                                        Waypoints in your assigned route
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {route.nodes.map((node, index) => (
                                    <div
                                        key={node._id}
                                        className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900">
                                                    {node.name}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {node.coordinates[0]?.toFixed(
                                                        4
                                                    )}
                                                    ,{" "}
                                                    {node.coordinates[1]?.toFixed(
                                                        4
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}
                </>
            ) : (
                /* No Route Assigned */
                <Card className="p-12 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <AlertCircle className="w-10 h-10 text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                        No Route Assigned
                    </h2>
                    <p className="text-gray-600 mb-6">
                        You don't have any routes assigned at the moment.
                        Contact your administrator for route assignment.
                    </p>
                    <Button
                        onClick={() => window.location.reload()}
                        variant="outline"
                    >
                        Refresh Page
                    </Button>
                </Card>
            )}
        </div>
    );
}
