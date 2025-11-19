"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
    AlertCircle,
    CheckCircle,
    Clock,
    FileText,
    TrendingUp,
    XCircle,
} from "lucide-react";
import Card from "../../../components/ui/Card";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

type Report = {
    _id: string;
    type: string;
    description: string;
    status: string;
    priority: string;
    createdAt: string;
};

type Stats = {
    total: number;
    pending: number;
    reviewing: number;
    resolved: number;
    rejected: number;
};

export default function CitizenDashboard() {
    const { data: session } = useSession();
    const [reports, setReports] = useState<Report[]>([]);
    const [stats, setStats] = useState<Stats>({
        total: 0,
        pending: 0,
        reviewing: 0,
        resolved: 0,
        rejected: 0,
    });
    const [loading, setLoading] = useState(true);

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
                calculateStats(data.reports);
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

    const calculateStats = (reports: Report[]) => {
        const stats = {
            total: reports.length,
            pending: reports.filter((r) => r.status === "pending").length,
            reviewing: reports.filter((r) => r.status === "reviewing").length,
            resolved: reports.filter((r) => r.status === "resolved").length,
            rejected: reports.filter((r) => r.status === "rejected").length,
        };
        setStats(stats);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <LoadingSpinner size="lg" text="Loading your dashboard..." />
            </div>
        );
    }

    const statusCards = [
        {
            title: "Total Reports",
            value: stats.total,
            icon: FileText,
            bgColor: "bg-emerald-100",
            textColor: "text-emerald-600",
        },
        {
            title: "Pending",
            value: stats.pending,
            icon: Clock,
            bgColor: "bg-orange-100",
            textColor: "text-orange-600",
        },
        {
            title: "Under Review",
            value: stats.reviewing,
            icon: TrendingUp,
            bgColor: "bg-blue-100",
            textColor: "text-blue-600",
        },
        {
            title: "Resolved",
            value: stats.resolved,
            icon: CheckCircle,
            bgColor: "bg-green-100",
            textColor: "text-green-600",
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 p-6 space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Welcome Back!
                    </h1>
                    <p className="text-slate-600 mt-1">
                        Track your reports and help keep our city clean
                    </p>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Clock className="w-4 h-4" />
                    <span suppressHydrationWarning>
                        {new Date().toLocaleDateString()}
                    </span>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statusCards.map((card, index) => (
                    <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-600">
                                        {card.title}
                                    </p>
                                    <p className="text-3xl font-bold text-slate-900 mt-2">
                                        {card.value}
                                    </p>
                                </div>
                                <div
                                    className={`w-14 h-14 rounded-xl ${card.bgColor} flex items-center justify-center`}
                                >
                                    <card.icon
                                        className={`w-7 h-7 ${card.textColor}`}
                                    />
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Recent Reports */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Card className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-slate-900">
                                Recent Reports
                            </h2>
                            <p className="text-sm text-slate-600">
                                Your latest 5 submissions
                            </p>
                        </div>
                    </div>

                    {reports.length === 0 ? (
                        <div className="text-center py-12">
                            <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                No Reports Yet
                            </h3>
                            <p className="text-slate-600">
                                You haven't submitted any reports. Help us
                                improve your community!
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {reports.slice(0, 5).map((report) => (
                                <div
                                    key={report._id}
                                    className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-emerald-200 hover:bg-emerald-50/50 transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`w-10 h-10 rounded-lg ${
                                                report.status === "resolved"
                                                    ? "bg-green-100"
                                                    : report.status ===
                                                      "reviewing"
                                                    ? "bg-blue-100"
                                                    : report.status ===
                                                      "rejected"
                                                    ? "bg-red-100"
                                                    : "bg-orange-100"
                                            } flex items-center justify-center`}
                                        >
                                            {report.status === "resolved" ? (
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                            ) : report.status ===
                                              "reviewing" ? (
                                                <TrendingUp className="w-5 h-5 text-blue-600" />
                                            ) : report.status === "rejected" ? (
                                                <XCircle className="w-5 h-5 text-red-600" />
                                            ) : (
                                                <Clock className="w-5 h-5 text-orange-600" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900">
                                                {report.type}
                                            </h3>
                                            <p className="text-sm text-gray-600 line-clamp-1">
                                                {report.description}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                report.status === "resolved"
                                                    ? "bg-green-100 text-green-700"
                                                    : report.status ===
                                                      "reviewing"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : report.status ===
                                                      "rejected"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-orange-100 text-orange-700"
                                            }`}
                                        >
                                            {report.status}
                                        </span>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {new Date(
                                                report.createdAt
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </motion.div>
        </div>
    );
}
