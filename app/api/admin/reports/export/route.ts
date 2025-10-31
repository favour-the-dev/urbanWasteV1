import { NextResponse } from "next/server";
import { connectToDB } from "../../../../../lib/db";
import ReportModel from "../../../../../models/Report";

function toCSV(rows: Array<Record<string, any>>): string {
    if (!rows.length) return "";
    const headers = Object.keys(rows[0]);
    const escape = (val: any) => {
        if (val == null) return "";
        const s = String(val).replace(/"/g, '""');
        if (/[",\n]/.test(s)) return `"${s}"`;
        return s;
    };
    const lines = [headers.join(",")];
    for (const row of rows) {
        lines.push(headers.map((h) => escape(row[h])).join(","));
    }
    return lines.join("\n");
}

export async function GET() {
    await connectToDB();
    const reports = await ReportModel.find()
        .populate("citizenId", "name email")
        .lean();

    const rows = reports.map((r: any) => ({
        reportId: r._id,
        type: r.type,
        status: r.status,
        priority: r.priority,
        citizenName: r.citizenId?.name || "",
        citizenEmail: r.citizenId?.email || "",
        latitude: r.coordinates?.latitude ?? "",
        longitude: r.coordinates?.longitude ?? "",
        createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : "",
        resolvedAt: r.resolvedAt ? new Date(r.resolvedAt).toISOString() : "",
    }));

    const csv = toCSV(rows);
    return new NextResponse(csv, {
        headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": `attachment; filename=reports_export.csv`,
            "Cache-Control": "no-store",
        },
    });
}
