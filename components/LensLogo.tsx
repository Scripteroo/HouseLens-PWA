"use client";

interface Props {
  onTap?: () => void;
}

export default function LensLogo({ onTap }: Props) {
  return (
    <div className="flex justify-center -mt-11 relative z-20">
      <div className="relative">
        <div className="absolute inset-[-6px] rounded-full bg-blue-400/20 animate-ping" style={{ animationDuration: "3s" }} />
        <button
          onClick={onTap}
          type="button"
          className="relative w-[84px] h-[84px] rounded-full bg-white shadow-logo flex items-center justify-center border-[3px] border-white overflow-hidden active:scale-95 transition-transform"
        >
          <img src="/logo.png" alt="HouseLens" className="w-[72px] h-[72px] object-contain" draggable={false} />
        </button>
      </div>
    </div>
  );
}