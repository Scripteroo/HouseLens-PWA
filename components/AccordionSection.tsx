"use client";

import { useState, ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface Props {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  badge?: string;
}

export default function AccordionSection({ title, icon, children, badge }: Props) {
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    if (navigator.vibrate) navigator.vibrate(5);
    setOpen(!open);
  };

  return (
    <div className={`bg-lens-card rounded-2xl shadow-card overflow-hidden transition-shadow duration-300 ${open ? "shadow-elevated" : ""}`}>
      <button onClick={handleToggle} className="w-full flex items-center justify-between px-5 py-4 active:bg-gray-50/80 transition-colors" type="button">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300 ${open ? "bg-lens-accent/10 text-lens-accent" : "bg-lens-bg text-lens-secondary"}`}>{icon}</div>
          <span className="text-[15px] font-semibold text-lens-text">{title}</span>
          {badge && <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-lens-accent/10 text-lens-accent">{badge}</span>}
        </div>
        <ChevronDown className={`w-5 h-5 text-lens-secondary transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${open ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-5 pb-4 pt-1">{children}</div>
      </div>
    </div>
  );
}
