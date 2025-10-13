import { NextResponse } from "next/server";
import { connectToDB } from "../../../../lib/db";
import Route from "../../../../models/Route";

export async function PATCH(req: Request) {
  await connectToDB();
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ success: false, message: "invalid payload" }, { status: 400 });
  const { routeId, status } = body as { routeId: string; status: "active" | "completed" };
  if (!routeId || !status) return NextResponse.json({ success: false, message: "routeId and status required" }, { status: 400 });
  const update: any = { status };
  if (status === "active") update.startedAt = new Date();
  if (status === "completed") update.completedAt = new Date();
  await Route.findByIdAndUpdate(routeId, update);
  return NextResponse.json({ success: true, message: "updated" });
}
