"use client";
import React, { useCallback, useEffect, useState } from "react";
import LiveCursors from "./cursor/LiveCursors";
import {
  useBroadcastEvent,
  useEventListener,
  useMyPresence,
  useOthers,
} from "@liveblocks/react/suspense";
import { CursorMode, CursorState, Reaction, ReactionEvent } from "@/types/type";
import useInterval from "@/hooks/useInterval";
import FlyingReaction from "./reaction/FlyingReaction";
import CursorChat from "./cursor/CursorChat";
import ReactionSelector from "./reaction/ReactionSelector";

const Live = () => {
  const others = useOthers();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [{ cursor }, updateMyPresence] = useMyPresence() as any;
  const broadcast = useBroadcastEvent();
  const [state, setState] = useState<CursorState>({ mode: CursorMode.Hidden });
  const [reactions, setReactions] = useState<Reaction[]>([]);

  const setReaction = useCallback((reaction: string) => {
    setState({ mode: CursorMode.Reaction, reaction, isPressed: false });
  }, []);

  //Remove reaction that are not visible anymore ( every 1 second)
  useInterval(() => {
    setReactions((reactions) =>
      reactions.filter((reaction) => reaction.timestamp > Date.now() - 4000)
    );
  }, 1000);

  // This useInterval hook repeatedly runs the provided callback every 100ms.
  // When the cursor is in "Reaction" mode, pressed, and exists,
  // it adds a new reaction at the cursor's position and broadcasts it.
  // This enables real-time reaction feedback as long as the user is interacting.
  useInterval(() => {
    if (state.mode === CursorMode.Reaction && state.isPressed && cursor) {
      setReactions((reactions) =>
        reactions.concat([
          {
            point: { x: cursor.x, y: cursor.y },
            value: state.reaction,
            timestamp: Date.now(),
          },
        ])
      );
      broadcast({
        x: cursor.x,
        y: cursor.y,
        value: state.reaction,
      });
    }
  }, 100);

  //Bind Events
  useEffect(() => {
    function onKeyUp(e: KeyboardEvent) {
      if (e.key === "/") {
        setState({
          mode: CursorMode.Chat,
          previousMessage: null,
          message: "",
        });
      } else if (e.key === "Escape") {
        updateMyPresence({ message: "" });
        setState({ mode: CursorMode.Hidden });
      } else if (e.key === "e") {
        setState({ mode: CursorMode.ReactionSelector });
      }
    }
    window.addEventListener("keyup", onKeyUp);

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "/") {
        e.preventDefault();
      }
    }
    window.addEventListener("keydown", onKeyDown);

    //Clear event
    return () => {
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [updateMyPresence]);

  useEventListener((eventData) => {
    const event = eventData.event as ReactionEvent;
    setReactions((reactions) =>
      reactions.concat([
        {
          point: { x: event.x, y: event.y },
          value: event.value,
          timestamp: Date.now(),
        },
      ])
    );
  });
  //Track Pointer of the screen

  function handlePointerMove(event: React.PointerEvent) {
    event.preventDefault();
    if (cursor == null || state.mode !== CursorMode.ReactionSelector) {
      const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
      const y = event.clientY - event.currentTarget.getBoundingClientRect().y;
      updateMyPresence({
        cursor: { x, y },
      });
    }
  }

  function handlePointerLeave(event: React.PointerEvent) {
    setState({
      mode: CursorMode.Hidden,
    });
    event.preventDefault();
    updateMyPresence({
      cursor: null,
    });
  }

  function handlePointerDown(event: React.PointerEvent) {
    const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
    const y = event.clientY - event.currentTarget.getBoundingClientRect().y;
    updateMyPresence({
      cursor: { x, y },
    });
    setState((state) =>
      state.mode === CursorMode.Reaction ? { ...state, isPressed: true } : state
    );
  }
  const handlePointerUp = () => {
    setState((state) =>
      state.mode === CursorMode.Reaction ? { ...state, isPressed: false } : state
    );
  };
  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      className="h-[100vh] w-full flex justify-center items-center text-center"
      style={{ cursor: state.mode === CursorMode.Chat ? "none" : "" }}
    >
      <h1 className="text-2xl">LiveBlocks Figma Clone</h1>
      {reactions.map((reaction) => {
        return (
          <FlyingReaction
            key={reaction.timestamp.toString()}
            x={reaction.point.x}
            y={reaction.point.y}
            timestamp={reaction.timestamp}
            value={reaction.value}
          />
        );
      })}
      {cursor && (
        <div
          className="absolute top-0 left-0"
          style={{
            transform: `translateX(${cursor.x}px) translateY(${cursor.y}px)`,
          }}
        >
          {state.mode === CursorMode.Chat && (
            <>
              <CursorChat state={state} setState={setState} updateMyPresence={updateMyPresence} />
            </>
          )}
          {state.mode === CursorMode.ReactionSelector && (
            <ReactionSelector
              setReaction={(reaction) => {
                setReaction(reaction);
              }}
            />
          )}
          {state.mode === CursorMode.Reaction && (
            <div className="pointer-events-none absolute top-3.5 left-1 select-none">
              {state.reaction}
            </div>
          )}
        </div>
      )}

      <LiveCursors others={others} />
    </div>
  );
};

export default Live;
