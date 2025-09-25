/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useStorage } from "@liveblocks/react";

export const COLLAB_ENABLED = true; // flip to true when you want realtime collaboration

// live-sync shims
export const useCanvasObjects = COLLAB_ENABLED
  ? () => useStorage((root) => root.canvasObjects)
  : () => localCanvasObjectsRef.current; // a Map<string, any> you manage locally

// 2) Tiny local "storage" to mirror Liveblocks' map shape when offline
const localStorageRoot: { canvasObjects: Map<string, any> } = {
  canvasObjects: new Map<string, any>(),
};
const localCanvasObjectsRef = { current: localStorageRoot.canvasObjects };

// 3) Hook-compatible shim: uses Liveblocks when enabled, local Map when not
export const useSyncMutation = COLLAB_ENABLED
  ? useMutation
  : // same signature as useMutation(fn, deps)
    (fn: any) =>
      // return a stable callback (like useMutation would)
      (...args: any[]) => {
        const storage = {
          get: (k: "canvasObjects") => localStorageRoot[k],
        };
        return fn({ storage } as any, ...args);
      };
// 4) Optional: skip no-op writes to save quota when COLLAB_ENABLED=true
export const fastEqual = (a: any, b: any) => a === b || JSON.stringify(a) === JSON.stringify(b);
