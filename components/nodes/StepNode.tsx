"use client";

import { memo } from "react";
import { Handle, Position } from "reactflow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const StepNode = memo(({ data }: { data: any }) => {
  return (
    <Card className="w-[300px]">
      <CardHeader>
        <CardTitle className="text-sm">Step {data.step}: {data.label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs">{data.description}</div>
      </CardContent>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </Card>
  );
});

StepNode.displayName = "StepNode";