import React from "react";
import { DEFAULT_FILL_COLOR } from "@/lib/shapes";
import { normalizeHex } from "@/lib/utils";

type FillProps = {
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  fill: string; // canonical color from store/canvas
  objectType: string;
  isEditingRef: React.MutableRefObject<boolean>;
  handleInputChange: (property: string, value: string | boolean) => void;
};

const Fill = ({ inputRef, fill, objectType, isEditingRef, handleInputChange }: FillProps) => {
  //Since HEX input can be invalid while typing, we need local state
  const [textHex, setTextHex] = React.useState(fill || DEFAULT_FILL_COLOR);
  // Remember the last valid hex to revert to on blur
  const [lastValidHex, setLastValidHex] = React.useState(
    normalizeHex(fill) || normalizeHex(DEFAULT_FILL_COLOR) || "#d9d9d9"
  );

  // keep local state in sync when selection changes and user isn't editing
  React.useEffect(() => {
    if (!isEditingRef.current) {
      const norm = normalizeHex(fill) || lastValidHex;
      setTextHex(norm);
      setLastValidHex(norm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fill]); // we only want to respond to fill changes, not lastValidHex or isEditingRef

  const commit = (raw: string) => {
    const norm = normalizeHex(raw);
    if (norm) {
      setTextHex(norm);
      setLastValidHex(norm);
      handleInputChange("fill", norm);
    } else {
      // revert visually to the last valid one
      setTextHex(lastValidHex);
      handleInputChange("fill", lastValidHex);
    }
  };

  return (
    <section className="flex flex-col px-5 py-3 border-t border-border gap-3">
      <h4 className="text-xs">Fill</h4>
      <div className="grid grid-cols-1 gap-x-2 gap-y-1 w-full">
        <div className="input-container items-center" title="Fill">
          {/* Color input: always feed a valid #rrggbb to avoid console errors */}
          <input
            type="color"
            value={lastValidHex}
            ref={inputRef}
            disabled={objectType === "image" || objectType === "line"}
            onChange={(e) => {
              if (!isEditingRef.current) isEditingRef.current = true;
              const v = e.target.value; // always valid #rrggbb
              setTextHex(v);
              setLastValidHex(v);
              handleInputChange("fill", v);
            }}
            onBlur={() => {
              isEditingRef.current = false;
            }}
            className="w-6 h-6 p-0 border-none bg-transparent cursor-pointer"
          />

          {/* Text input: can be invalid while typing; we only commit valid values */}
          <input
            type="text"
            id="fill"
            value={textHex}
            placeholder={DEFAULT_FILL_COLOR || "#d9d9d9"}
            spellCheck={false}
            disabled={objectType === "image" || objectType === "line"}
            onChange={(e) => {
              if (!isEditingRef.current) isEditingRef.current = true;
              setTextHex(e.target.value);
              // live-commit when it becomes valid
              const norm = normalizeHex(e.target.value);
              if (norm) {
                setLastValidHex(norm);
                handleInputChange("fill", norm);
              }
            }}
            // Commit on blur (revert if invalid)
            onBlur={() => {
              isEditingRef.current = false;
              commit(textHex);
            }}
            className="input-field uppercase"
          />
        </div>
      </div>
    </section>
  );
};

export default Fill;
