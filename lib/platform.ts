import { Capacitor } from "@capacitor/core";

export function isNative(): boolean {
  try {
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

export function isIOS(): boolean {
  try {
    return Capacitor.getPlatform() === "ios";
  } catch {
    return false;
  }
}

export function isWeb(): boolean {
  return !isNative();
}
