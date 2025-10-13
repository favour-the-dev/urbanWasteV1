import { NextResponse } from "next/server";
import { connectToDB } from "../../../../lib/db";
import User from "../../../../models/User";
import Node from "../../../../models/Node";
import Route from "../../../../models/Route";

export async function GET() {
  await connectToDB();
  const ops = await User.find({ role: "operator", status: { $ne: "inactive" } }).select("name email").lean();
  return NextResponse.json({ success: true, message: "ok", data: ops });
}

export async function POST(req: Request) {
  await connectToDB();
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ success: false, message: "invalid payload" }, { status: 400 });
  const { operatorId, nodeNames, totalDistance } = body as { operatorId: string; nodeNames: string[]; totalDistance: number };
  if (!operatorId || !Array.isArray(nodeNames) || !nodeNames.length) {
    return NextResponse.json({ success: false, message: "operatorId and nodeNames required" }, { status: 400 });
  }
  const nodes = await Node.find({ name: { $in: nodeNames } }).lean();
  const idMap = new Map(nodes.map((n: any) => [n.name, n._id]));
  const nodeIds = nodeNames.map((n) => idMap.get(n)).filter(Boolean);
  const route = await Route.create({ assignedTo: operatorId, nodes: nodeIds, totalDistance, status: "pending" });
  return NextResponse.json({ success: true, message: "Route assigned", data: { routeId: String(route._id) } });
}
