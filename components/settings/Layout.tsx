import React from "react";
import InputElement from "./InputElement";
import Image from "next/image";
const layoutOptions = [
  { label: "W", property: "width", placeholder: "0" },
  { label: "H", property: "height", placeholder: "0" },
];
type LayoutProps = {
  width: string;
  height: string;
  isEditingRef: React.MutableRefObject<boolean>;
  handleInputChange: (property: string, value: string | boolean) => void;
};
const Layout = ({ width, height, isEditingRef, handleInputChange }: LayoutProps) => {
  return (
    <section className="flex flex-col px-5 py-3 border-t border-border gap-3">
      <h4 className="text-xs uppercase">Layout</h4>
      <div className="grid grid-cols-2">
        {layoutOptions.map(({ label, property, placeholder }) => (
          <div
            className="flex flex-row gap-1 w-fit mb-2 bg-primary/20 p-1 rounded-md"
            key={property}
          >
            <label className="text-xs" htmlFor={property}>
              {label}
            </label>
            <input
              type="number"
              id={property}
              value={property === "width" ? width : height}
              placeholder={placeholder}
              onChange={(e) => {
                if (!isEditingRef.current) isEditingRef.current = true;
                handleInputChange(property, e.target.value);
              }}
              className="w-16 bg-transparent text-xs outline-none border border-border rounded px-1"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Layout;
