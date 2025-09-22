import { LiveCursorProps } from "@/types/type";
import React from "react";

import { COLORS } from "@/constants";
import CursorSVG from "@/public/assets/CursorSVG";

const LiveCursors = ({ others }: LiveCursorProps) => {
  return others.map(({ connectionId, presence }) => {
    if (presence == null || !presence?.cursor) {
      return null;
    }
    const color = COLORS[Number(connectionId) % COLORS.length];
    const x = presence.cursor.x;
    const y = presence.cursor.y;
    const message = presence.mode === "chat" ? presence.message : undefined;
    return (
      <div
        key={connectionId}
        className="pointer-events-none absolute top-0 left-0"
        style={{
          transform: `translateX(${x}px) translateY(${y}px)`,
        }}
      >
        <CursorSVG color={color} />
        {message && (
          <div
            className="absolute top-5 left-2 px-4 py-2 text-sm leading-relaxed text-text"
            style={{ backgroundColor: color, borderRadius: 10 }}
          >
            <p className="whitespace-nowrap text-sm text-background">{message}</p>
          </div>
        )}
      </div>
    );
  });
};

export default LiveCursors;
