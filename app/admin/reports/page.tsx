"use client";
import { useEffect, useState } from "react";
import {
    AlertCircle,
    CheckCircle,
    Clock,
    Filter,
    XCircle,
    Eye,
    MapPin,
} from "lucide-react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import DataTable from "../../../components/ui/DataTable";
import Modal from "../../../components/ui/Modal";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

type Report = {
    _id: string;
    citizenId: { name: string; email: string };
    type: string;
    description: string;
    location?: string;
    coordinates?: { latitude: number; longitude: number };
    status: string;
    priority: string;
    createdAt: string;
    adminNotes?: string;
};

export default function AdminReportsPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("all");
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [adminNotes, setAdminNotes] = useState("");

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const res = await fetch("/api/reports");
            const data = await res.json();
            if (data.success) {
                setReports(data.reports);
            } else {
                toast.error("Failed to load reports");
            }
        } catch (error) {
            console.error("Error fetching reports:", error);
            toast.error("Failed to load reports");
        } finally {
            setLoading(false);
        }
    };

    const updateReportStatus = async (
        reportId: string,
        newStatus: string,
        priority?: string
    ) => {
        setIsUpdating(true);
        try {
            const res = await fetch("/api/reports", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    reportId,
                    status: newStatus,
                    adminNotes: adminNotes || undefined,
                    priority: priority || undefined,
                }),
            });

            const data = await res.json();

            if (data.success) {
                toast.success(`Report ${newStatus} successfully`);
                fetchReports();
                setIsModalOpen(false);
                setAdminNotes("");
            } else {
                toast.error(data.error || "Failed to update report");
            }
        } catch (error) {
            console.error("Error updating report:", error);
            toast.error("Failed to update report");
        } finally {
            setIsUpdating(false);
        }
    };

    const viewReport = (report: Report) => {
        setSelectedReport(report);
        setAdminNotes(report.adminNotes || "");
        setIsModalOpen(true);
    };

    const filteredReports =
        filterStatus === "all"
            ? reports
            : reports.filter((r) => r.status === filterStatus);

    const stats = {
        total: reports.length,
        pending: reports.filter((r) => r.status === "pending").length,
        reviewing: reports.filter((r) => r.status === "reviewing").length,
        resolved: reports.filter((r) => r.status === "resolved").length,
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/50 flex items-center justify-center p-6">
                <LoadingSpinner size="lg" text="Loading reports..." />
            </div>
        );
    }

    const columns = [
        {
            header: "Citizen",
            accessor: (row: Report) => (
                <div>
                    <p className="font-medium text-gray-900">
                        {row.citizenId.name}
                    </p>
                    <p className="text-xs text-gray-500">
                        {row.citizenId.email}
                    </p>
                </div>
            ),
        },
        {
            header: "Type",
            accessor: (row: Report) => (
                <span className="inline-flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-emerald-600" />
                    {row.type}
                </span>
            ),
        },
        {
            header: "Description",
            accessor: (row: Report) => (
                <div className="max-w-md">
                    <p className="text-sm line-clamp-2">{row.description}</p>
                    {row.location && (
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {row.location}
                        </p>
                    )}
                </div>
            ),
        },
        {
            header: "Priority",
            accessor: (row: Report) => {
                const colors = {
                    low: "bg-gray-100 text-gray-700",
                    medium: "bg-blue-100 text-blue-700",
                    high: "bg-orange-100 text-orange-700",
                    urgent: "bg-red-100 text-red-700",
                };
                return (
                    <span
                        className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                            colors[row.priority as keyof typeof colors]
                        }`}
                    >
                        {row.priority}
                    </span>
                );
            },
        },
        {
            header: "Status",
            accessor: (row: Report) => {
                const badges = {
                    pending: { bg: "bg-orange-100", text: "text-orange-700" },
                    reviewing: { bg: "bg-blue-100", text: "text-blue-700" },
                    resolved: { bg: "bg-green-100", text: "text-green-700" },
                    rejected: { bg: "bg-red-100", text: "text-red-700" },
                };
                const badge =
                    badges[row.status as keyof typeof badges] || badges.pending;
                return (
                    <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}
                    >
                        {row.status}
                    </span>
                );
            },
        },
        {
            header: "Date",
            accessor: (row: Report) => (
                <div className="text-sm">
                    <p>{new Date(row.createdAt).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-500">
                        {new Date(row.createdAt).toLocaleTimeString()}
                    </p>
                </div>
            ),
        },
        {
            header: "Actions",
            accessor: (row: Report) => (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => viewReport(row)}
                >
                    <Eye className="w-4 h-4" />
                    View
                </Button>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/50 p-6 space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
                <div>
                    <h1 className="text-3xl font-bold gradient-text-primary">
                        Citizen Reports
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Review and manage citizen-submitted reports
                    </p>
                </div>

                {/* Filter */}
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-600" />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="reviewing">Reviewing</option>
                        <option value="resolved">Resolved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">
                                    Total Reports
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats.total}
                                </p>
                            </div>
                            <AlertCircle className="w-10 h-10 text-purple-600" />
                        </div>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Pending</p>
                                <p className="text-2xl font-bold text-orange-600">
                                    {stats.pending}
                                </p>
                            </div>
                            <Clock className="w-10 h-10 text-orange-600" />
                        </div>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">
                                    Under Review
                                </p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {stats.reviewing}
                                </p>
                            </div>
                            <Eye className="w-10 h-10 text-blue-600" />
                        </div>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">
                                    Resolved
                                </p>
                                <p className="text-2xl font-bold text-green-600">
                                    {stats.resolved}
                                </p>
                            </div>
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                    </Card>
                </motion.div>
            </div>

            {/* Reports Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Card className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                            <AlertCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                All Reports
                            </h2>
                            <p className="text-sm text-gray-600">
                                {filteredReports.length} reports
                            </p>
                        </div>
                    </div>

                    <DataTable
                        data={filteredReports}
                        columns={columns}
                        emptyMessage="No reports found"
                    />
                </Card>
            </motion.div>

            {/* Report Details Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Report Details"
            >
                {selectedReport && (
                    <div className="space-y-4">
                        {/* Citizen Info */}
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                                Submitted By
                            </h4>
                            <p className="font-medium text-gray-900">
                                {selectedReport.citizenId.name}
                            </p>
                            <p className="text-sm text-gray-600">
                                {selectedReport.citizenId.email}
                            </p>
                        </div>

                        {/* Report Info */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                                Type
                            </h4>
                            <p className="text-gray-900">
                                {selectedReport.type}
                            </p>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                                Description
                            </h4>
                            <p className="text-gray-900">
                                {selectedReport.description}
                            </p>
                        </div>

                        {selectedReport.location && (
                            <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">
                                    Location
                                </h4>
                                <p className="text-gray-900 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    {selectedReport.location}
                                </p>
                            </div>
                        )}

                        {selectedReport.coordinates && (
                            <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">
                                    GPS Coordinates
                                </h4>
                                <p className="text-sm text-gray-600">
                                    Lat:{" "}
                                    {selectedReport.coordinates.latitude.toFixed(
                                        6
                                    )}
                                    , Lon:{" "}
                                    {selectedReport.coordinates.longitude.toFixed(
                                        6
                                    )}
                                </p>
                            </div>
                        )}

                        {/* Admin Notes */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-2">
                                Admin Notes
                            </label>
                            <textarea
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none resize-none"
                                placeholder="Add notes about this report..."
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                            {selectedReport.status === "pending" && (
                                <Button
                                    onClick={() =>
                                        updateReportStatus(
                                            selectedReport._id,
                                            "reviewing"
                                        )
                                    }
                                    loading={isUpdating}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                                >
                                    <Eye className="w-4 h-4" />
                                    Mark as Reviewing
                                </Button>
                            )}

                            {(selectedReport.status === "pending" ||
                                selectedReport.status === "reviewing") && (
                                <>
                                    <Button
                                        onClick={() =>
                                            updateReportStatus(
                                                selectedReport._id,
                                                "resolved"
                                            )
                                        }
                                        loading={isUpdating}
                                        className="flex-1 bg-green-600 hover:bg-green-700"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        Resolve
                                    </Button>

                                    <Button
                                        onClick={() =>
                                            updateReportStatus(
                                                selectedReport._id,
                                                "rejected"
                                            )
                                        }
                                        loading={isUpdating}
                                        variant="outline"
                                        className="flex-1 text-red-600 hover:bg-red-50"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        Reject
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
