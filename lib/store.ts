import { create } from "zustand";

export type UINode = { _id?: string; name: string; coordinates: [number, number] };
export type UIEdge = { from: string; to: string; weight: number };

type GraphState = {
  uploadedNodes: UINode[];
  uploadedEdges: UIEdge[];
  setUploadedGraph: (nodes: UINode[], edges: UIEdge[]) => void;
  clearUploaded: () => void;
};

export const useGraphStore = create<GraphState>((set) => ({
  uploadedNodes: [],
  uploadedEdges: [],
  setUploadedGraph: (nodes, edges) => set({ uploadedNodes: nodes, uploadedEdges: edges }),
  clearUploaded: () => set({ uploadedNodes: [], uploadedEdges: [] }),
}));
