"use client";

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

interface Props {
  address: string;
  open: boolean;
  onClose: () => void;
  onSave: (address: string) => void;
}

export default function AddressEditor({ address, open, onClose, onSave }: Props) {
  const [value, setValue] = useState(address);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setValue(address);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, address]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg bg-white rounded-t-3xl p-6 animate-slide-up" onClick={(e) => e.stopPropagation()} style={{ paddingBottom: "env(safe-area-inset-bottom, 24px)" }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[17px] font-bold text-lens-text">Edit Address</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-lens-bg flex items-center justify-center" type="button">
            <X className="w-4 h-4 text-lens-secondary" />
          </button>
        </div>
        <input ref={inputRef} type="text" value={value} onChange={(e) => setValue(e.target.value)}
          className="w-full px-4 py-3.5 rounded-xl bg-lens-bg border border-lens-border text-[15px] text-lens-text placeholder:text-lens-secondary focus:outline-none focus:ring-2 focus:ring-lens-accent/30 focus:border-lens-accent transition-all"
          placeholder="Enter property address..." />
        <button onClick={() => { onSave(value); onClose(); }}
          className="w-full mt-4 py-3.5 rounded-xl bg-lens-accent text-white text-[15px] font-semibold active:scale-[0.98] transition-transform">
          Save Address
        </button>
      </div>
    </div>
  );
}
