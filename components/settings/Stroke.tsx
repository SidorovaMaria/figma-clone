import { DEFAULT_FILL_COLOR } from "@/lib/shapes";
import { normalizeHex } from "@/lib/utils";
import { BorderWidthIcon } from "@radix-ui/react-icons";
import React, { useEffect } from "react";
type StrokeProps = {
  stroke: string;
  strokeWidth: string;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  objectType?: string;
  isEditingRef: React.MutableRefObject<boolean>;
  handleInputChange: (property: string, value: string | boolean) => void;
};
const Stroke = ({
  stroke,
  strokeWidth,
  inputRef,
  objectType,
  isEditingRef,
  handleInputChange,
}: StrokeProps) => {
  //Since HEX input can be invalid while typing, we need local state
  const [textHex, setTextHex] = React.useState(stroke || "");
  // Remember the last valid hex to revert to on blur
  const [lastValidHex, setLastValidHex] = React.useState(
    normalizeHex(stroke) || normalizeHex(DEFAULT_FILL_COLOR) || "#d9d9d9"
  );

  // keep local state in sync when selection changes and user isn't editing
  React.useEffect(() => {
    if (!isEditingRef.current) {
      const norm = normalizeHex(stroke) || lastValidHex;
      setTextHex(norm);
      setLastValidHex(norm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stroke]); // we only want to respond to stroke changes, not lastValidHex or isEditingRef

  const commit = (raw: string) => {
    const norm = normalizeHex(raw);
    if (norm) {
      setTextHex(norm);
      setLastValidHex(norm);
      handleInputChange("stroke", norm);
    } else {
      // revert visually to the last valid one
      setTextHex(lastValidHex);
      handleInputChange("stroke", lastValidHex);
    }
  };

  return (
    <section className="flex flex-col px-5 py-3 border-t border-border gap-3">
      <h4 className="text-xs ">Stroke</h4>
      <div className="grid grid-cols-[5fr_4fr] gap-x-2 gap-y-1">
        <div className="input-container items-center pr-0.5 gap-x-0.5!" title="Fill">
          {/* Color input: always feed a valid #rrggbb to avoid console errors */}
          <input
            onBlur={() => {
              isEditingRef.current = false;
            }}
            type="color"
            value={lastValidHex}
            ref={inputRef}
            disabled={objectType === "image" || strokeWidth === "0"}
            onChange={(e) => {
              const v = e.target.value; // always valid #rrggbb
              setTextHex(v);
              setLastValidHex(v);
              handleInputChange("stroke", v);
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
            disabled={objectType === "image"}
            onChange={(e) => {
              if (!isEditingRef.current) isEditingRef.current = true;
              setTextHex(e.target.value);
              // live-commit when it becomes valid
              const norm = normalizeHex(e.target.value);
              if (norm) {
                setLastValidHex(norm);
                handleInputChange("stroke", norm);
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
        <div className="input-container items-center" title="Line Height">
          <label className="text-xs" htmlFor="lineHeight">
            <BorderWidthIcon />
          </label>
          <input
            type="number"
            id="strokeWidth"
            value={strokeWidth}
            placeholder="Stroke Width"
            onChange={(e) => {
              handleInputChange("strokeWidth", e.target.value);
            }}
            onBlur={() => {
              isEditingRef.current = false;
            }}
            className="input-field"
          />
          <span className="ml-1 text-xs text-muted-foreground">px</span>
        </div>
      </div>
    </section>
  );
};

export default Stroke;
