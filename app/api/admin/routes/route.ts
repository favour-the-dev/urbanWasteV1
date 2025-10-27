import { NextResponse } from "next/server";
import { connectToDB } from "../../../../lib/db";
import Route from "../../../../models/Route";

export async function GET() {
    try {
        await connectToDB();

        const routes = await Route.find()
            .populate("assignedTo", "name email")
            .populate("nodes", "name coordinates")
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({
            success: true,
            routes,
        });
    } catch (error: any) {
        console.error("Failed to fetch routes:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Failed to fetch routes",
            },
            { status: 500 }
        );
    }
}
