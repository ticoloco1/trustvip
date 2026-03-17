"use client";

import { Suspense } from "react";
import MiniSitePublic from "@/views/MiniSitePublic";

export default function MiniSiteSlugPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground text-sm">Carregando...</div>}>
      <MiniSitePublic />
    </Suspense>
  );
}
