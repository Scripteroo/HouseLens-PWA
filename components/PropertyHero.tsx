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
        <img src={photoUrl} alt="Property" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <Camera className="w-12 h-12 text-white/30 mx-auto mb-3" />
            <p className="text-white/40 text-sm tracking-wide">Tap camera to capture property</p>
          </div>
        </div>
      )}
      <div className="absolute top-0 inset-x-0 z-10 flex items-center justify-between px-4 pt-[env(safe-area-inset-top,12px)] pb-2">
        <button onClick={onMenuToggle} className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center active:scale-95 transition-transform" type="button">
          <Menu className="w-5 h-5 text-white" />
        </button>
        <button onClick={onOpenCamera} className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center active:scale-95 transition-transform" type="button">
          <Camera className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
}
