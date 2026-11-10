"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { getOpenStatus, hoursText } from "@/lib/hours";

/** Live "Open now · closes 11:30 pm", checked against India Standard Time. */
export function OpenStatus({ className }: { className?: string }) {
  const [status, setStatus] = useState<ReturnType<typeof getOpenStatus> | null>(null);

  useEffect(() => {
    const update = () => setStatus(getOpenStatus());
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className={cn("h-2 w-2 rounded-full", status ? (status.open ? "bg-leaf shadow-[0_0_0_4px_rgba(47,158,87,0.25)]" : "bg-rose") : "bg-mist")} />
      {/* Server render shows the hours; the live status replaces it after hydration. */}
      {status ? status.label : `Daily ${hoursText}`}
    </span>
  );
}
