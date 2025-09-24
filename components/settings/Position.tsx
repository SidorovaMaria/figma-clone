import React from "react";
import InputElement from "./InputElement";
import Image from "next/image";
const positionOptions = [
  { label: "X", property: "x", placeholder: "0" },
  { label: "Y", property: "y", placeholder: "0" },
  { label: "Angle", property: "angle", iconSrc: "/assets/angle.svg", placeholder: "0" },
];
type PositionProps = {
  x: string;
  y: string;

  angle: string;
  isEditingRef: React.MutableRefObject<boolean>;
  handleInputChange: (property: string, value: string | boolean) => void;
};
const Position = ({ x, y, angle, isEditingRef, handleInputChange }: PositionProps) => {
  return (
    <section className="flex flex-col px-5 py-3 border-t border-border gap-3">
      <h4 className="text-xs uppercase">Position</h4>
      <div className="grid grid-cols-2 gap-x-2 gap-y-1">
        {positionOptions.map(({ label, property, iconSrc, placeholder }) => (
          <div className="input-container" key={property}>
            <label className="text-xs" htmlFor={property}>
              {iconSrc ? <Image src={iconSrc} alt={label} width={24} height={24} /> : label}
            </label>
            <input
              type="number"
              id={property}
              value={property === "x" ? x : property === "y" ? y : angle}
              placeholder={placeholder}
              onChange={(e) => {
                if (!isEditingRef.current) isEditingRef.current = true;
                handleInputChange(property, e.target.value);
              }}
              className="input-field"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Position;
