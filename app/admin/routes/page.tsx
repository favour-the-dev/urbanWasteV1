"use client";
import { useEffect, useMemo, useState } from "react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import MapView from "../../../components/maps/DynamicMap";
import toast from "react-hot-toast";
import {
    Navigation,
    CheckCircle,
    MapPin,
    UserCheck,
    Route as RouteIcon,
    Clock,
} from "lucide-react";

type NodeDoc = { _id: string; name: string; coordinates: [number, number] };
type Operator = { _id: string; name: string; email: string };
type RouteDoc = {
    _id: string;
    assignedTo: { _id: string; name: string; email: string };
    nodes: Array<{ name: string; coordinates: [number, number] }>;
    totalDistance: number;
    status: string;
    createdAt: string;
};

export default function AdminRoutesPage() {
    const [nodes, setNodes] = useState<NodeDoc[]>([]);
    const [operators, setOperators] = useState<Operator[]>([]);
    const [routes, setRoutes] = useState<RouteDoc[]>([]);
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [routePath, setRoutePath] = useState<[number, number][]>([]);
    const [routeNodeNames, setRouteNodeNames] = useState<string[]>([]);
    const [distance, setDistance] = useState<number | null>(null);
    const [isComputing, setIsComputing] = useState(false);
    const [selectedOperator, setSelectedOperator] = useState("");
    const [isAssigning, setIsAssigning] = useState(false);
    const [loadingRoutes, setLoadingRoutes] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/admin/graph");
                const data = await res.json();
                setNodes(data.nodes || []);
            } catch (e) {
                toast.error("Failed to load nodes");
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/admin/operators");
                const data = await res.json();
                setOperators(data.data || []);
            } catch (e) {
                toast.error("Failed to load operators");
            }
        })();
    }, []);

    const fetchRoutes = async () => {
        setLoadingRoutes(true);
        try {
            const res = await fetch("/api/admin/routes");
            const data = await res.json();
            setRoutes(data.routes || []);
        } catch (e) {
            console.error("Failed to load routes", e);
        } finally {
            setLoadingRoutes(false);
        }
    };

    useEffect(() => {
        fetchRoutes();
    }, []);

    const nodeOptions = useMemo(
        () => nodes.map((n) => ({ id: n._id, name: n.name })),
        [nodes]
    );

    const onCompute = async () => {
        if (!start || !end || start === end) {
            toast.error("Select different start and end nodes");
            return;
        }

        setIsComputing(true);
        try {
            // Fetch weighted graph (weather + reports impact)
            const res = await fetch("/api/admin/graph?weighted=1");
            const data = await res.json();

            const resp = await fetch("/api/routes/compute", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ graph: data.graph || {}, start, end }),
            });
            const json = await resp.json();
            const namesPath: string[] = json?.result?.path || [];
            const coords: [number, number][] = namesPath
                .map(
                    (name: string) =>
                        (data.nodes as NodeDoc[]).find((n) => n.name === name)
                            ?.coordinates
                )
                .filter(Boolean) as [number, number][];

            setRoutePath(coords);
            setRouteNodeNames(namesPath);
            setDistance(json?.result?.totalDistance ?? null);
            toast.success("Route computed");
        } catch (e) {
            toast.error("Failed to compute route");
        } finally {
            setIsComputing(false);
        }
    };

    const onAssignRoute = async () => {
        if (!selectedOperator || !routeNodeNames.length || distance === null) {
            toast.error("Please compute a route first and select an operator");
            return;
        }

        setIsAssigning(true);
        try {
            const res = await fetch("/api/admin/operators", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    operatorId: selectedOperator,
                    nodeNames: routeNodeNames,
                    totalDistance: distance,
                }),
            });

            const data = await res.json();

            if (data.success) {
                toast.success("Route assigned to operator successfully!");
                // Reset form
                setStart("");
                setEnd("");
                setRoutePath([]);
                setRouteNodeNames([]);
                setDistance(null);
                setSelectedOperator("");
                // Refresh routes list
                fetchRoutes();
            } else {
                toast.error(data.message || "Failed to assign route");
            }
        } catch (e) {
            toast.error("Failed to assign route");
        } finally {
            setIsAssigning(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Routes
                    </h1>
                    <p className="text-slate-600 mt-1">
                        Compute and preview routes between collection points
                    </p>
                </div>
            </div>

            <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center">
                        <Navigation className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900">
                            Compute Optimized Route
                        </h2>
                        <p className="text-sm text-slate-600">
                            Select nodes and compute the shortest path
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-4">
                        <label className="text-sm font-medium text-gray-700 block">
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

                        <label className="text-sm font-medium text-gray-700 block">
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

                        <Button
                            onClick={onCompute}
                            loading={isComputing}
                            size="lg"
                            className="w-full flex items-center gap-2"
                        >
                            {isComputing ? "Computing..." : "Compute Route"}
                            <Navigation className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="col-span-1 lg:col-span-1 space-y-4">
                        <label className="text-sm font-medium text-gray-700 block">
                            Results
                        </label>
                        {distance !== null ? (
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                                        <div>
                                            <p className="text-xs text-emerald-700">
                                                Optimized Distance
                                            </p>
                                            <p className="text-lg font-bold text-emerald-800">
                                                {distance.toFixed(2)} km
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                                    <p className="text-xs text-emerald-700 mb-2">
                                        Route Path
                                    </p>
                                    <p className="text-sm text-emerald-900 font-medium">
                                        {routeNodeNames.join(" → ")}
                                    </p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-2">
                                        Assign to Operator
                                    </label>
                                    <select
                                        className="w-full h-12 px-4 rounded-xl border-2 border-slate-200 bg-white hover:border-slate-300 focus:border-emerald-500 focus:outline-none transition-colors mb-3"
                                        value={selectedOperator}
                                        onChange={(e) =>
                                            setSelectedOperator(e.target.value)
                                        }
                                    >
                                        <option value="">
                                            Select operator
                                        </option>
                                        {operators.map((op) => (
                                            <option key={op._id} value={op._id}>
                                                {op.name} ({op.email})
                                            </option>
                                        ))}
                                    </select>
                                    <Button
                                        onClick={onAssignRoute}
                                        loading={isAssigning}
                                        size="lg"
                                        className="w-full"
                                    >
                                        {isAssigning
                                            ? "Assigning..."
                                            : "Assign Route"}
                                        <UserCheck className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full h-64 rounded-2xl bg-gray-100 flex items-center justify-center">
                                <div className="text-center">
                                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                    <p className="text-gray-600">
                                        No route computed yet
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Select nodes and compute
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="col-span-1 lg:col-span-1">
                        <label className="text-sm font-medium text-gray-700 block mb-2">
                            Map Preview
                        </label>
                        <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm h-96">
                            <MapView
                                nodes={nodes.map((n) => n.coordinates)}
                                path={routePath}
                            />
                        </div>
                    </div>
                </div>
            </Card>

            {/* Existing Routes */}
            <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center">
                        <RouteIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900">
                            Assigned Routes
                        </h2>
                        <p className="text-sm text-slate-600">
                            All routes assigned to operators
                        </p>
                    </div>
                </div>

                {loadingRoutes ? (
                    <div className="h-40 flex items-center justify-center text-gray-500">
                        Loading routes...
                    </div>
                ) : routes.length === 0 ? (
                    <div className="h-40 flex items-center justify-center text-gray-500">
                        No routes assigned yet. Create and assign routes above.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                        Operator
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                        Route Path
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                        Distance
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                        Status
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                        Created
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {routes.map((route, idx) => (
                                    <tr
                                        key={route._id}
                                        className={`border-b border-gray-100 ${
                                            idx % 2 === 0 ? "bg-gray-50/50" : ""
                                        }`}
                                    >
                                        <td className="py-3 px-4 text-sm text-gray-900 font-medium">
                                            {route.assignedTo?.name ||
                                                "Unknown"}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-600">
                                            {route.nodes
                                                .map((n) => n.name)
                                                .join(" → ")}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-600">
                                            {route.totalDistance.toFixed(2)} km
                                        </td>
                                        <td className="py-3 px-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    route.status === "completed"
                                                        ? "bg-green-100 text-green-700"
                                                        : route.status ===
                                                          "active"
                                                        ? "bg-blue-100 text-blue-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                }`}
                                            >
                                                {route.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-xs text-gray-500">
                                            {new Date(
                                                route.createdAt
                                            ).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-4 text-sm text-gray-600">
                            Total:{" "}
                            <span className="font-semibold text-gray-900">
                                {routes.length}
                            </span>{" "}
                            routes
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}
