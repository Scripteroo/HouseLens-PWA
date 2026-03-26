"use client";

import { Camera, Menu } from "lucide-react";

interface Props {
  photoUrl: string | null;
  onOpenCamera: () => void;
  onMenuToggle: () => void;
}

export default function PropertyHero({ photoUrl, onOpenCamera, onMenuToggle }: Props) {
  return (
    <div className="relative w-full h-[52vh] min-h-[320px] bg-lens-text overflow-hidden select-none">
      {photoUrl ? (
        <div className="absolute inset-0">
          <img src={photoUrl} alt="Property" className="absolute inset-0 w-full h-full object-cover" />
        </div>
      ) : (
        <div onClick={onOpenCamera} className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 flex items-center justify-center cursor-pointer active:bg-slate-900 transition-colors">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 active:scale-95 transition-transform">
              <Camera className="w-10 h-10 text-white/50" />
            </div>
            <p className="text-white/50 text-sm font-medium tracking-wide">Tap anywhere to capture</p>
          </div>
        </div>
      )}
      <div className="absolute top-0 inset-x-0 z-10 flex items-center justify-between px-4 pt-[env(safe-area-inset-top,12px)] pb-2">
        <button onClick={(e) => { e.stopPropagation(); onMenuToggle(); }} className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center active:scale-95 transition-transform" type="button">
          <Menu className="w-5 h-5 text-white" />
        </button>
        {photoUrl ? (
          <button
            onClick={(e) => { e.stopPropagation(); onOpenCamera(); }}
            className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full active:scale-95 transition-transform"
            type="button"
          >
            <Camera className="w-4 h-4 text-white" />
            <span className="text-[13px] font-semibold text-white">Retake Photo</span>
          </button>
        ) : (
          <button onClick={(e) => { e.stopPropagation(); onOpenCamera(); }} className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center active:scale-95 transition-transform" type="button">
            <Camera className="w-5 h-5 text-white" />
          </button>
        )}
      </div>
    </div>
  );
}
