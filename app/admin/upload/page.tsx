"use client";
import { useState, useEffect } from "react";
import {
    Plus,
    MapPin,
    Network,
    CheckCircle,
    Eye,
    Database,
} from "lucide-react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import NodeForm from "../../../components/forms/NodeForm";
import MapView from "../../../components/maps/DynamicMap";
import toast from "react-hot-toast";
import { useGraphStore } from "../../../lib/store";

type NetworkData = {
    nodes: Array<{ name: string; coordinates: [number, number] }>;
    edges: Array<{ from: string; to: string; weight: number }>;
};

type NodeDoc = {
    _id: string;
    name: string;
    coordinates: [number, number];
};

export default function UploadPage() {
    const [summary, setSummary] = useState<{
        nodes: number;
        edges: number;
    } | null>(null);
    const [coords, setCoords] = useState<[number, number][]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [existingNodes, setExistingNodes] = useState<NodeDoc[]>([]);
    const { setUploadedGraph, uploadedNodes, uploadedEdges } = useGraphStore();

    // Fetch existing nodes from database
    useEffect(() => {
        const fetchExistingNodes = async () => {
            try {
                const res = await fetch("/api/admin/graph");
                const data = await res.json();
                setExistingNodes(data.nodes || []);
            } catch (e) {
                console.error("Failed to fetch existing nodes:", e);
            }
        };
        fetchExistingNodes();
    }, []);

    const handleFormSubmit = (data: NetworkData) => {
        const nodes = data.nodes || [];
        const edges = data.edges || [];

        setSummary({ nodes: nodes.length, edges: edges.length });
        setCoords(nodes.map((n) => n.coordinates));
        setUploadedGraph(
            nodes,
            edges.map((e) => ({ from: e.from, to: e.to, weight: e.weight }))
        );

        setShowModal(false);
        toast.success(
            `Successfully added ${nodes.length} nodes and ${edges.length} edges`
        );
    };

    const onUpload = async () => {
        if (!uploadedNodes.length) {
            toast.error("Please add nodes first");
            return;
        }

        setIsUploading(true);
        try {
            const res = await fetch("/api/admin/upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nodes: uploadedNodes,
                    edges: uploadedEdges,
                }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json?.error || "Upload failed");
            toast.success("Successfully uploaded to database");

            // Reset after successful upload
            setSummary(null);
            setCoords([]);
        } catch (e: any) {
            toast.error(e?.message || "Upload failed");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/50 p-6 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        Manage Road Network
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Create and manage nodes and edges data for route
                        optimization
                    </p>
                </div>
            </div>

            {/* Create Network Section */}
            <Card className="p-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                            <Plus className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Create Network
                            </h2>
                            <p className="text-gray-600 text-sm">
                                Add collection points and route connections
                            </p>
                        </div>
                    </div>
                    <Button onClick={() => setShowModal(true)} size="lg">
                        <Plus className="w-4 h-4" />
                        Add Nodes & Connections
                    </Button>
                </div>

                {!summary && (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <MapPin className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No Network Data
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Start by creating collection points and route
                            connections for your waste management system.
                        </p>
                        <Button
                            onClick={() => setShowModal(true)}
                            variant="outline"
                        >
                            <Plus className="w-4 h-4" />
                            Create Your First Network
                        </Button>
                    </div>
                )}
            </Card>

            {/* Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Create Road Network"
                size="xl"
            >
                <NodeForm
                    onSubmit={handleFormSubmit}
                    onCancel={() => setShowModal(false)}
                    existingNodes={existingNodes}
                />
            </Modal>

            {/* Summary Cards */}
            {summary && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">
                                    Nodes Detected
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {summary.nodes}
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
                                    Edges Detected
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {summary.edges}
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                                <Network className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Status</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    <span className="text-lg font-semibold text-green-700">
                                        Ready
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* Actions */}
            {summary && (
                <Card className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                            <Database className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Database Upload
                            </h2>
                            <p className="text-gray-600 text-sm">
                                Save the processed data to the database
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button
                            onClick={onUpload}
                            loading={isUploading}
                            size="lg"
                            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                        >
                            <Database className="w-4 h-4" />
                            {isUploading
                                ? "Uploading..."
                                : "Upload to Database"}
                        </Button>

                        <div className="text-sm text-gray-600">
                            This will save {summary.nodes} nodes and{" "}
                            {summary.edges} edges to the database
                        </div>
                    </div>
                </Card>
            )}

            {/* Map Preview */}
            {coords.length > 0 && (
                <Card className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                            <Eye className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Network Preview
                            </h2>
                            <p className="text-gray-600 text-sm">
                                Visual representation of your uploaded network
                            </p>
                        </div>
                    </div>
                    <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                        <MapView nodes={coords} />
                    </div>
                </Card>
            )}
        </div>
    );
}
