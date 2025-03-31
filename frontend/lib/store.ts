import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Node, Edge } from 'reactflow';

interface WorkspaceState {
  nodes: Node[];
  edges: Edge[];
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: Node) => void;
  updateNode: (nodeId: string, data: any) => void;
  deleteNode: (nodeId: string) => void;
  parameters: Record<string, any>;
  updateParameters: (nodeId: string, params: any) => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      nodes: [],
      edges: [],
      parameters: {},
      setNodes: (nodes) => set({ nodes }),
      setEdges: (edges) => set({ edges }),
      addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),
      updateNode: (nodeId, data) =>
        set((state) => ({
          nodes: state.nodes.map((node) =>
            node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
          ),
        })),
      deleteNode: (nodeId) =>
        set((state) => ({
          nodes: state.nodes.filter((node) => node.id !== nodeId),
          edges: state.edges.filter(
            (edge) => edge.source !== nodeId && edge.target !== nodeId
          ),
        })),
      updateParameters: (nodeId, params) =>
        set((state) => ({
          parameters: {
            ...state.parameters,
            [nodeId]: params,
          },
        })),
    }),
    {
      name: 'workspace-storage',
      version: 1,
    }
  )
);