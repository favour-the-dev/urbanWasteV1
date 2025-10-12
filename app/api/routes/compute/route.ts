import { NextResponse } from "next/server";
import { computeShortestPath, Graph } from "../../../..//lib/dijkstra";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const graph = body.graph as Graph;
    const start = body.start as string;
    const end = body.end as string;

    if (!graph || !start || !end) {
      return NextResponse.json({ error: "graph, start and end are required" }, { status: 400 });
    }

    const result = computeShortestPath(graph, start, end);
    return NextResponse.json({ result });
  } catch (e) {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }
}
