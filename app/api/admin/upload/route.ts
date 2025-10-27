import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../../../../lib/db";
import NodeModel from "../../../../models/Node";
import EdgeModel from "../../../../models/Edge";

export async function POST(req: NextRequest) {
    try {
        await connectToDB();
        const body = await req.json();

        const { nodes, edges } = body as {
            nodes: Array<{ name: string; coordinates: [number, number] }>;
            edges: Array<{ from: string; to: string; weight: number }>;
        };

        // Validate: must have nodes or edges
        if (!Array.isArray(nodes) && !Array.isArray(edges)) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Either nodes or edges array is required",
                },
                { status: 400 }
            );
        }

        // Insert new nodes if provided
        let insertedNodes: any[] = [];
        const nodeMap = new Map();

        if (Array.isArray(nodes) && nodes.length > 0) {
            insertedNodes = await NodeModel.insertMany(
                nodes.map((n) => ({
                    name: n.name,
                    coordinates: n.coordinates,
                }))
            );
            // Map new node names to their IDs
            insertedNodes.forEach((n) => nodeMap.set(n.name, n._id));
        }

        // If edges reference existing nodes, fetch them
        if (Array.isArray(edges) && edges.length > 0) {
            const edgeNodeNames = edges.flatMap((e) => [e.from, e.to]);
            const uniqueNodeNames = [...new Set(edgeNodeNames)];

            // Get existing nodes that aren't in the nodeMap yet
            const existingNodeNames = uniqueNodeNames.filter(
                (name) => !nodeMap.has(name)
            );
            if (existingNodeNames.length > 0) {
                const existingNodes = await NodeModel.find({
                    name: { $in: existingNodeNames },
                });
                existingNodes.forEach((n) => nodeMap.set(n.name, n._id));
            }
        }

        // Insert edges if provided
        let insertedEdges = [];
        if (Array.isArray(edges) && edges.length > 0) {
            const edgeDocs = edges
                .map((e) => {
                    const fromId = nodeMap.get(e.from);
                    const toId = nodeMap.get(e.to);
                    if (fromId && toId) {
                        return {
                            fromNode: fromId,
                            toNode: toId,
                            weight: e.weight,
                        };
                    }
                    return null;
                })
                .filter(Boolean);

            if (edgeDocs.length > 0) {
                insertedEdges = await EdgeModel.insertMany(edgeDocs);
            }
        }

        return NextResponse.json({
            success: true,
            message: "Data uploaded successfully",
            data: {
                nodesCount: insertedNodes.length,
                edgesCount: insertedEdges.length,
            },
        });
    } catch (error: any) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Upload failed" },
            { status: 500 }
        );
    }
}
