"use client";
import { useEffect, useState } from "react";
import {
    Cloud,
    CloudRain,
    Sun,
    Wind,
    Droplets,
    Eye,
    AlertTriangle,
} from "lucide-react";
import Card from "../ui/Card";

type WeatherData = {
    weather: { main: string; description: string; icon: string }[];
    main: {
        temp: number;
        feels_like: number;
        humidity: number;
        pressure: number;
    };
    wind: { speed: number; deg: number };
    visibility: number;
    name: string;
};

export default function WeatherWidget() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isMock, setIsMock] = useState(false);

    useEffect(() => {
        fetchWeather();
        // Refresh every 10 minutes
        const interval = setInterval(fetchWeather, 600000);
        return () => clearInterval(interval);
    }, []);

    const fetchWeather = async () => {
        try {
            const res = await fetch("/api/weather");
            const data = await res.json();
            if (data.success) {
                setWeather(data.data);
                setIsMock(data.mock);
            }
        } catch (error) {
            console.error("Failed to fetch weather:", error);
        } finally {
            setLoading(false);
        }
    };

    const getWeatherIcon = (main: string) => {
        switch (main.toLowerCase()) {
            case "clear":
                return <Sun className="w-12 h-12 text-yellow-500" />;
            case "rain":
            case "drizzle":
                return <CloudRain className="w-12 h-12 text-blue-500" />;
            case "clouds":
                return <Cloud className="w-12 h-12 text-gray-400" />;
            default:
                return <Cloud className="w-12 h-12 text-gray-400" />;
        }
    };

    if (loading) {
        return (
            <Card className="p-6 animate-pulse">
                <div className="h-32 bg-gray-200 rounded"></div>
            </Card>
        );
    }

    if (!weather) {
        return (
            <Card className="p-6">
                <div className="text-center text-gray-500">
                    <Cloud className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">Weather data unavailable</p>
                </div>
            </Card>
        );
    }

    const currentWeather = weather.weather[0];

    return (
        <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Cloud className="w-5 h-5 text-emerald-600" />
                        Weather Conditions
                    </h3>
                    <p className="text-sm text-gray-600">{weather.name}</p>
                    {isMock && (
                        <span className="text-xs text-orange-600 flex items-center gap-1 mt-1">
                            <AlertTriangle className="w-3 h-3" />
                            Demo Data
                        </span>
                    )}
                </div>
                {getWeatherIcon(currentWeather.main)}
            </div>

            <div className="space-y-3">
                {/* Temperature */}
                <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-gray-900">
                        {Math.round(weather.main.temp)}°C
                    </span>
                    <span className="text-sm text-gray-600 capitalize">
                        {currentWeather.description}
                    </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-emerald-200">
                    <div className="flex items-center gap-2">
                        <Droplets className="w-4 h-4 text-emerald-600" />
                        <div>
                            <p className="text-xs text-gray-600">Humidity</p>
                            <p className="text-sm font-medium text-gray-900">
                                {weather.main.humidity}%
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Wind className="w-4 h-4 text-emerald-600" />
                        <div>
                            <p className="text-xs text-gray-600">Wind</p>
                            <p className="text-sm font-medium text-gray-900">
                                {weather.wind.speed} m/s
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-emerald-600" />
                        <div>
                            <p className="text-xs text-gray-600">Visibility</p>
                            <p className="text-sm font-medium text-gray-900">
                                {(weather.visibility / 1000).toFixed(1)} km
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Sun className="w-4 h-4 text-emerald-600" />
                        <div>
                            <p className="text-xs text-gray-600">Feels Like</p>
                            <p className="text-sm font-medium text-gray-900">
                                {Math.round(weather.main.feels_like)}°C
                            </p>
                        </div>
                    </div>
                </div>

                {/* Weather Impact on Operations */}
                <div className="pt-3 border-t border-emerald-200">
                    <p className="text-xs text-gray-600 mb-1">Route Impact</p>
                    <div className="flex items-center gap-2">
                        {weather.weather[0].main === "Rain" ? (
                            <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-700">
                                ⚠️ Consider weather delays
                            </span>
                        ) : (
                            <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                                ✓ Good conditions
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}
