"use client";

import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BackToTopButton() {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="rounded-xl text-white/60 hover:bg-primary/10 hover:text-primary"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      Volver arriba <ArrowUp data-icon="inline-end" />
    </Button>
  );
}
