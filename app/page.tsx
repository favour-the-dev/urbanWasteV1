"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Trash2,
    Route,
    MapPin,
    Users,
    Truck,
    TrendingUp,
    Clock,
    ArrowRight,
    CheckCircle,
    Fingerprint,
    History,
    Fuel,
    TreeDeciduous,
} from "lucide-react";
import Navbar from "../components/ui/Navbar";
import Button from "../components/ui/Button";
import DynamicMap from "@/components/maps/DynamicMap";
import Card from "../components/ui/Card";

// Animation variants
const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6 },
    },
};

const fadeIn = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: { duration: 0.8 },
    },
};

const staggerContainer = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.1,
        },
    },
};

const scaleIn = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5 },
    },
};

const cardHover = {
    initial: { scale: 1, y: 0 },
    hover: {
        scale: 1.05,
        y: -8,
        transition: { duration: 0.3 },
    },
};

const slideInLeft = {
    initial: { opacity: 0, x: -60 },
    animate: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6 },
    },
};

const slideInRight = {
    initial: { opacity: 0, x: 60 },
    animate: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6 },
    },
};
const features = [
    {
        icon: Route,
        title: "Route Optimization",
        description:
            "Dijkstra's algorithm finds the most efficient path for collections.",
    },
    {
        icon: MapPin,
        title: "Real-time Monitoring",
        description:
            "Live bin statuses and vehicle tracking for confident dispatch decisions.",
    },
    {
        icon: Users,
        title: "Operator Tools",
        description:
            "Easy-to-use operator UI for assignment and completed route reports.",
    },
    {
        icon: TrendingUp,
        title: "Analytics",
        description:
            " actionable insights to reduce cost and environmental impact.",
    },
];

const stats = [
    { label: "Collection Points", value: "500+", icon: MapPin },
    { label: "Routes Optimized", value: "1,200+", icon: Route },
    { label: "Hours Saved", value: "2,400+", icon: Clock },
    { label: "Operators", value: "50+", icon: Users },
];

