import { NextResponse } from "next/server";
import { connectToDB } from "../../../../../lib/db";
import RouteModel from "../../../../../models/Route";

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
    const routes = await RouteModel.find()
        .populate("assignedTo", "name email")
        .populate("nodes", "name")
        .lean();

    const rows = routes.map((r: any) => ({
        routeId: r._id,
        operatorName: r.assignedTo?.name || "",
        operatorEmail: r.assignedTo?.email || "",
        nodePath: (r.nodes || []).map((n: any) => n.name).join(" -> "),
        totalDistanceKm: r.totalDistance,
        status: r.status,
        createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : "",
        startedAt: r.startedAt ? new Date(r.startedAt).toISOString() : "",
        completedAt: r.completedAt ? new Date(r.completedAt).toISOString() : "",
    }));

    const csv = toCSV(rows);
    return new NextResponse(csv, {
        headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": `attachment; filename=routes_export.csv`,
            "Cache-Control": "no-store",
        },
    });
}
