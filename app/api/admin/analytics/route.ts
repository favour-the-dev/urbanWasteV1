import { NextResponse } from "next/server";
import { connectToDB } from "../../../../lib/db";
import Route from "../../../../models/Route";

export async function GET() {
    await connectToDB();
    const total = await Route.countDocuments();
    const avg = await Route.aggregate([
        { $group: { _id: 1, avg: { $avg: "$totalDistance" } } },
    ]);
    const top5 = await Route.find()
        .sort({ totalDistance: -1 })
        .limit(5)
        .select("totalDistance")
        .lean();

    const now = new Date();
    const dayMs = 24 * 3600 * 1000;
    const start = new Date(now.getTime() - 6 * dayMs);

    // Build 7-day trend of completed routes
    const trend: Array<{ day: string; completed: number }> = [];
    for (let i = 0; i < 7; i++) {
        const d0 = new Date(
            start.getFullYear(),
            start.getMonth(),
            start.getDate() + i
        );
        const d1 = new Date(
            start.getFullYear(),
            start.getMonth(),
            start.getDate() + i + 1
        );
        // Count completed routes with completedAt in [d0, d1)
        /* eslint-disable no-await-in-loop */
        const count = await Route.countDocuments({
            status: "completed",
            completedAt: { $gte: d0, $lt: d1 },
        });
        trend.push({ day: d0.toISOString().slice(0, 10), completed: count });
    }

    const completed = trend.reduce((acc, x) => acc + x.completed, 0);
    const pending = await Route.countDocuments({
        status: { $in: ["pending", "active"] },
    });

    return NextResponse.json({
        success: true,
        message: "ok",
        data: {
            totalRoutes: total,
            averageDistance: avg[0]?.avg ?? 0,
            top5,
            completedLastWeek: completed,
            pending,
            trend,
        },
    });
}
