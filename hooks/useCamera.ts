"use client";

import { useState, useRef, useCallback } from "react";

function compressImage(dataUrl: string, maxWidth: number, quality: number): Promise<string> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(dataUrl); return; }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

export function useCamera() {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const openCamera = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const raw = ev.target?.result as string;
      const compressed = await compressImage(raw, 1200, 0.8);
      const thumb = await compressImage(raw, 200, 0.5);
      setPhotoUrl(compressed);
      setThumbnailUrl(thumb);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }, []);

  return { photoUrl, setPhotoUrl, thumbnailUrl, setThumbnailUrl, inputRef, openCamera, handleFileChange };
}