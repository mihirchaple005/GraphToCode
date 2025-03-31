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
import { StepParameters } from "@/components/parameters/StepParameters";

export const RegionNode = memo(({ data, id }: { data: any; id: string }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    label: data.label,
    description: data.description,
  });

  const handleEdit = () => {
    data.onUpdate?.(id, editData);
    setIsEditing(false);
  };

  return (
    <Card className="min-w-[400px]">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Step {data.step}: {data.label}</CardTitle>
        <div className="flex gap-2">
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Edit2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Region</DialogTitle>
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
        <div className="text-sm text-muted-foreground">
          {data.description}
        </div>
        <StepParameters 
          step={data.step} 
          onUpdate={(params) => data.onParameterUpdate?.(id, params)} 
        />
      </CardContent>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </Card>
  );
});

RegionNode.displayName = "RegionNode";