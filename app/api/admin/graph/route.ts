import { NextResponse } from "next/server";
import { connectToDB } from "../../../../lib/db";
import NodeModel from "../../../../models/Node";
import EdgeModel from "../../../../models/Edge";

export async function GET() {
    await connectToDB();
    const nodes = await NodeModel.find().lean();
    const edges = await EdgeModel.find()
        .populate("fromNode")
        .populate("toNode")
        .lean();
    return NextResponse.json({ nodes, edges });
}
