"use client";

import { useState, useRef, useCallback } from "react";

export function useCamera() {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const openCamera = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setPhotoUrl(ev.target?.result as string); };
    reader.readAsDataURL(file);
    e.target.value = "";
  }, []);

  return { photoUrl, setPhotoUrl, inputRef, openCamera, handleFileChange };
}
