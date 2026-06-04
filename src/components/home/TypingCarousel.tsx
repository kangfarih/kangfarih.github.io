"use client";

import { useEffect, useMemo, useState } from "react";

export function TypingCarousel({ items }: { items: string[] }) {
  const list = useMemo(() => items.map(normalizeItem).filter(Boolean), [items]);
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<"typing" | "holding" | "deleting">("typing");
  const [text, setText] = useState("");

  useEffect(() => {
    if (!list.length) return;
    const full = list[idx % list.length];

    if (phase === "typing") {
      if (text.length >= full.length) {
        const t = window.setTimeout(() => setPhase("holding"), 1100);
        return () => window.clearTimeout(t);
      }
      const t = window.setTimeout(() => setText(full.slice(0, text.length + 1)), 38);
      return () => window.clearTimeout(t);
    }

    if (phase === "holding") {
      const t = window.setTimeout(() => setPhase("deleting"), 900);
      return () => window.clearTimeout(t);
    }

    if (text.length <= 0) {
      setPhase("typing");
      setIdx((n) => (n + 1) % list.length);
      return;
    }

    const t = window.setTimeout(() => setText(full.slice(0, Math.max(0, text.length - 1))), 20);
    return () => window.clearTimeout(t);
  }, [idx, list, phase, text]);

  if (!list.length) return null;

  return (
    <div className="text-lg font-semibold text-[color:var(--foundation-white-dark)]">
      <span className="text-[color:var(--foundation-white-dark)]">I’m </span>
      <span className="text-[color:var(--foundation-white-light)]">{text}</span>
      <span className="ityped-cursor">|</span>
    </div>
  );
}

function normalizeItem(s: string) {
  let out = String(s ?? "").trim();
  out = out.replace(/\.\.\.$/, "");
  out = out.replace(/\s+/g, " ");
  return out;
}
