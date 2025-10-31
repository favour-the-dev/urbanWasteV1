import { NextRequest, NextResponse } from "next/server";

const OPENWEATHER_API_KEY = process.env.OPENWEATHERMAP_API_KEY;
const DEFAULT_CITY = "Port Harcourt";
const DEFAULT_LAT = 4.8156;
const DEFAULT_LON = 7.0498;

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const lat = searchParams.get("lat") || DEFAULT_LAT;
        const lon = searchParams.get("lon") || DEFAULT_LON;

        if (!OPENWEATHER_API_KEY) {
            // Return mock data if API key is not configured
            return NextResponse.json({
                success: true,
                mock: true,
                data: {
                    weather: {
                        main: "Clouds",
                        description: "scattered clouds",
                        icon: "03d",
                    },
                    main: {
                        temp: 28.5,
                        feels_like: 31.2,
                        humidity: 75,
                        pressure: 1012,
                    },
                    wind: {
                        speed: 3.5,
                        deg: 180,
                    },
                    visibility: 10000,
                    clouds: {
                        all: 40,
                    },
                    name: DEFAULT_CITY,
                    dt: Date.now() / 1000,
                },
            });
        }

        // Fetch current weather
        const weatherRes = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
        );

        if (!weatherRes.ok) {
            throw new Error("Failed to fetch weather data");
        }

        const weatherData = await weatherRes.json();

        // Fetch weather alerts if available
        let alerts = [];
        try {
            const alertsRes = await fetch(
                `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&exclude=minutely,hourly,daily`
            );
            if (alertsRes.ok) {
                const alertsData = await alertsRes.json();
                alerts = alertsData.alerts || [];
            }
        } catch (e) {
            console.log("Alerts not available");
        }

        return NextResponse.json({
            success: true,
            mock: false,
            data: weatherData,
            alerts,
        });
    } catch (error: any) {
        console.error("Weather API error:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Failed to fetch weather data",
            },
            { status: 500 }
        );
    }
}
