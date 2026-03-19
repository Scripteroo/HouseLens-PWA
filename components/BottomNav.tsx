"use client";

import { Home, Share2, Building2, Settings } from "lucide-react";

interface Props { active?: string; }

const tabs = [
  { id: "home", label: "Home", icon: Home },
  { id: "share", label: "Share", icon: Share2 },
  { id: "properties", label: "Properties", icon: Building2 },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function BottomNav({ active = "home" }: Props) {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-t border-lens-border/50" style={{ paddingBottom: "env(safe-area-inset-bottom, 8px)" }}>
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = id === active;
          return (
            <button key={id} onClick={() => { if (navigator.vibrate) navigator.vibrate(8); }} className="flex flex-col items-center justify-center gap-0.5 flex-1 py-1 active:scale-90 transition-transform duration-150" type="button">
              <div className="relative">
                {isActive && <div className="absolute -inset-1.5 bg-lens-accent/10 rounded-full" />}
                <Icon className={`relative w-[22px] h-[22px] transition-colors ${isActive ? "text-lens-accent" : "text-lens-secondary"}`} strokeWidth={isActive ? 2.2 : 1.8} />
              </div>
              <span className={`text-[10px] font-medium transition-colors ${isActive ? "text-lens-accent" : "text-lens-secondary"}`}>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
