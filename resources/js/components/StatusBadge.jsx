import React from "react";
import { cn } from "@/lib/utils";

const styles = {
  upcoming: "bg-arena-warning/15 text-arena-warning border-arena-warning/30",
  ongoing: "bg-arena-cyan/15 text-arena-cyan border-arena-cyan/30",
  completed: "bg-arena-muted/15 text-arena-muted border-arena-muted/30",
  draft: "bg-arena-muted/15 text-arena-muted border-arena-muted/30",
  published: "bg-arena-purple/15 text-arena-purple border-arena-purple/30",
  registration_open: "bg-arena-success/15 text-arena-success border-arena-success/30",
  paid: "bg-arena-success/15 text-arena-success border-arena-success/30",
  verified: "bg-arena-success/15 text-arena-success border-arena-success/30",
  win: "bg-arena-success/15 text-arena-success border-arena-success/30",
  lose: "bg-arena-danger/15 text-arena-danger border-arena-danger/30",
};

export default function StatusBadge({ status, label = "", className = "" }) {
  const text = label || status;
  const cls = styles[status] || "bg-arena-muted/15 text-arena-muted border-arena-muted/30";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide",
        cls,
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {text}
    </span>
  );
}