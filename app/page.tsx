"use client";
import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/Footer";
import Link from "next/link";
import Button from "../components/ui/Button";
import DynamicMap from "../components/maps/DynamicMap";
import {
    Route,
    MapPin,
    Truck,
    TrendingUp,
    Clock,
    ArrowRight,
    CheckCircle,
    History,
    Fuel,
    TreeDeciduous,
    Sparkles,
    Zap,
    Shield,
    BarChart3,
} from "lucide-react";

export default function ModernWasteLanding() {
    const features = [
        {
            icon: Zap,
            title: "Dijkstra-Optimized Routing",
            description:
                "Shortest paths computed for Port Harcourt's collection network in real time.",
        },
        {
            icon: MapPin,
            title: "GIS + Live Map",
            description:
                "Leaflet-based map to visualize routes, bins and depots interactively.",
        },
        {
            icon: BarChart3,
            title: "Weather & Reports Aware",
            description:
                "Weights adapt based on rainfall and citizen reports (floods, road blocks).",
        },
        {
            icon: Shield,
            title: "Multi‑role Access",
            description:
                "Admin, Operators and Citizens with secure role-based permissions.",
        },
    ];

    const stats = [
        { value: "40%", label: "Avg. Cost Reduction", suffix: "" },
        { value: "2.4k", label: "Hours Saved", suffix: "+" },
        { value: "500", label: "Collection Points", suffix: "+" },
        { value: "50", label: "Active Operators", suffix: "+" },
    ];

    const benefits = [
        {
            icon: History,
            title: "Route Efficiency",
            desc: "Minimize travel time with intelligent path optimization",
        },
        {
            icon: Fuel,
            title: "Fuel Savings",
            desc: "Cut fuel costs by up to 35% with smarter routes",
        },
        {
            icon: TreeDeciduous,
            title: "Lower Emissions",
            desc: "Reduce carbon footprint and environmental impact",
        },
        {
            icon: Clock,
            title: "Time Optimization",
            desc: "Complete more collections in less time",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
            {/* Navbar */}
            <Navbar />

            {/* Hero Section */}
            <motion.section
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="pt-24 pb-20 px-4 sm:px-6 lg:px-8"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full mb-8">
                            <Sparkles className="w-4 h-4 text-emerald-600" />
                            <span className="text-sm font-medium text-emerald-700">
                                Digitized Waste Management
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                            <span className="bg-gradient-to-r from-slate-900 via-emerald-800 to-teal-800 bg-clip-text text-transparent">
                                Port Harcourt,
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                Optimized Waste Routes
                            </span>
                        </h1>

                        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                            An urban waste management system for the city of
                            Port Harcourt. Powered by Dijkstra’s algorithm, GIS
                            mapping, and adaptive weights from weather and
                            citizen reports.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link href="/signup" className="inline-block">
                                <Button size="lg" className="px-8 py-4">
                                    Get Started
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                            <Link href="/signin" className="inline-block">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="px-8 py-4"
                                >
                                    Log in
                                </Button>
                            </Link>
                        </div>

                        {/* Stats Bar */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 pt-12 border-t border-slate-200">
                            {stats.map((stat, i) => (
                                <div key={i} className="text-center">
                                    <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-1">
                                        {stat.value}
                                        {stat.suffix}
                                    </div>
                                    <div className="text-sm text-slate-600 font-medium">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Features Grid */}
            <motion.section
                id="features"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="py-20 px-4 sm:px-6 lg:px-8 bg-white"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                            Built for Port Harcourt
                        </h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            End-to-end route planning, visualization and
                            analytics for city-scale operations.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 12 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05, duration: 0.4 }}
                                className="group p-8 bg-gradient-to-b from-slate-50 to-white rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 cursor-pointer"
                            >
                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* How It Works */}
            <motion.section
                id="how-it-works"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                            How It Works
                        </h2>
                        <p className="text-xl text-slate-600">
                            Simple, powerful, effective
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 relative">
                        {/* Connection Lines */}
                        <div className="hidden md:block absolute top-1/4 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-200 via-emerald-400 to-teal-400 -z-10" />

                        {[
                            {
                                icon: MapPin,
                                title: "Citizen + Sensor Inputs",
                                desc: "Reports (full bins, road blocks) and weather feed into the graph",
                                color: "from-emerald-500 to-teal-600",
                            },
                            {
                                icon: Route,
                                title: "Dijkstra’s Optimization",
                                desc: "Shortest paths computed using adaptive edge weights",
                                color: "from-emerald-500 to-teal-600",
                            },
                            {
                                icon: Truck,
                                title: "Smart Dispatch",
                                desc: "Operators receive routes and update status in real time",
                                color: "from-teal-500 to-teal-600",
                            },
                        ].map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 14 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.06, duration: 0.45 }}
                                className="relative"
                            >
                                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100">
                                    <div
                                        className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mb-6 mx-auto`}
                                    >
                                        <step.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="text-center">
                                        <div className="text-sm font-bold text-emerald-600 mb-2">
                                            STEP {i + 1}
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900 mb-3">
                                            {step.title}
                                        </h3>
                                        <p className="text-slate-600">
                                            {step.desc}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Live Routing Demo (Interactive Map) */}
            <motion.section
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-emerald-50 to-white"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                            Live Routing Demo
                        </h2>
                        <p className="text-lg text-slate-600">
                            A simple example over Port Harcourt using sample
                            nodes and a computed path.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-5 gap-8 items-start">
                        <div className="lg:col-span-3">
                            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                                <DynamicMap
                                    nodes={[
                                        [4.7842, 7.0337],
                                        [4.7865, 7.034],
                                        [4.788, 7.037],
                                        [4.79, 7.039],
                                    ]}
                                    path={[
                                        [4.7842, 7.0337],
                                        [4.7865, 7.034],
                                        [4.788, 7.037],
                                    ]}
                                    height={420}
                                />
                            </div>
                        </div>
                        <div className="lg:col-span-2">
                            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                                    What you’re seeing
                                </h3>
                                <ul className="space-y-3 text-slate-700 text-sm">
                                    <li>
                                        • Emerald pins represent collection
                                        points (nodes).
                                    </li>
                                    <li>
                                        • Blue pins and line show the computed
                                        shortest route.
                                    </li>
                                    <li>
                                        • Start (green circle) and End (red
                                        circle) highlight endpoints.
                                    </li>
                                </ul>
                                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <Link href="/signup">
                                        <Button size="lg" className="w-full">
                                            Get Started
                                        </Button>
                                    </Link>
                                    <Link href="/signin">
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            className="w-full"
                                        >
                                            Log in
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Benefits Section */}
            <motion.section
                id="benefits"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="py-20 px-4 sm:px-6 lg:px-8 bg-white"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                                Measurable Impact, Real Results
                            </h2>
                            <p className="text-xl text-slate-600 mb-8">
                                Join forward-thinking cities already
                                transforming their waste management operations.
                            </p>

                            <div className="space-y-4">
                                {benefits.map((benefit, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 8 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            delay: i * 0.05,
                                            duration: 0.35,
                                        }}
                                        className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
                                    >
                                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                            <benefit.icon className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 mb-1">
                                                {benefit.title}
                                            </h3>
                                            <p className="text-sm text-slate-600">
                                                {benefit.desc}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="aspect-square rounded-3xl bg-gradient-to-br from-emerald-100 via-teal-50 to-blue-100 p-8 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-32 h-32 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-6">
                                        <TrendingUp className="w-16 h-16 text-emerald-600" />
                                    </div>
                                    <div className="text-5xl font-bold text-slate-900 mb-2">
                                        40%
                                    </div>
                                    <div className="text-lg text-slate-600 font-medium">
                                        Average Cost Reduction
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl opacity-20 blur-2xl" />
                            <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl opacity-20 blur-2xl" />
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* CTA Section */}
            <motion.section
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900 relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzEwYjk4MSIgc3Ryb2tlLXdpZHRoPSIyIiBvcGFjaXR5PSIuMSIvPjwvZz48L3N2Zz4=')] opacity-10" />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Ready to Optimize Your Operations?
                    </h2>
                    <p className="text-xl text-emerald-100 mb-10 max-w-2xl mx-auto">
                        Join leading cities worldwide. Start your free trial
                        today—no credit card required.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link href="/signup" className="inline-block">
                            <Button
                                size="lg"
                                className="px-10 py-5 bg-white text-slate-900"
                            >
                                Get Started
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                        <Link href="/signin" className="inline-block">
                            <Button
                                variant="outline"
                                size="lg"
                                className="px-10 py-5 border-white/50 text-white hover:bg-white/10 hover:text-white"
                            >
                                Log in
                            </Button>
                        </Link>
                    </div>

                    <div className="mt-12 flex items-center justify-center gap-8 text-sm text-emerald-100">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            <span>Easy setup</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            <span>No credit card required</span>
                        </div>
                    </div>
                </div>
            </motion.section>
            {/* Footer Component */}
            <Footer />
        </div>
    );
}
