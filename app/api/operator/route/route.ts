import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../../../../lib/db";
import Route from "../../../../models/Route";

export async function GET(req: NextRequest) {
    try {
        await connectToDB();

        const { searchParams } = new URL(req.url);
        const operatorId = searchParams.get("operatorId");

        console.log("Fetching route for operator ID:", operatorId);

        if (!operatorId) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Operator ID is required",
                },
                { status: 400 }
            );
        }

        // Find the most recent non-completed route assigned to this operator
        const route = await Route.findOne({
            assignedTo: operatorId,
            status: { $in: ["pending", "active"] }, // Don't fetch completed routes
        })
            .populate("assignedTo", "name email")
            .populate("nodes", "name coordinates")
            .sort({ createdAt: -1 }) // Get the most recent route
            .lean();

        console.log(
            "Found route:",
            route ? `Route ID: ${(route as any)._id}` : "No route found"
        );

        return NextResponse.json({
            success: true,
            data: route,
        });
    } catch (error: any) {
        console.error("Failed to fetch operator route:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Failed to fetch operator route",
            },
            { status: 500 }
        );
    }
}
