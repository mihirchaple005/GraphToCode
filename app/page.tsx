"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Dynamically import the Workspace component to avoid SSR issues with ReactFlow
const Workspace = dynamic(() => import("@/components/Workspace"), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  ),
});

export default function Home() {
  return <Workspace />;
}