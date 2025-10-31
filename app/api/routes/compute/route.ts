import { NextResponse } from "next/server";
import { computeShortestPath, Graph } from "../../../..//lib/dijkstra";
import { z } from "zod";

const computeSchema = z.object({
    graph: z.record(z.string(), z.record(z.string(), z.number().min(0))),
    start: z.string().min(1),
    end: z.string().min(1),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsed = computeSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.flatten() },
                { status: 400 }
            );
        }
        const { graph, start, end } = parsed.data as unknown as {
            graph: Graph;
            start: string;
            end: string;
        };

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
