"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
    FileText,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Filter,
    MapPin,
} from "lucide-react";
import Card from "../../../components/ui/Card";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import DataTable from "../../../components/ui/DataTable";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

type Report = {
    _id: string;
    type: string;
    description: string;
    location?: string;
    coordinates?: { latitude: number; longitude: number };
    status: string;
    priority: string;
    createdAt: string;
    resolvedAt?: string;
};

export default function ReportsPage() {
    const { data: session } = useSession();
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>("all");

    useEffect(() => {
        fetchReports();
    }, [session]);

    const fetchReports = async () => {
        try {
            const citizenId = (session as any)?.user?.id;
            if (!citizenId) return;

            const res = await fetch(`/api/reports?citizenId=${citizenId}`);
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

    const filteredReports =
        filterStatus === "all"
            ? reports
            : reports.filter((r) => r.status === filterStatus);

    const getStatusBadge = (status: string) => {
        const badges = {
            pending: {
                bg: "bg-orange-100",
                text: "text-orange-700",
                icon: Clock,
            },
            reviewing: {
                bg: "bg-blue-100",
                text: "text-blue-700",
                icon: AlertCircle,
            },
            resolved: {
                bg: "bg-green-100",
                text: "text-green-700",
                icon: CheckCircle,
            },
            rejected: { bg: "bg-red-100", text: "text-red-700", icon: XCircle },
        };

        const badge = badges[status as keyof typeof badges] || badges.pending;
        return (
            <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}
            >
                <badge.icon className="w-3 h-3" />
                {status}
            </span>
        );
    };

    const getPriorityBadge = (priority: string) => {
        const colors = {
            low: "bg-gray-100 text-gray-700",
            medium: "bg-blue-100 text-blue-700",
            high: "bg-orange-100 text-orange-700",
            urgent: "bg-red-100 text-red-700",
        };

        return (
            <span
                className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                    colors[priority as keyof typeof colors] || colors.medium
                }`}
            >
                {priority}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-white to-pink-50/50 flex items-center justify-center p-6">
                <LoadingSpinner size="lg" text="Loading your reports..." />
            </div>
        );
    }

    const columns = [
        {
            header: "Type",
            accessor: (row: Report) => (
                <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-purple-600" />
                    <span className="font-medium">{row.type}</span>
                </div>
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
            accessor: (row: Report) => getPriorityBadge(row.priority),
        },
        {
            header: "Status",
            accessor: (row: Report) => getStatusBadge(row.status),
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
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-white to-pink-50/50 p-6 space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        My Reports
                    </h1>
                    <p className="text-gray-600 mt-1">
                        View and track all your submitted reports
                    </p>
                </div>

                {/* Filter */}
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-600" />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="reviewing">Reviewing</option>
                        <option value="resolved">Resolved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </motion.div>

            {/* Reports Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Card className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                All Reports
                            </h2>
                            <p className="text-sm text-gray-600">
                                Total: {filteredReports.length} reports
                            </p>
                        </div>
                    </div>

                    <DataTable
                        data={filteredReports}
                        columns={columns}
                        emptyMessage="No reports found. Submit your first report to get started!"
                    />
                </Card>
            </motion.div>
        </div>
    );
}
