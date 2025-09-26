"use client";

import { ReactNode } from "react";
import { LiveblocksProvider, RoomProvider, ClientSideSuspense } from "@liveblocks/react/suspense";
import { LiveMap } from "@liveblocks/client";
const publicApiKey = process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY;

if (!publicApiKey) {
  throw new Error("LIVEBLOCKS_PUBLIC_KEY is not defined, please provide it in the .env.local file");
}
export function Room({ children }: { children: ReactNode }) {
  return (
    <LiveblocksProvider publicApiKey={publicApiKey as string}>
      <RoomProvider
        id="my-room"
        initialPresence={{
          cursor: null,
          cursorColor: null,
          editingText: null,
        }}
        initialStorage={{
          canvasObjects: new LiveMap(),
        }}
      >
        <ClientSideSuspense fallback={<div>Loading…</div>}>{children}</ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
