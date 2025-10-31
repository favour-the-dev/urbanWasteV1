import { NextResponse } from "next/server";
import { connectToDB } from "../../../../lib/db";
import User from "../../../../models/User";
import Node from "../../../../models/Node";
import Route from "../../../../models/Route";
import { z } from "zod";

const assignSchema = z.object({
    operatorId: z.string().min(1),
    nodeNames: z.array(z.string().min(1)).min(1),
    totalDistance: z.number().nonnegative().optional(),
});

export async function GET() {
    await connectToDB();
    const ops = await User.find({
        role: "operator",
        status: { $ne: "inactive" },
    })
        .select("name email")
        .lean();
    return NextResponse.json({ success: true, message: "ok", data: ops });
}

export async function POST(req: Request) {
    await connectToDB();
    const body = await req.json().catch(() => null);
    const parsed = assignSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            {
                success: false,
                message: "invalid payload",
                errors: parsed.error.flatten(),
            },
            { status: 400 }
        );
    }
    const { operatorId, nodeNames, totalDistance } = parsed.data;
    const nodes = await Node.find({ name: { $in: nodeNames } }).lean();
    const idMap = new Map(nodes.map((n: any) => [n.name, n._id]));
    const nodeIds = nodeNames.map((n) => idMap.get(n)).filter(Boolean);
    const route = await Route.create({
        assignedTo: operatorId,
        nodes: nodeIds,
        totalDistance,
        status: "pending",
    });
    return NextResponse.json({
        success: true,
        message: "Route assigned",
        data: { routeId: String(route._id) },
    });
}
