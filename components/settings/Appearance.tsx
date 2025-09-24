import React from "react";

import Image from "next/image";
const appearanceOptions = [
  { label: "opacity", property: "opacity", placeholder: "100", iconSrc: "/assets/opacity.svg" },
  { label: "Radius", property: "radius", placeholder: "0", iconSrc: "/assets/radius.svg" },
];
type LayoutProps = {
  objectType: string;
  opacity: string;
  radius: string;
  isEditingRef: React.MutableRefObject<boolean>;
  handleInputChange: (property: string, value: string | boolean) => void;
};
const Appearance = ({
  opacity,
  objectType,
  isEditingRef,
  radius,
  handleInputChange,
}: LayoutProps) => {
  return (
    <section className="flex flex-col px-5 py-3 border-t border-border gap-3">
      <h4 className="text-xs uppercase">Appearance</h4>
      <div className="grid grid-cols-2 gap-x-2 gap-y-1 w-full">
        {/* Opacity */}
        <div className="input-container items-center" title="Opacity">
          <label className="text-xs" htmlFor="opacity">
            <Image src="/assets/opacity.svg" alt="Opacity" width={24} height={24} />
          </label>
          <input
            type="number"
            id="opacity"
            step={10}
            value={Math.round(Number(opacity) * 100)}
            placeholder={"100"}
            onChange={(e) => {
              if (!isEditingRef.current) isEditingRef.current = true;
              // Convert percentage back to decimal for opacity
              const value =
                "opacity" === "opacity" ? String(Number(e.target.value) / 100) : e.target.value;
              if (Number(value) > 1) return;
              handleInputChange("opacity", value);
            }}
            className="input-field"
          />
          <span className="ml-1 text-xs text-muted-foreground">%</span>
        </div>
        {/* Radius */}
        <div className="input-container items-center" title="Corner radius">
          <label className="text-xs" htmlFor="radius">
            <Image src="/assets/radius.svg" alt="Radius" width={24} height={24} />
          </label>
          <input
            type="number"
            id="radius"
            step={10}
            value={Math.round(Number(radius))}
            placeholder={"100"}
            disabled={objectType === "rect" ? false : true}
            onChange={(e) => {
              if (!isEditingRef.current) isEditingRef.current = true;
              // Convert percentage back to decimal for radius
              const value = String(Number(e.target.value));
              handleInputChange("radius", value);
            }}
            className="input-field"
          />
        </div>
      </div>
    </section>
  );
};

export default Appearance;
