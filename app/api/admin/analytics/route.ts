import { NextResponse } from "next/server";
import { connectToDB } from "../../../../lib/db";
import Route from "../../../../models/Route";

export async function GET() {
  await connectToDB();
  const total = await Route.countDocuments();
  const avg = await Route.aggregate([{ $group: { _id: 1, avg: { $avg: "$totalDistance" } } }]);
  const top5 = await Route.find().sort({ totalDistance: -1 }).limit(5).select("totalDistance").lean();
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
  const completed = await Route.countDocuments({ status: "completed", completedAt: { $gte: weekAgo } });
  const pending = await Route.countDocuments({ status: { $in: ["pending", "active"] } });
  return NextResponse.json({ success: true, message: "ok", data: { totalRoutes: total, averageDistance: avg[0]?.avg ?? 0, top5, completedLastWeek: completed, pending } });
}
