import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../../../../lib/db";
import NodeModel from "../../../../models/Node";
import EdgeModel from "../../../../models/Edge";
import ReportModel from "../../../../models/Report";

type Graph = Record<string, Record<string, number>>;

function toGraph(nodes: any[], edges: any[]): Graph {
    const idToName = new Map<string, string>();
    nodes.forEach((n: any) => idToName.set(String(n._id), n.name));
    const graph: Graph = {};
    nodes.forEach((n: any) => (graph[n.name] = {}));
    edges.forEach((e: any) => {
        const fromId =
            typeof e.fromNode === "string" ? e.fromNode : e.fromNode?._id;
        const toId = typeof e.toNode === "string" ? e.toNode : e.toNode?._id;
        const a = idToName.get(String(fromId));
        const b = idToName.get(String(toId));
        if (!a || !b) return;
        if (!graph[a]) graph[a] = {};
        if (!graph[b]) graph[b] = {};
        graph[a][b] = e.weight;
        graph[b][a] = e.weight;
    });
    return graph;
}

// Haversine distance in km
function haversine(a: [number, number], b: [number, number]) {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(b[0] - a[0]);
    const dLon = toRad(b[1] - a[1]);
    const lat1 = toRad(a[0]);
    const lat2 = toRad(b[0]);
    const h =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1) *
            Math.cos(lat2) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    return 2 * R * Math.asin(Math.sqrt(h));
}

function midpoint(a: [number, number], b: [number, number]): [number, number] {
    return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
}

export async function GET(req: NextRequest) {
    await connectToDB();
    const url = new URL(req.url);
    const weighted = url.searchParams.get("weighted") === "1";

    const nodes = await NodeModel.find().lean();
    const edges = await EdgeModel.find()
        .populate("fromNode")
        .populate("toNode")
        .lean();

    const baseGraph = toGraph(nodes, edges);

    if (!weighted) {
        return NextResponse.json({ nodes, edges, graph: baseGraph });
    }

    // Clone weights for mutation
    const weightedGraph: Graph = JSON.parse(JSON.stringify(baseGraph));

    // 1) Weather impact: modest increase during rain/drizzle
    let weatherMultiplier = 1;
    try {
        const weatherRes = await fetch(`${url.origin}/api/weather`, {
            cache: "no-store",
        });
        if (weatherRes.ok) {
            const w = await weatherRes.json();
            const main = (w?.data?.weather?.[0]?.main || "").toLowerCase();
            if (main.includes("rain") || main.includes("drizzle")) {
                weatherMultiplier = 1.2; // 20% penalty when raining
            }
        }
    } catch {
        // ignore
    }

    // Apply global weather multiplier
    if (weatherMultiplier !== 1) {
        for (const a of Object.keys(weightedGraph)) {
            for (const b of Object.keys(weightedGraph[a])) {
                weightedGraph[a][b] = Number(
                    (weightedGraph[a][b] * weatherMultiplier).toFixed(4)
                );
            }
        }
    }

    // 2) Citizen reports impact: increase weights near flooding/road blocks
    const recentReports = await ReportModel.find({
        status: { $in: ["pending", "reviewing"] },
        priority: { $in: ["high", "urgent"] },
    })
        .select("type coordinates")
        .lean();

    if (recentReports.length) {
        // Precompute node coords map
        const nameToCoord = new Map<string, [number, number]>();
        nodes.forEach((n: any) =>
            nameToCoord.set(n.name, n.coordinates as [number, number])
        );

        // For every edge, compute midpoint and compare to each report coordinate
        const edgePairs: Array<{
            a: string;
            b: string;
            mid: [number, number];
        }> = [];
        for (const a of Object.keys(baseGraph)) {
            for (const b of Object.keys(baseGraph[a])) {
                // avoid duplicating undirected edges (process only a<b lexicographically)
                if (a >= b) continue;
                const ca = nameToCoord.get(a);
                const cb = nameToCoord.get(b);
                if (!ca || !cb) continue;
                edgePairs.push({ a, b, mid: midpoint(ca, cb) });
            }
        }

        for (const rpt of recentReports) {
            const lat = rpt?.coordinates?.latitude;
            const lon = rpt?.coordinates?.longitude;
            if (typeof lat !== "number" || typeof lon !== "number") continue;
            const rptCoord: [number, number] = [lat, lon];
            const isFlood = String(rpt.type).toLowerCase().includes("flood");
            const isBlock = String(rpt.type).toLowerCase().includes("block");
            const localMult = isBlock ? 2.0 : isFlood ? 1.5 : 1.0;
            if (localMult === 1.0) continue;

            // Affect edges within ~1km from the report
            for (const ep of edgePairs) {
                const d = haversine(rptCoord, ep.mid);
                if (d <= 1.0) {
                    // increase both directions
                    weightedGraph[ep.a][ep.b] = Number(
                        (weightedGraph[ep.a][ep.b] * localMult).toFixed(4)
                    );
                    weightedGraph[ep.b][ep.a] = Number(
                        (weightedGraph[ep.b][ep.a] * localMult).toFixed(4)
                    );
                }
            }
        }
    }

    return NextResponse.json({ nodes, edges, graph: weightedGraph, baseGraph });
}
