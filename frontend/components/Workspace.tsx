"use client";

import { useState, useCallback } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  Connection,
  Edge,
  NodeTypes,
  addEdge,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import { Plus, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { StepNode } from "@/components/nodes/StepNode";
import { RegionNode } from "@/components/nodes/RegionNode";
import { CustomNode } from "@/components/nodes/CustomNode";
import { generateCode } from "@/lib/generate-code";
import { StepParameters } from "./parameters/StepParameters";

const nodeTypes: NodeTypes = {
  step: StepNode,
  region: RegionNode,
  custom: CustomNode,
};

const calculateNodePosition = (index: number) => {
  const GRID_SPACING_X = 600;
  const GRID_SPACING_Y = 400;
  const NODES_PER_ROW = 3;
  
  const row = Math.floor(index / NODES_PER_ROW);
  const col = index % NODES_PER_ROW;
  
  return {
    x: col * GRID_SPACING_X + 50,
    y: row * GRID_SPACING_Y + 50,
  };
};

const initialNodes = [
  {
    id: "region-1",
    type: "region",
    data: { 
      label: "Data Collection",
      step: 1,
      description: "Configure data collection parameters and sources",
      regionType: "Data Collection",
    },
    position: calculateNodePosition(0),
  },
  {
    id: "region-2",
    type: "region",
    data: { 
      label: "Data Preprocessing",
      step: 2,
      description: "Set up data cleaning and preprocessing steps",
      regionType: "Data Preprocessing",
    },
    position: calculateNodePosition(1),
  },
  {
    id: "region-3",
    type: "region",
    data: { 
      label: "Model Selection",
      step: 3,
      description: "Choose and configure the ML model",
      regionType: "Model Selection",
    },
    position: calculateNodePosition(2),
  },
  {
    id: "region-4",
    type: "region",
    data: { 
      label: "Model Training",
      step: 4,
      description: "Configure training parameters and process",
      regionType: "Model Training",
    },
    position: calculateNodePosition(3),
  },
  {
    id: "region-5",
    type: "region",
    data: { 
      label: "Model Evaluation",
      step: 5,
      description: "Set up evaluation metrics and validation",
      regionType: "Model Evaluation",
    },
    position: calculateNodePosition(4),
  },
  {
    id: "region-6",
    type: "region",
    data: { 
      label: "Model Tuning",
      step: 6,
      description: "Configure hyperparameter tuning process",
      regionType: "Model Tuning",
    },
    position: calculateNodePosition(5),
  },
  {
    id: "region-7",
    type: "region",
    data: { 
      label: "Deployment",
      step: 7,
      description: "Set up model deployment configuration",
      regionType: "Deployment",
    },
    position: calculateNodePosition(6),
  },
];

function WorkspaceFlow() {
  const [nodes, setNodes] = useState(initialNodes.map(node => ({
    ...node,
    data: {
      ...node.data,
      onDelete: (id: string) => handleDeleteNode(id),
      onUpdate: (id: string, data: any) => handleUpdateNode(id, data),
      onParameterUpdate: (id: string, params: any) => handleParameterUpdate(id, params),
    },
  })));
  
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isAddingNode, setIsAddingNode] = useState(false);
  const [showCodePreview, setShowCodePreview] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [newNodeData, setNewNodeData] = useState({
    label: "",
    description: "",
    type: "region",
    parentRegion: "",
  });
  const [parameters, setParameters] = useState<Record<string, any>>({});

  const handleDeleteNode = useCallback((id: string) => {
    setNodes((nds) => {
      const updatedNodes = nds.filter((node) => node.id !== id);
      // Reorder steps after deletion
      return updatedNodes.map((node, index) => ({
        ...node,
        data: {
          ...node.data,
          step: index + 1,
        },
      }));
    });
    setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
  }, []);

  const handleUpdateNode = useCallback((id: string, data: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                ...data,
                onDelete: node.data.onDelete,
                onUpdate: node.data.onUpdate,
                onParameterUpdate: node.data.onParameterUpdate,
              },
            }
          : node
      )
    );
  }, []);

  const handleParameterUpdate = useCallback((id: string, params: any) => {
    setParameters((prev) => ({
      ...prev,
      [id]: params,
    }));
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                parameters: params, // <-- Inject params directly to node
              },
            }
          : node
      )
    );
  }, []);

  const onNodesChange = useCallback((changes) => {
    setNodes((nds) =>
      nds.map((node) => {
        const change = changes.find((c) => c.id === node.id);
        if (change && change.type === 'position') {
          return {
            ...node,
            position: change.position || node.position,
          };
        }
        return node;
      })
    );
  }, []);

  const onEdgesChange = useCallback((changes) => {
    setEdges((eds) =>
      eds.map((edge) => {
        const change = changes.find((c) => c.id === edge.id);
        if (change) {
          return { ...edge, ...change };
        }
        return edge;
      })
    );
  }, []);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const handleGenerateCode = useCallback(async () => {
    try {
      console.log("Parameters for code generation:", parameters);
      const code = await generateCode(parameters);
      setGeneratedCode(code);
      setShowCodePreview(true);
    } catch (error) {
      console.error("Error generating code:", error);
    }
  }, [parameters]);

  const addNewNode = useCallback(() => {
    const nodeId = `${newNodeData.type}-${nodes.length + 1}`;
    const position = calculateNodePosition(nodes.length);
    
    const newNode = {
      id: nodeId,
      type: newNodeData.type === "custom" ? "custom" : "region",
      position,
      data: {
        label: newNodeData.label,
        step: nodes.length + 1,
        description: newNodeData.description,
        regionType: newNodeData.type === "custom" ? newNodeData.parentRegion : newNodeData.label,
        onParameterUpdate: handleParameterUpdate,
        onUpdate: handleUpdateNode,
        onDelete: handleDeleteNode,
        customParameters: [],
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setIsAddingNode(false);
    setNewNodeData({
      label: "",
      description: "",
      type: "region",
      parentRegion: "",
    });
  }, [nodes.length, newNodeData, handleParameterUpdate, handleUpdateNode, handleDeleteNode]);

  return (
    <div className="h-screen w-full flex">
      <div className="flex-1 relative z-10">
        <div className="absolute right-4 top-4 z-10 flex gap-2">
          <Dialog open={isAddingNode} onOpenChange={setIsAddingNode}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Node
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Node</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Node Type</Label>
                  <Select
                    onValueChange={(value) => setNewNodeData({ ...newNodeData, type: value })}
                    value={newNodeData.type}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select node type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="region">Region</SelectItem>
                      <SelectItem value="custom">Custom Node</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {newNodeData.type === "custom" && (
                  <div>
                    <Label>Parent Region</Label>
                    <Select
                      onValueChange={(value) => setNewNodeData({ ...newNodeData, parentRegion: value })}
                      value={newNodeData.parentRegion}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select parent region" />
                      </SelectTrigger>
                      <SelectContent>
                        {nodes
                          .filter((node) => node.type === "region")
                          .map((node) => (
                            <SelectItem key={node.id} value={node.data.label}>
                              {node.data.label}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div>
                  <Label>Label</Label>
                  <Input
                    value={newNodeData.label}
                    onChange={(e) => setNewNodeData({ ...newNodeData, label: e.target.value })}
                    placeholder="Enter node label"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={newNodeData.description}
                    onChange={(e) => setNewNodeData({ ...newNodeData, description: e.target.value })}
                    placeholder="Enter node description"
                  />
                </div>
                <Button onClick={addNewNode}>Create Node</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button onClick={handleGenerateCode}>
            <Code className="mr-2 h-4 w-4" />
            Generate Python Code
          </Button>
        </div>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
      
      {showCodePreview && (
        <div className="w-1/3 border-l border-border overflow-auto">
          <Card className="h-full rounded-none border-0">
            <CardHeader className="sticky top-0 z-10 bg-background border-b">
              <CardTitle className="flex items-center justify-between">
                <span>Generated Python Code</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCodePreview(false)}
                >
                  Close
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <pre className="whitespace-pre-wrap text-sm font-mono bg-muted p-4 rounded-lg">
                {generatedCode}
              </pre>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default function Workspace() {
  return (
    <ReactFlowProvider>
      <WorkspaceFlow />
    </ReactFlowProvider>
  );
}