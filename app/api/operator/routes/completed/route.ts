import { NextResponse } from "next/server";
import { connectToDB } from "../../../../../lib/db";
import Route from "../../../../../models/Route";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const operatorId = url.searchParams.get('operatorId');
  if (!operatorId) return NextResponse.json({ success: false, message: 'operatorId required' }, { status: 400 });
  await connectToDB();
  const routes = await Route.find({ assignedTo: operatorId, status: 'completed' }).select('nodes totalDistance createdAt completedAt').lean();
  return NextResponse.json({ success: true, message: 'ok', data: routes });
}
