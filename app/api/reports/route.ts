import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../../../lib/db";
import Report from "../../../models/Report";
import User from "../../../models/User";
import { getServerSession } from "next-auth";
import { z } from "zod";

const createReportSchema = z.object({
    citizenId: z.string().min(1),
    type: z.enum([
        "Full Bin",
        "Flooding",
        "Road Block",
        "Damaged Bin",
        "Other",
    ]),
    description: z.string().min(10),
    location: z.string().optional(),
    coordinates: z
        .object({ latitude: z.number(), longitude: z.number() })
        .partial()
        .refine(
            (val) => val.latitude === undefined || val.longitude !== undefined,
            { message: "coordinates must have both latitude and longitude" }
        )
        .optional(),
    imageUrl: z.string().url().optional(),
    priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
});

const updateReportSchema = z.object({
    reportId: z.string().min(1),
    status: z.enum(["pending", "reviewing", "resolved", "rejected"]).optional(),
    adminNotes: z.string().optional(),
    priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
});

// GET - Fetch reports (with optional filters)
export async function GET(req: NextRequest) {
    try {
        await connectToDB();

        const { searchParams } = new URL(req.url);
        const citizenId = searchParams.get("citizenId");
        const status = searchParams.get("status");
        const type = searchParams.get("type");
        const limit = parseInt(searchParams.get("limit") || "50");

        const query: any = {};
        if (citizenId) query.citizenId = citizenId;
        if (status) query.status = status;
        if (type) query.type = type;

        const reports = await Report.find(query)
            .populate("citizenId", "name email")
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();

        return NextResponse.json({
            success: true,
            reports,
            count: reports.length,
        });
    } catch (error: any) {
        console.error("Failed to fetch reports:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Failed to fetch reports",
            },
            { status: 500 }
        );
    }
}

// POST - Create new report
export async function POST(req: NextRequest) {
    try {
        await connectToDB();

        const body = await req.json();
        const parsed = createReportSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { success: false, error: parsed.error.flatten() },
                { status: 400 }
            );
        }
        const {
            citizenId,
            type,
            description,
            location,
            coordinates,
            imageUrl,
            priority,
        } = parsed.data;

        // Create report
        const report = await Report.create({
            citizenId,
            type,
            description,
            location,
            coordinates,
            imageUrl,
            priority: priority || "medium",
            status: "pending",
        });

        // Add report to user's reports array
        await User.findByIdAndUpdate(citizenId, {
            $push: { reports: report._id },
        });

        const populatedReport = await Report.findById(report._id)
            .populate("citizenId", "name email")
            .lean();

        return NextResponse.json({
            success: true,
            message: "Report submitted successfully",
            report: populatedReport,
        });
    } catch (error: any) {
        console.error("Failed to create report:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Failed to create report",
            },
            { status: 500 }
        );
    }
}

// PATCH - Update report status (admin only)
export async function PATCH(req: NextRequest) {
    try {
        await connectToDB();

        const body = await req.json();
        const parsed = updateReportSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { success: false, error: parsed.error.flatten() },
                { status: 400 }
            );
        }
        const { reportId, status, adminNotes, priority } = parsed.data;

        if (!reportId) {
            return NextResponse.json(
                { success: false, error: "Report ID is required" },
                { status: 400 }
            );
        }

        const updateData: any = { updatedAt: new Date() };
        if (status) updateData.status = status;
        if (adminNotes) updateData.adminNotes = adminNotes;
        if (priority) updateData.priority = priority;
        if (status === "resolved") updateData.resolvedAt = new Date();

        const report = await Report.findByIdAndUpdate(reportId, updateData, {
            new: true,
        })
            .populate("citizenId", "name email")
            .lean();

        if (!report) {
            return NextResponse.json(
                { success: false, error: "Report not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Report updated successfully",
            report,
        });
    } catch (error: any) {
        console.error("Failed to update report:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Failed to update report",
            },
            { status: 500 }
        );
    }
}
