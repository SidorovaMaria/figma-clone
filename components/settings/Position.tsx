import React from "react";
import Image from "next/image";
import { AngleIcon } from "@radix-ui/react-icons";
const positionOptions = [
  { label: "X", property: "x", placeholder: "0" },
  { label: "Y", property: "y", placeholder: "0" },
  { label: "Angle", property: "angle", Icon: AngleIcon, placeholder: "0" },
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
      <h4 className="text-xs ">Position</h4>
      <div className="grid grid-cols-2 gap-x-2 gap-y-1">
        {positionOptions.map(({ label, property, Icon, placeholder }) => (
          <div className="input-container" key={property}>
            <label className="text-xs" htmlFor={property}>
              {Icon ? <Icon /> : label}
            </label>
            <input
              type="number"
              id={property}
              value={property === "x" ? x : property === "y" ? y : angle}
              placeholder={placeholder}
              onChange={(e) => {
                handleInputChange(property, e.target.value);
              }}
              onBlur={() => {
                isEditingRef.current = false;
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
