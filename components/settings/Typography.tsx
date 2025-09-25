import { fontFamilyOptions, fontSizeOptions, fontWeightName, fontWeightOptions } from "@/constants";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  LineHeightIcon,
  TextAlignCenterIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
} from "@radix-ui/react-icons";
import { Select, ToggleGroup } from "radix-ui";
import React from "react";
type TypographyProps = {
  lineHeight: string;
  textAlign: string;
  fontSize: string;
  fontFamily: string;
  fontWeight: string;
  isEditingRef: React.MutableRefObject<boolean>;
  handleInputChange: (property: string, value: string | boolean) => void;
};
const Typography = ({
  lineHeight,
  textAlign,
  fontSize,
  fontFamily,
  fontWeight,
  isEditingRef,
  handleInputChange,
}: TypographyProps) => {
  console.log("Rendering Typography with:", {
    lineHeight,
    textAlign,
    fontSize,
    fontFamily,
    fontWeight,
  });
  return (
    <section className="flex flex-col px-5 py-3 border-t border-border gap-3 ">
      <h4 className="text-xs ">Typography</h4>
      <div className="grid grid-cols-2 gap-x-2 gap-y-1">
        <TypographySelect
          attribute="fontFamily"
          value={fontFamily}
          handleInputChange={handleInputChange}
          options={fontFamilyOptions}
          placeholder="Font Family"
          className="col-span-2"
        />
        <TypographySelect
          attribute="fontWeight"
          value={fontWeight}
          handleInputChange={handleInputChange}
          options={[...fontWeightOptions[fontFamily as keyof typeof fontWeightOptions]]}
          placeholder="Font Weight"
          className=""
        />
        <TypographySelect
          attribute="fontSize"
          value={fontSize}
          handleInputChange={handleInputChange}
          options={fontSizeOptions}
          placeholder="Font Size"
          className=""
        />
        <AlignToggle value={textAlign} handleInputChange={handleInputChange} />
        <div className="input-container items-center" title="Line Height">
          <label className="text-xs" htmlFor="lineHeight">
            <LineHeightIcon />
          </label>
          <input
            type="number"
            id="lineHeight"
            value={lineHeight}
            placeholder="Line Height"
            onChange={(e) => {
              if (!isEditingRef.current) isEditingRef.current = true;
              handleInputChange("lineHeight", e.target.value);
            }}
            className="input-field"
          />
        </div>
      </div>
    </section>
  );
};

export default Typography;
type TypographySelectProps = {
  className?: string;
  placeholder: string;
  attribute: string;
  value: string;
  options: { label: string; value: string }[];
  handleInputChange: (property: string, value: string | boolean) => void;
};
const TypographySelect = ({
  value,
  className,
  handleInputChange,
  options,
  placeholder,
  attribute,
}: TypographySelectProps) => {
  const style = attribute === "fontFamily" ? { fontFamily: value } : {};
  return (
    <Select.Root
      value={value}
      onValueChange={(value) => {
        handleInputChange(attribute, value);
      }}
    >
      <Select.Trigger
        className={`inline-flex input-container justify-between px-2 text-xs no-ring select ${className}`}
        aria-label={attribute}
      >
        <Select.Value placeholder={placeholder}>
          <span style={style} className="transition duration-150 ">
            {attribute === "fontWeight"
              ? fontWeightName[value as keyof typeof fontWeightName] || value
              : value || placeholder}
          </span>
        </Select.Value>

        <Select.Icon className="text-white">
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          side="bottom"
          position="popper"
          className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[side=bottom]:translate-y-2
               backdrop-blur-xl bg-primary/10 border border-primary/30 rounded-md shadow-md overflow-hidden relative z-50 max-h-[180px] min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto
            "
        >
          <Select.ScrollUpButton className="flex h-[14px] items-center justify-center bg-primary/20 cursor-default">
            <ChevronUpIcon />
          </Select.ScrollUpButton>
          <Select.Viewport className=" h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1">
            {options.map((elem) => (
              <Select.Item
                value={elem.value}
                key={elem.value}
                className={`flex h-fit justify-between gap-10  px-4 py-2 focus:border-none no-ring cursor-pointer hover:bg-secondary rounded-md `}
              >
                <div className="group flex items-center gap-2">
                  <p className={`text-sm `} style={elem.value ? { fontFamily: elem.value } : {}}>
                    {elem.label}
                  </p>
                </div>
              </Select.Item>
            ))}
          </Select.Viewport>
          <Select.ScrollDownButton className="flex h-[14px] items-center justify-center bg-primary/20 cursor-default">
            <ChevronDownIcon />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};
type AlignToggleProps = {
  value: string;
  handleInputChange: (property: string, value: string | boolean) => void;
};
const AlignToggle = ({ value, handleInputChange }: AlignToggleProps) => {
  return (
    <ToggleGroup.Root
      className="input-container select grid grid-cols-3 gap-1 p-0!"
      type="single"
      value={value}
      onValueChange={(value) => handleInputChange("textAlign", value)}
    >
      <ToggleGroup.Item
        className="toggle-group-item"
        value="left"
        aria-label="Left aligned"
        title="Align Left"
      >
        <TextAlignLeftIcon />
      </ToggleGroup.Item>
      <ToggleGroup.Item
        className="toggle-group-item"
        value="center"
        aria-label="Center aligned"
        title="Align Center"
      >
        <TextAlignCenterIcon />
      </ToggleGroup.Item>
      <ToggleGroup.Item
        className="toggle-group-item"
        value="right"
        aria-label="Right aligned"
        title="Align Right"
      >
        <TextAlignRightIcon />
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  );
};
