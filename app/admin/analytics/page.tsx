"use client";
import { useEffect, useState } from "react";
import Card from "../../../components/ui/Card";
import {
    MapPin,
    TrendingUp,
    CheckCircle,
    BarChart2,
    Database,
    Network,
} from "lucide-react";

type AnalyticsData = {
    totalRoutes: number;
    averageDistance: number;
    top5: Array<{ totalDistance: number }>;
    completedLastWeek: number;
    pending: number;
};

type Node = {
    _id: string;
    name: string;
    coordinates: [number, number];
};

type Edge = {
    _id: string;
    fromNode: any;
    toNode: any;
    weight: number;
};

export default function AdminAnalyticsPage() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [loading, setLoading] = useState(true);
    const [graphLoading, setGraphLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/admin/analytics");
                const json = await res.json();
                if (json?.success) setData(json.data || null);
            } catch (e) {
                // swallow for now
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/admin/graph");
                const json = await res.json();
                if (json?.nodes) setNodes(json.nodes);
                if (json?.edges) setEdges(json.edges);
            } catch (e) {
                console.error("Failed to fetch graph data:", e);
            } finally {
                setGraphLoading(false);
            }
        })();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/50 p-6 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold gradient-text-primary">
                        Analytics
                    </h1>
                    <p className="text-gray-600 mt-1">
                        System performance and route statistics
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <Card className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">
                                Total Routes
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {loading ? "—" : data?.totalRoutes ?? 0}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                            <MapPin className="w-6 h-6 text-emerald-600" />
                        </div>
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">
                                Average Distance (km)
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {loading
                                    ? "—"
                                    : (data?.averageDistance ?? 0).toFixed(2)}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">
                                Completed (7d)
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {loading ? "—" : data?.completedLastWeek ?? 0}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Pending</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {loading ? "—" : data?.pending ?? 0}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                            <BarChart2 className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </Card>
            </div>

            <Card className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Top Routes by Distance
                </h2>
                {loading ? (
                    <div className="h-40 flex items-center justify-center text-gray-500">
                        Loading...
                    </div>
                ) : !data || !data.top5?.length ? (
                    <div className="h-40 flex items-center justify-center text-gray-500">
                        No data available
                    </div>
                ) : (
                    <div className="space-y-3">
                        {data.top5.map((r, i) => {
                            const max = data.top5[0]?.totalDistance || 1;
                            const pct = Math.min(
                                100,
                                Math.round((r.totalDistance / max) * 100)
                            );
                            return (
                                <div
                                    key={i}
                                    className="flex items-center gap-4"
                                >
                                    <div className="w-8 text-sm font-medium text-gray-700">
                                        #{i + 1}
                                    </div>
                                    <div className="flex-1">
                                        <div className="bg-gray-100 h-3 rounded overflow-hidden">
                                            <div
                                                style={{ width: `${pct}%` }}
                                                className="h-3 bg-emerald-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="w-24 text-right text-sm font-medium text-gray-800">
                                        {r.totalDistance.toFixed(2)} km
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </Card>

            {/* Nodes Table */}
            <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                        <Database className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Collection Nodes
                        </h2>
                        <p className="text-sm text-gray-600">
                            All registered collection points in the system
                        </p>
                    </div>
                </div>

                {graphLoading ? (
                    <div className="h-40 flex items-center justify-center text-gray-500">
                        Loading nodes...
                    </div>
                ) : nodes.length === 0 ? (
                    <div className="h-40 flex items-center justify-center text-gray-500">
                        No nodes found. Upload network data to see nodes here.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                        Node Name
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                        Latitude
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                        Longitude
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                        ID
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {nodes.map((node, idx) => (
                                    <tr
                                        key={node._id}
                                        className={`border-b border-gray-100 ${
                                            idx % 2 === 0 ? "bg-gray-50/50" : ""
                                        }`}
                                    >
                                        <td className="py-3 px-4 text-sm text-gray-900 font-medium">
                                            {node.name}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-600">
                                            {node.coordinates[0].toFixed(6)}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-600">
                                            {node.coordinates[1].toFixed(6)}
                                        </td>
                                        <td className="py-3 px-4 text-xs text-gray-500 font-mono">
                                            {node._id}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-4 text-sm text-gray-600">
                            Total:{" "}
                            <span className="font-semibold text-gray-900">
                                {nodes.length}
                            </span>{" "}
                            nodes
                        </div>
                    </div>
                )}
            </Card>

            {/* Edges/Connections Table */}
            <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <Network className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Route Connections
                        </h2>
                        <p className="text-sm text-gray-600">
                            All registered connections between nodes
                        </p>
                    </div>
                </div>

                {graphLoading ? (
                    <div className="h-40 flex items-center justify-center text-gray-500">
                        Loading connections...
                    </div>
                ) : edges.length === 0 ? (
                    <div className="h-40 flex items-center justify-center text-gray-500">
                        No connections found. Upload network data to see
                        connections here.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                        From Node
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                        To Node
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                        Weight (km)
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                        ID
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {edges.map((edge, idx) => (
                                    <tr
                                        key={edge._id}
                                        className={`border-b border-gray-100 ${
                                            idx % 2 === 0 ? "bg-gray-50/50" : ""
                                        }`}
                                    >
                                        <td className="py-3 px-4 text-sm text-gray-900 font-medium">
                                            {edge.fromNode?.name ||
                                                edge.fromNode}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-900 font-medium">
                                            {edge.toNode?.name || edge.toNode}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-600">
                                            {edge.weight.toFixed(2)}
                                        </td>
                                        <td className="py-3 px-4 text-xs text-gray-500 font-mono">
                                            {edge._id}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-4 text-sm text-gray-600">
                            Total:{" "}
                            <span className="font-semibold text-gray-900">
                                {edges.length}
                            </span>{" "}
                            connections
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}
