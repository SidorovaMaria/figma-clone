"use client";
import { useEffect, useRef } from "react";

export type KeyHandler = (e: KeyboardEvent) => void;
export type ShortcutMap = Record<string, KeyHandler>;
export interface UseShortcutOptions {
  enabled?: boolean;
  preventDefault?: boolean;
}

export interface UseShortcutParams {
  bindings: ShortcutMap;
  options?: UseShortcutOptions;
}

export function useShortcut({ bindings, options }: UseShortcutParams) {
  const enabled = options?.enabled ?? true;
  const preventDefault = options?.preventDefault ?? false;
  const bindingsRef = useRef<ShortcutMap>(bindings);
  bindingsRef.current = bindings;
  useEffect(() => {
    if (!enabled) return;
    const isEditableElement = (element: Element | null) => {
      if (!element || !(element instanceof HTMLElement)) return false;
      const tag = element.tagName;
      return tag === "INPUT" || tag === "TEXTAREA" || (element as HTMLElement).isContentEditable;
    };
    const onKeyDown = (e: KeyboardEvent) => {
      //Ignore if typing or holding
      if (isEditableElement(e.target as Element) || e.repeat) return;
      //Key is sensitive for all the components
      const handler = bindingsRef.current[e.key];
      if (handler) {
        if (preventDefault) e.preventDefault();
        handler(e);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [enabled, preventDefault]);
}
