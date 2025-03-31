"use client";

import { memo, useState } from "react";
import { Handle, Position } from "reactflow";
import { Trash2, Edit2, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CustomParameter {
  label: string;
  type: "string" | "number" | "boolean" | "select";
  options?: string[];
  value: any;
}

export const CustomNode = memo(({ data, id }: { data: any; id: string }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    label: data.label,
    description: data.description,
  });
  const [isAddingParameter, setIsAddingParameter] = useState(false);
  const [newParameter, setNewParameter] = useState<CustomParameter>({
    label: "",
    type: "string",
    value: "",
  });

  const handleEdit = () => {
    data.onUpdate?.(id, editData);
    setIsEditing(false);
  };

  const addParameter = () => {
    const updatedParameters = [...(data.customParameters || []), newParameter];
    data.onUpdate?.(id, { ...data, customParameters: updatedParameters });
    setIsAddingParameter(false);
    setNewParameter({ label: "", type: "string", value: "" });
  };

  const updateParameterValue = (index: number, value: any) => {
    const updatedParameters = [...(data.customParameters || [])];
    updatedParameters[index] = { ...updatedParameters[index], value };
    data.onUpdate?.(id, { ...data, customParameters: updatedParameters });
  };

  return (
    <Card className="min-w-[300px]">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm">{data.label}</CardTitle>
          <div className="text-xs text-muted-foreground">Part of {data.regionType}</div>
        </div>
        <div className="flex gap-2">
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Edit2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Custom Node</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Label</Label>
                  <Input
                    value={editData.label}
                    onChange={(e) => setEditData({ ...editData, label: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  />
                </div>
                <Button onClick={handleEdit}>Save Changes</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => data.onDelete?.(id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-xs">{data.description}</div>
        
        <div className="space-y-4">
          {data.customParameters?.map((param: CustomParameter, index: number) => (
            <div key={index} className="space-y-2">
              <Label>{param.label}</Label>
              {param.type === "select" ? (
                <Select
                  value={param.value}
                  onValueChange={(value) => updateParameterValue(index, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${param.label}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {param.options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  type={param.type === "number" ? "number" : "text"}
                  value={param.value}
                  onChange={(e) => updateParameterValue(index, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>

        <Dialog open={isAddingParameter} onOpenChange={setIsAddingParameter}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Parameter
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Custom Parameter</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Parameter Label</Label>
                <Input
                  value={newParameter.label}
                  onChange={(e) => setNewParameter({ ...newParameter, label: e.target.value })}
                />
              </div>
              <div>
                <Label>Parameter Type</Label>
                <Select
                  value={newParameter.type}
                  onValueChange={(value: any) => setNewParameter({ ...newParameter, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select parameter type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="string">String</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="boolean">Boolean</SelectItem>
                    <SelectItem value="select">Select</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {newParameter.type === "select" && (
                <div>
                  <Label>Options (comma-separated)</Label>
                  <Input
                    value={newParameter.options?.join(", ")}
                    onChange={(e) => setNewParameter({
                      ...newParameter,
                      options: e.target.value.split(",").map(opt => opt.trim())
                    })}
                  />
                </div>
              )}
              <Button onClick={addParameter}>Add Parameter</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </Card>
  );
});

CustomNode.displayName = "CustomNode";