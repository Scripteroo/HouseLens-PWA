"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface Props {
  currentNumber: number;
  onNumberChange: (num: number) => void;
}

const ITEM_HEIGHT = 40;
const VISIBLE_COUNT = 5;
const RANGE = 20; // generate 20 numbers above and below

export default function HouseNumberPicker({ currentNumber, onNumberChange }: Props) {
  const [sameSide, setSameSide] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastSnapped = useRef(currentNumber);

  const isOdd = currentNumber % 2 !== 0;
  const step = 2;
  const startParity = sameSide ? (isOdd ? 1 : 0) : (isOdd ? 0 : 1);

  // Generate the number list
  const baseNum = sameSide ? currentNumber : (isOdd ? currentNumber - 1 : currentNumber + 1);
  const numbers: number[] = [];
  for (let i = -RANGE; i <= RANGE; i++) {
    const n = baseNum + i * step;
    if (n > 0) numbers.push(n);
  }

  const centerIndex = numbers.indexOf(sameSide ? currentNumber : baseNum);
  const safeCenterIndex = centerIndex >= 0 ? centerIndex : Math.floor(numbers.length / 2);

  // Scroll to center on mount and when side changes
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const targetScroll = safeCenterIndex * ITEM_HEIGHT;
    el.scrollTop = targetScroll;
    lastSnapped.current = numbers[safeCenterIndex];
  }, [sameSide, currentNumber]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const index = Math.round(el.scrollTop / ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(index, numbers.length - 1));
    const num = numbers[clamped];
    if (num && num !== lastSnapped.current) {
      lastSnapped.current = num;
      if (navigator.vibrate) navigator.vibrate(5);
      onNumberChange(num);
    }
  }, [numbers, onNumberChange]);

  // Debounce scroll end detection
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let timeout: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(handleScroll, 80);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => { el.removeEventListener("scroll", onScroll); clearTimeout(timeout); };
  }, [handleScroll]);

  return (
    <div className="mt-2">
      {/* Side toggle */}
      <div className="flex gap-1 mb-2">
        <button
          onClick={() => setSameSide(true)}
          className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-colors ${sameSide ? "bg-lens-accent text-white" : "bg-lens-bg text-lens-secondary"}`}
          type="button"
        >
          Same side
        </button>
        <button
          onClick={() => setSameSide(false)}
          className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-colors ${!sameSide ? "bg-lens-accent text-white" : "bg-lens-bg text-lens-secondary"}`}
          type="button"
        >
          Other side
        </button>
      </div>

      {/* Scroll picker */}
      <div className="relative" style={{ height: ITEM_HEIGHT * VISIBLE_COUNT }}>
        {/* Top fade */}
        <div className="absolute top-0 inset-x-0 h-12 bg-gradient-to-b from-lens-card to-transparent z-10 pointer-events-none" />
        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-lens-card to-transparent z-10 pointer-events-none" />
        {/* Center highlight */}
        <div
          className="absolute inset-x-0 z-[5] border-y border-lens-accent/20 bg-lens-accent/5 pointer-events-none rounded"
          style={{ top: ITEM_HEIGHT * 2, height: ITEM_HEIGHT }}
        />

        <div
          ref={scrollRef}
          className="h-full overflow-y-auto"
          style={{
            scrollSnapType: "y mandatory",
            WebkitOverflowScrolling: "touch",
            paddingTop: ITEM_HEIGHT * 2,
            paddingBottom: ITEM_HEIGHT * 2,
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <style jsx>{`div::-webkit-scrollbar { display: none; }`}</style>
          {numbers.map((num) => {
            return (
              <div
                key={num}
                className="flex items-center justify-center"
                style={{
                  height: ITEM_HEIGHT,
                  scrollSnapAlign: "center",
                }}
              >
                <span className="text-[20px] font-bold text-lens-text tabular-nums">
                  {num}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <p className="text-[10px] text-lens-accent/60 mt-1 font-medium">Scroll to adjust house number</p>
    </div>
  );
}