export default function Home() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated") {
            const role = (session as any)?.user?.role;
            if (role === "admin") router.push("/admin/dashboard");
            else if (role === "operator") router.push("/operator/dashboard");
        }
    }, [session, status, router]);

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-50 via-teal-50 to-blue-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-dark dark:text-text-light transition-colors duration-300">
            <Navbar />

            <main className="flex-grow">
                {/* Hero / Masthead */}
                <section className="relative text-center py-20 sm:py-28 lg:py-36">
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-10 dark:opacity-20"
                        style={{
                            backgroundImage:
                                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAERDk4gX4LFR44a5H9zxRlZ8gr-kaARaaiq9cPHzr91_OAPfL1Xad_YZqK_eQ77yF7SiKgSFrniQrHCau7VUuvQnV_RRPCcraIwiVLnVGX8CFT835NytLkArjuNruORWhk8QyZXj9NR4vQxz8IKdAHwk1LOuWC2yUHVtlqkDgl8CGnpH6gDfXpDGiVV1hPwuFuCOW4dccN43Dq0bWUrrSlKSkcRHYn9AcuRgBtSoC6OM_YHES-ZRYOPP7pD4rVHBlExUGsvKWsx7Jw')",
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-background-light via-transparent to-background-light dark:from-background-dark dark:via-transparent dark:to-background-dark" />

                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-text-dark dark:text-text-light">
                            Smarter Waste Collection with Dijkstra’s Algorithm
                        </h1>
                        <p className="mt-6 max-w-2xl mx-auto text-lg text-text-muted-light dark:text-text-muted-dark">
                            Optimizing urban waste management for a cleaner,
                            greener future. We leverage advanced algorithms to
                            create efficient routes, reducing fuel costs and
                            environmental impact.
                        </p>

                        <div className="mt-10 flex justify-center gap-4">
                            <Link href="/signup">
                                <Button size="lg" className="px-8 py-3">
                                    Explore the System
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* How it works */}
                <section
                    className="py-16 sm:py-24 bg-white dark:bg-gray-800"
                    id="how-it-works"
                >
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            variants={fadeInUp}
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <h2 className="text-3xl font-bold tracking-tight text-text-dark dark:text-text-light sm:text-4xl">
                                How It Works
                            </h2>
                            <p className="mt-4 max-w-2xl mx-auto text-lg text-text-muted-light dark:text-text-muted-dark">
                                A simple, data-driven process for intelligent
                                waste collection.
                            </p>
                        </motion.div>

                        <motion.div
                            variants={staggerContainer}
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            className="mt-12 grid md:grid-cols-3 gap-8 text-center"
                        >
                            <motion.div
                                variants={scaleIn}
                                className="flex flex-col items-center"
                            >
                                <div className="flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 text-primary">
                                    <span className="material-symbols-outlined text-4xl">
                                        <Fingerprint className="w-8 h-8" />
                                    </span>
                                </div>
                                <h3 className="mt-5 text-xl font-medium text-text-dark dark:text-text-light">
                                    1. Data Collection
                                </h3>
                                <p className="mt-2 text-base text-text-muted-light dark:text-text-muted-dark">
                                    Smart sensors on bins report fill levels in
                                    real-time.
                                </p>
                            </motion.div>

                            <motion.div
                                variants={scaleIn}
                                className="flex flex-col items-center"
                            >
                                <div className="flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 text-primary">
                                    <span className="material-symbols-outlined text-4xl">
                                        <Route className="w-8 h-8" />
                                    </span>
                                </div>
                                <h3 className="mt-5 text-xl font-medium text-text-dark dark:text-text-light">
                                    2. Route Optimization
                                </h3>
                                <p className="mt-2 text-base text-text-muted-light dark:text-text-muted-dark">
                                    Dijkstra's algorithm calculates the most
                                    efficient collection path.
                                </p>
                            </motion.div>

                            <motion.div
                                variants={scaleIn}
                                className="flex flex-col items-center"
                            >
                                <div className="flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 text-primary">
                                    <span className="material-symbols-outlined text-4xl">
                                        <Truck className="w-8 h-8" />
                                    </span>
                                </div>
                                <h3 className="mt-5 text-xl font-medium text-text-dark dark:text-text-light">
                                    3. Efficient Dispatch
                                </h3>
                                <p className="mt-2 text-base text-text-muted-light dark:text-text-muted-dark">
                                    Drivers receive optimized routes on their
                                    devices for collection.
                                </p>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            variants={fadeInUp}
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            className="mt-16"
                        >
                            <div className="aspect-[16/9] w-full overflow-hidden rounded-xl shadow-lg ring-1 ring-black/5">
                                <img
                                    alt="Illustration of the system's workflow"
                                    className="h-full w-full object-cover"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvJPVscFKZcqF5HG16swktxOdlBPgzCHq-72_OvqV4X9B0cnzIhX2IMrmutg1uzJHVKALe180dhDIQJxdNbwrqadG8QJorNaniEZiywCyFAlglGY0FhZwrAoiXWcUc3pjQV3c7V_u-p6BoH48_XVpZRq5xHpmQYUTliTQOVF0qeECjc1qAh1yuS8_uuV6B_ErdUPUiqyI9z-TRmadQjbF4JNGtO91iyHRhQU6KbSHNzf2w8sgd-6fAqKZezPZbScFOz2mIWQ1K8vDQ"
                                />
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Features */}
                <section className="py-16 sm:py-24" id="features">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            variants={fadeInUp}
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <h2 className="text-3xl font-bold tracking-tight text-text-dark dark:text-text-light sm:text-4xl">
                                Features & Benefits
                            </h2>
                            <p className="mt-4 max-w-2xl mx-auto text-lg text-text-muted-light dark:text-text-muted-dark">
                                Discover the advantages of our data-driven
                                approach.
                            </p>
                        </motion.div>

                        <motion.div
                            variants={staggerContainer}
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4"
                        >
                            <motion.div
                                variants={cardHover}
                                whileHover="hover"
                                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
                            >
                                <span className="material-symbols-outlined text-4xl text-primary">
                                    <History className="w-8 h-8" />
                                </span>
                                <h3 className="mt-4 text-xl font-bold text-text-dark dark:text-text-light">
                                    Route Efficiency
                                </h3>
                                <p className="mt-2 text-base text-text-muted-light dark:text-text-muted-dark">
                                    Minimize travel distance and time, servicing
                                    only the bins that need it.
                                </p>
                            </motion.div>

                            <motion.div
                                variants={cardHover}
                                whileHover="hover"
                                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
                            >
                                <span className="material-symbols-outlined text-4xl text-primary">
                                    <Fuel className="w-8 h-8" />
                                </span>
                                <h3 className="mt-4 text-xl font-bold text-text-dark dark:text-text-light">
                                    Reduced Fuel Costs
                                </h3>
                                <p className="mt-2 text-base text-text-muted-light dark:text-text-muted-dark">
                                    Shorter, smarter routes mean significant
                                    savings on fuel consumption.
                                </p>
                            </motion.div>

                            <motion.div
                                variants={cardHover}
                                whileHover="hover"
                                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
                            >
                                <span className="material-symbols-outlined text-4xl text-primary">
                                    <TreeDeciduous className="w-8 h-8" />
                                </span>
                                <h3 className="mt-4 text-xl font-bold text-text-dark dark:text-text-light">
                                    Environmental Impact
                                </h3>
                                <p className="mt-2 text-base text-text-muted-light dark:text-text-muted-dark">
                                    Lower carbon emissions and a smaller
                                    environmental footprint.
                                </p>
                            </motion.div>

                            <motion.div
                                variants={cardHover}
                                whileHover="hover"
                                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
                            >
                                <span className="material-symbols-outlined text-4xl text-primary">
                                    <MapPin className="W-8 H-8" />
                                </span>
                                <h3 className="mt-4 text-xl font-bold text-text-dark dark:text-text-light">
                                    Real-Time Monitoring
                                </h3>
                                <p className="mt-2 text-base text-text-muted-light dark:text-text-muted-dark">
                                    Live tracking of collection vehicles and bin
                                    statuses.
                                </p>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* Map preview */}
                <section
                    className="py-16 sm:py-24 bg-white dark:bg-gray-800"
                    id="map"
                >
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            variants={fadeInUp}
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <h2 className="text-3xl font-bold tracking-tight text-text-dark dark:text-text-light sm:text-4xl">
                                Explore the Optimization
                            </h2>
                            <p className="mt-4 max-w-2xl mx-auto text-lg text-text-muted-light dark:text-text-muted-dark">
                                Visualize the difference. See optimized routes
                                and real-time data on our interactive map.
                            </p>
                        </motion.div>
                        <motion.div
                            variants={fadeInUp}
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="mt-12"
                        >
                            <div className="w-full overflow-hidden rounded-xl shadow-lg ring-1 ring-black/5">
                                <DynamicMap
                                    nodes={[
                                        [4.8156, 7.0498], // Trans Amadi
                                        [4.7842, 7.0337], // Port Harcourt City Center
                                        [4.8044, 7.0469], // Rumuola
                                        [4.8267, 7.0133], // Eliozu
                                        [4.796, 7.0215], // D-Line
                                        [4.8156, 7.035], // GRA Phase 2
                                    ]}
                                    path={[
                                        [4.8156, 7.0498],
                                        [4.7842, 7.0337],
                                        [4.796, 7.0215],
                                        [4.8044, 7.0469],
                                        [4.8267, 7.0133],
                                        [4.8156, 7.035],
                                    ]}
                                    height={500}
                                />
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* CTA */}
                <section className="bg-primary/90" id="cta">
                    <motion.div
                        variants={fadeInUp}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="container mx-auto max-w-4xl py-16 px-4 sm:px-6 lg:py-24 lg:px-8 text-center"
                    >
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            <span className="block">
                                Ready to transform your waste management?
                            </span>
                        </h2>
                        <p className="mt-4 text-lg leading-6 text-indigo-100">
                            Join the cities making a smart, sustainable choice.
                            Get started with a demo today.
                        </p>
                        <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="mt-8 inline-flex w-auto items-center justify-center rounded-md border border-transparent bg-white px-6 py-3 text-base font-medium text-primary shadow-md hover:bg-gray-50"
                            href="/signup"
                        >
                            Get Started
                        </motion.a>
                    </motion.div>
                </section>
            </main>

            <footer className="bg-background-light dark:bg-background-dark border-t border-gray-200 dark:border-gray-700">
                <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-center space-x-6">
                        <a
                            className="text-text-muted-light hover:text-text-dark dark:text-text-muted-dark dark:hover:text-text-light"
                            href="#"
                        >
                            <span className="sr-only">Facebook</span>
                            <svg
                                aria-hidden="true"
                                className="h-6 w-6"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    clipRule="evenodd"
                                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                                    fillRule="evenodd"
                                ></path>
                            </svg>
                        </a>
                        <a
                            className="text-text-muted-light hover:text-text-dark dark:text-text-muted-dark dark:hover:text-text-light"
                            href="#"
                        >
                            <span className="sr-only">Twitter</span>
                            <svg
                                aria-hidden="true"
                                className="h-6 w-6"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                            </svg>
                        </a>
                        <a
                            className="text-text-muted-light hover:text-text-dark dark:text-text-muted-dark dark:hover:text-text-light"
                            href="#"
                        >
                            <span className="sr-only">LinkedIn</span>
                            <svg
                                aria-hidden="true"
                                className="h-6 w-6"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    clipRule="evenodd"
                                    d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zm-12 6v8h2.5v-4.5a1.5 1.5 0 0 1 3 0V17h2.5v-8h-2.5v1.25A2.75 2.75 0 0 0 12.25 9 2.75 2.75 0 0 0 9.5 11.75V9H7zm2-3.5A1.5 1.5 0 1 0 7.5 7 1.5 1.5 0 0 0 9 5.5z"
                                    fillRule="evenodd"
                                ></path>
                            </svg>
                        </a>
                    </div>
                    <div className="mt-8 text-center text-sm text-text-muted-light dark:text-text-muted-dark space-x-4">
                        <a className="hover:underline" href="#">
                            Privacy Policy
                        </a>
                        <span>•</span>
                        <a className="hover:underline" href="#">
                            Terms of Service
                        </a>
                        <span>•</span>
                        <a className="hover:underline" href="#">
                            Contact Us
                        </a>
                    </div>
                    <p className="mt-8 text-center text-sm text-text-muted-light dark:text-text-muted-dark">
                        © 2025 UrbanWaste. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
