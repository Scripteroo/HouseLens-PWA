"use client";

import { ReactNode } from "react";

interface Props {
  label: string;
  children: ReactNode;
  icon: ReactNode;
  onIconClick?: () => void;
  tappable?: boolean;
}

export default function InfoCard({ label, children, icon, onIconClick, tappable = false }: Props) {
  const handleTap = () => {
    if (navigator.vibrate) navigator.vibrate(10);
    onIconClick?.();
  };

  return (
    <div onClick={tappable ? handleTap : undefined} className={`bg-lens-card rounded-2xl shadow-card px-5 py-4 transition-all duration-200 ${tappable ? "cursor-pointer active:scale-[0.98] active:shadow-sm hover:shadow-elevated" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-lens-secondary mb-1.5">{label}</p>
          <div className="text-[15px] leading-snug text-lens-text font-medium">{children}</div>
        </div>
        <button onClick={(e) => { e.stopPropagation(); handleTap(); }} className="w-9 h-9 rounded-xl bg-lens-bg flex items-center justify-center flex-shrink-0 active:scale-90 transition-all duration-150 mt-0.5 hover:bg-lens-accent/10" type="button">{icon}</button>
      </div>
      {tappable && <p className="text-[10px] text-lens-accent/60 mt-2 font-medium">Tap to edit</p>}
    </div>
  );
}
