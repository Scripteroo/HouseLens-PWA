"use client";

import { useState } from "react";
import { Camera, User, Phone, ChevronRight } from "lucide-react";

const slides = [
  {
    icon: Camera,
    title: "Snap Any House",
    subtitle: "Point your camera at any property to instantly identify it",
  },
  {
    icon: User,
    title: "See the Owner",
    subtitle: "Get owner name, property value, tax history, and more",
  },
  {
    icon: Phone,
    title: "Get Their Number",
    subtitle: "Find owner phone numbers and email addresses instantly",
  },
];

export default function OnboardingScreen({ onComplete }: { onComplete: () => void }) {
  const [current, setCurrent] = useState(0);

  const handleNext = () => {
    if (current < slides.length - 1) {
      setCurrent(current + 1);
    } else {
      localStorage.setItem("hl_onboarded", "1");
      onComplete();
    }
  };

  const slide = slides[current];
  const Icon = slide.icon;
  const isLast = current === slides.length - 1;

  return (
    <div className="fixed inset-0 z-[300] bg-gradient-to-br from-lens-accent via-blue-600 to-blue-800 flex flex-col items-center justify-center px-8">
      <div className="flex-1 flex flex-col items-center justify-center max-w-sm w-full">
        <div className="w-28 h-28 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center mb-8">
          <Icon className="w-14 h-14 text-white" strokeWidth={1.5} />
        </div>

        <h2 className="text-[28px] font-bold text-white text-center mb-3">{slide.title}</h2>
        <p className="text-[16px] text-white/75 text-center leading-relaxed">{slide.subtitle}</p>
      </div>

      <div className="pb-16 w-full max-w-sm">
        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? "w-8 bg-white" : "w-2 bg-white/30"
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="w-full py-4 rounded-2xl bg-white text-lens-accent text-[17px] font-bold active:scale-[0.97] transition-all flex items-center justify-center gap-2 shadow-lg"
          type="button"
        >
          {isLast ? "Get Started" : "Next"}
          {!isLast && <ChevronRight className="w-5 h-5" />}
        </button>

        {!isLast && (
          <button
            onClick={() => {
              localStorage.setItem("hl_onboarded", "1");
              onComplete();
            }}
            className="w-full mt-3 py-2 text-[14px] text-white/50 font-medium"
            type="button"
          >
            Skip
          </button>
        )}
      </div>
    </div>
  );
}
