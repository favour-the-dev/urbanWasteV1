import { NextResponse } from "next/server";
import { computeShortestPath, Graph } from "../../../..//lib/dijkstra";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const graph = body.graph as Graph;
        const start = body.start as string;
        const end = body.end as string;

        if (!graph || !start || !end) {
            return NextResponse.json(
                { error: "graph, start and end are required" },
                { status: 400 }
            );
        }

        // Validate that start and end nodes exist in graph
        if (!graph[start]) {
            return NextResponse.json(
                { error: `Start node '${start}' not found in graph` },
                { status: 400 }
            );
        }

        if (!graph[end]) {
            return NextResponse.json(
                { error: `End node '${end}' not found in graph` },
                { status: 400 }
            );
        }

        const result = computeShortestPath(graph, start, end);

        if (!result.path || result.path.length === 0) {
            return NextResponse.json(
                { error: "No path found between nodes" },
                { status: 404 }
            );
        }

        return NextResponse.json({ result });
    } catch (e: any) {
        console.error("Route computation error:", e);
        return NextResponse.json(
            { error: e.message || "Failed to compute route" },
            { status: 500 }
        );
    }
}
