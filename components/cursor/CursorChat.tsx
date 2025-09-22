import CursorSVG from "@/public/assets/CursorSVG";
import { CursorMode, CursorState } from "@/types/type";
import React, { useCallback } from "react";
type Props = {
  state: {
    mode: CursorMode;
    message: string;
    previousMessage: string | null;
  };
  updateMyPresence: (state: Partial<CursorState>) => void;
  setState: React.Dispatch<React.SetStateAction<CursorState>>;
};
const CursorChat = ({ state, setState, updateMyPresence }: Props) => {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        setState({
          mode: CursorMode.Chat,
          previousMessage: state.message,
          message: "",
        });
      } else if (e.key === "Escape") {
        setState({
          mode: CursorMode.Hidden,
        });
      }
    },
    [state.message, setState]
  );

  return (
    <>
      <CursorSVG color="#fff" />
      <div
        className="absolute top-5 left-2 bg-secondary px-4 py-2 text-sm leading-relaxed text-text"
        onKeyUp={(e) => e.stopPropagation()}
        style={{
          borderRadius: 10,
        }}
      >
        {state.previousMessage && <p className="w-full text-left">{state.previousMessage}</p>}
        <input
          className="w-60 border-none	bg-transparent text-white placeholder-text/50 outline-none "
          autoFocus={true}
          onChange={(e) => {
            updateMyPresence({ message: e.target.value });
            setState({
              mode: CursorMode.Chat,
              previousMessage: null,
              message: e.target.value,
            });
          }}
          onKeyDown={handleKeyDown}
          placeholder={state.previousMessage ? "" : "Say something..."}
          value={state.message}
          maxLength={50}
        />
      </div>
    </>
  );
};

export default CursorChat;
