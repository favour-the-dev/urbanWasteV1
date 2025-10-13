"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Trash2,
  Route,
  MapPin,
  Users,
  TrendingUp,
  Shield,
  Clock,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import Navbar from "../components/ui/Navbar";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

const features = [
  {
    icon: Route,
    title: "Smart Route Optimization",
    description:
      "AI-powered algorithms calculate the most efficient collection routes, reducing fuel costs and time.",
  },
  {
    icon: MapPin,
    title: "Real-time Tracking",
    description:
      "Monitor waste collection vehicles and track progress across Port Harcourt in real-time.",
  },
  {
    icon: Users,
    title: "Team Management",
    description:
      "Coordinate operators, assign routes, and manage your entire waste collection workforce.",
  },
  {
    icon: TrendingUp,
    title: "Analytics Dashboard",
    description:
      "Comprehensive insights and reports to optimize operations and improve efficiency.",
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
      if (role === "admin") {
        router.push("/admin/dashboard");
      } else if (role === "operator") {
        router.push("/operator/dashboard");
      }
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-teal-600/10" />
        <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              Serving Port Harcourt
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Smart Waste Management
              <br />
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Made Simple
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Revolutionizing waste collection in Port Harcourt with intelligent
              route optimization, real-time tracking, and data-driven insights
              for cleaner, more efficient operations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="text-lg px-8 py-4">
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/signin">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-4"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                  <stat.icon className="w-8 h-8 text-emerald-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Intelligent Waste Management
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform combines cutting-edge technology with
              practical solutions to transform waste collection operations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-8 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-emerald-600 to-teal-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-4xl mx-auto px-6 text-center text-white">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Trash2 className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Transform Your Operations?
          </h2>

          <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
            Join the waste management revolution. Start optimizing your
            collection routes and improving efficiency today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-emerald-700 hover:bg-gray-50 text-lg px-8 py-4"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 lg:mb-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">UrbanWaste</h3>
                <p className="text-gray-400 text-sm">Smart Waste Management</p>
              </div>
            </div>

            <div className="text-gray-400 text-sm text-center lg:text-right">
              <p>© 2024 UrbanWaste. All rights reserved.</p>
              <p>Serving Port Harcourt, Nigeria</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
