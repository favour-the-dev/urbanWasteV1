"use client";
import { useEffect, useMemo, useState } from "react";
import {
    MapPin,
    Route,
    Users,
    Calculator,
    TrendingUp,
    Clock,
    CheckCircle,
    Navigation,
    AlertCircle,
} from "lucide-react";
import MapView from "../../../components/maps/DynamicMap";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import WeatherWidget from "../../../components/widgets/WeatherWidget";
import toast from "react-hot-toast";

type NodeDoc = { _id: string; name: string; coordinates: [number, number] };

export default function AdminDashboard() {
    const [nodes, setNodes] = useState<NodeDoc[]>([]);
    const [start, setStart] = useState<string>("");
    const [end, setEnd] = useState<string>("");
    const [routePath, setRoutePath] = useState<[number, number][]>([]);
    const [distance, setDistance] = useState<number | null>(null);
    const [operators, setOperators] = useState<
        Array<{ _id: string; name: string; email: string }>
    >([]);
    const [selectedOp, setSelectedOp] = useState<string>("");
    const [isComputing, setIsComputing] = useState(false);
    const [isAssigning, setIsAssigning] = useState(false);
    const [edgesCount, setEdgesCount] = useState(0);
    const [reportsStats, setReportsStats] = useState({ total: 0, pending: 0 });

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/admin/graph");
                const data = await res.json();
                setNodes(data.nodes || []);
                setEdgesCount(data.edges?.length || 0);
                const opsRes = await fetch("/api/admin/operators");
                const ops = await opsRes.json();
                setOperators(ops.data || []);

                // Fetch reports stats
                const reportsRes = await fetch("/api/reports");
                const reportsData = await reportsRes.json();
                if (reportsData.success) {
                    const reports = reportsData.reports || [];
                    setReportsStats({
                        total: reports.length,
                        pending: reports.filter(
                            (r: any) => r.status === "pending"
                        ).length,
                    });
                }
            } catch (e) {
                toast.error("Failed to load dashboard data");
            }
        })();
    }, []);

    const onCompute = async () => {
        if (!start || !end || start === end) {
            toast.error("Select different start and end nodes");
            return;
        }

        setIsComputing(true);
        try {
            // Fetch weighted graph
            const res = await fetch("/api/admin/graph?weighted=1");
            const data = await res.json();

            if (!data?.graph) {
                toast.error(
                    "No connections found! Please upload network data with edges first."
                );
                setIsComputing(false);
                return;
            }

            const resp = await fetch("/api/routes/compute", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ graph: data.graph, start, end }),
            });

            if (!resp.ok) {
                const errorData = await resp.json();
                throw new Error(errorData.error || "Failed to compute route");
            }

            const json = await resp.json();

            if (json.error) {
                throw new Error(json.error);
            }

            const namesPath: string[] = json?.result?.path || [];

            if (namesPath.length === 0) {
                toast.error(
                    "No path found between these nodes. They may not be connected."
                );
                setIsComputing(false);
                return;
            }

            const coords: [number, number][] = namesPath
                .map(
                    (name: string) =>
                        (data.nodes as NodeDoc[]).find(
                            (n: NodeDoc) => n.name === name
                        )?.coordinates
                )
                .filter(Boolean) as [number, number][];
            setRoutePath(coords);
            setDistance(json?.result?.totalDistance ?? null);
            toast.success("Computed optimal route");
        } catch (e: any) {
            console.error("Route computation error:", e);
            toast.error(e.message || "Failed to compute route");
        } finally {
            setIsComputing(false);
        }
    };

    const onAssign = async () => {
        if (!selectedOp || !distance || !routePath.length) {
            toast.error("Compute route and select operator first");
            return;
        }

        setIsAssigning(true);
        try {
            // Node names are used in the /api/admin/operators API, but we only have coords here. Re-fetch names from graph mapping.
            const res = await fetch("/api/admin/graph");
            const data = await res.json();
            const nameByCoord = new Map<string, string>();
            (data.nodes as NodeDoc[]).forEach((n: NodeDoc) =>
                nameByCoord.set(String(n.coordinates), n.name)
            );
            const nodeNames = routePath
                .map((c) => nameByCoord.get(String(c)))
                .filter(Boolean);
            const resp = await fetch("/api/admin/operators", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    operatorId: selectedOp,
                    nodeNames,
                    totalDistance: distance,
                }),
            });
            const json = await resp.json();
            if (!json.success) throw new Error(json.message || "Failed");
            toast.success("Route successfully assigned");

            // Reset form after successful assignment
            setStart("");
            setEnd("");
            setSelectedOp("");
            setRoutePath([]);
            setDistance(null);
        } catch (e: any) {
            toast.error(e?.message || "Assignment failed");
        } finally {
            setIsAssigning(false);
        }
    };

    const nodeOptions = useMemo(
        () => nodes.map((n) => ({ id: n._id, name: n.name })),
        [nodes]
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/50 p-6 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        Admin Dashboard
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Optimize routes and manage operations
                    </p>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span suppressHydrationWarning>
                        {new Date().toLocaleDateString()}
                    </span>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Nodes</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {nodes.length}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                            <MapPin className="w-6 h-6 text-emerald-600" />
                        </div>
                    </div>
                </Card>

                <Card className="p-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">
                                Active Operators
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {operators.length}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </Card>

                <Card className="p-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">
                                Routes Today
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                -
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                            <Route className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </Card>

                <Card className="p-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Connections</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {edgesCount}
                            </p>
                            {/* {edgesCount === 0 && (
                                <p className="text-xs text-red-500 mt-1">
                                    Upload edges!
                                </p>
                            )} */}
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Weather and Reports Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weather Widget */}
                <WeatherWidget />

                {/* Reports Summary */}
                <Card className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                            <AlertCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Citizen Reports
                            </h3>
                            <p className="text-sm text-gray-600">
                                Recent community reports
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-purple-50">
                            <div>
                                <p className="text-sm text-gray-600">
                                    Total Reports
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {reportsStats.total}
                                </p>
                            </div>
                            <AlertCircle className="w-10 h-10 text-purple-600" />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-orange-50">
                            <div>
                                <p className="text-sm text-gray-600">
                                    Pending Review
                                </p>
                                <p className="text-2xl font-bold text-orange-600">
                                    {reportsStats.pending}
                                </p>
                            </div>
                            <Clock className="w-10 h-10 text-orange-600" />
                        </div>

                        <Button
                            onClick={() =>
                                (window.location.href = "/admin/reports")
                            }
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                            <AlertCircle className="w-4 h-4" />
                            View All Reports
                        </Button>
                    </div>
                </Card>
            </div>

            {/* Route Computation */}
            <Card className="p-3 lg:p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                        <Calculator className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Route Optimization
                        </h2>
                        <p className="text-gray-600 text-sm">
                            Compute optimal paths between collection points
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                                Start Node
                            </label>
                            <select
                                className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 bg-white hover:border-gray-300 focus:border-emerald-500 focus:outline-none transition-colors"
                                value={start}
                                onChange={(e) => setStart(e.target.value)}
                            >
                                <option value="">Select start point</option>
                                {nodeOptions.map((n) => (
                                    <option key={n.id} value={n.name}>
                                        {n.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                                End Node
                            </label>
                            <select
                                className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 bg-white hover:border-gray-300 focus:border-emerald-500 focus:outline-none transition-colors"
                                value={end}
                                onChange={(e) => setEnd(e.target.value)}
                            >
                                <option value="">Select end point</option>
                                {nodeOptions.map((n) => (
                                    <option key={n.id} value={n.name}>
                                        {n.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <Button
                            onClick={onCompute}
                            loading={isComputing}
                            size="lg"
                            className="w-full flex items-center gap-2"
                        >
                            {isComputing ? "Optimizing..." : "Optimize Route"}
                            <Navigation className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="space-y-4 mt-2 mb-4">
                        <header>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                                Optimized Distance
                            </label>
                        </header>
                        {distance !== null ? (
                            <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                                    <span className="text-sm font-medium text-emerald-800">
                                        Optimal distance: {distance.toFixed(2)}{" "}
                                        km
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full h-full rounded-2xl bg-gray-100 flex flex-col items-center justify-center">
                                <h2 className="text-sm text-gray-600">
                                    No route optimized yet
                                </h2>
                                <p className=" text-gray-400 text-xs text-center mt-1 font-medium">
                                    Select nodes and optimize to see optimized
                                    distance
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="w-full">
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                                Assign to Operator
                            </label>
                            <select
                                className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 bg-white hover:border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
                                value={selectedOp}
                                onChange={(e) => setSelectedOp(e.target.value)}
                            >
                                <option value="">Select operator</option>
                                {operators.map((o) => (
                                    <option key={o._id} value={o._id}>
                                        {o.name} ({o.email})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <Button
                            onClick={onAssign}
                            loading={isAssigning}
                            variant="secondary"
                            size="lg"
                            disabled={
                                !distance || !routePath.length || !selectedOp
                            }
                            className="w-full flex items-center gap-2"
                        >
                            <Users className="w-4 h-4" />
                            {isAssigning ? "Assigning..." : "Assign Route"}
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Map */}
            <Card className="p-3 lg:p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Interactive Map
                        </h2>
                        <p className="text-gray-600 text-sm">
                            Visualize collection points and optimized routes
                        </p>
                    </div>
                </div>
                <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                    <MapView
                        nodes={nodes.map((n) => n.coordinates)}
                        path={routePath}
                    />
                </div>
            </Card>
        </div>
    );
}
