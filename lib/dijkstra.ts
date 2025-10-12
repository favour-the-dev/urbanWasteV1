import dijkstra from "dijkstrajs";

export type Graph = Record<string, Record<string, number>>;

export function computeShortestPath(graph: Graph, start: string, end: string) {
  // dijkstrajs returns an array of node keys from start to end
  const path = dijkstra.find_path(graph, start, end) as string[];

  // compute total distance
  let total = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i];
    const b = path[i + 1];
    const w = graph[a]?.[b];
    total += typeof w === "number" ? w : 0;
  }

  return { path, totalDistance: total };
}
