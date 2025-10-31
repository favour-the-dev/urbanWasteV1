"use client";
import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="grid md:grid-cols-4 gap-8 mb-8"
                >
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                                <Trash2 className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-bold text-white">
                                UrbanWaste
                            </span>
                        </div>
                        <p className="text-sm">
                            Smarter waste management for modern cities.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-3">
                            Product
                        </h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a
                                    href="#features"
                                    className="hover:text-emerald-400 transition-colors"
                                >
                                    Features
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#pricing"
                                    className="hover:text-emerald-400 transition-colors"
                                >
                                    Pricing
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#demo"
                                    className="hover:text-emerald-400 transition-colors"
                                >
                                    Demo
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-3">
                            Company
                        </h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a
                                    href="#about"
                                    className="hover:text-emerald-400 transition-colors"
                                >
                                    About
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#blog"
                                    className="hover:text-emerald-400 transition-colors"
                                >
                                    Blog
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#careers"
                                    className="hover:text-emerald-400 transition-colors"
                                >
                                    Careers
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-3">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a
                                    href="#privacy"
                                    className="hover:text-emerald-400 transition-colors"
                                >
                                    Privacy
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#terms"
                                    className="hover:text-emerald-400 transition-colors"
                                >
                                    Terms
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#contact"
                                    className="hover:text-emerald-400 transition-colors"
                                >
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="border-t border-slate-800 pt-8 text-center text-sm"
                >
                    <p>© 2025 UrbanWaste. All rights reserved.</p>
                </motion.div>
            </div>
        </footer>
    );
}
