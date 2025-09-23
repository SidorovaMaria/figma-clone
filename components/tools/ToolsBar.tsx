/* eslint-disable @typescript-eslint/no-explicit-any */
import { navElements } from "@/constants";
import { ActiveElement } from "@/types/type";
import { CaretDownIcon, CheckIcon, ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { NavigationMenu, Select } from "radix-ui";

import React from "react";
type ToolsBarProps = {
  activeElement: ActiveElement;
  handleActiveElement: (element: ActiveElement) => void;
};

// Creating using RADIX UI
const ToolsBar = ({ handleActiveElement, activeElement }: ToolsBarProps) => {
  const isActive = (value: string | Array<ActiveElement>) =>
    (activeElement && activeElement.value === value) ||
    (Array.isArray(value) && value.some((val) => val?.value === activeElement?.value));
  console.log("Active Element in ToolsBar: ", activeElement);
  return (
    <NavigationMenu.Root className="">
      <NavigationMenu.List className="center flex list-none rounded-md  m-2.5 p-0.5 gap-1.5">
        {navElements.map((item: ActiveElement | any) => (
          <NavigationMenu.Item
            key={item.value}
            onClick={() => {
              if (Array.isArray(item.value)) return;
              handleActiveElement(item);
              console.log("Clicked on: ", item);
            }}
            className={`group px-2.5 py-2.5 rounded-md flex justify-center items-center cursor-pointer min-w-10 h-10
                ${isActive(item.value) ? "bg-secondary" : "hover:bg-secondary/50"}`}
          >
            {/* {item.name} */}
            {/* If its a shape Item show the trigger and content */}
            {Array.isArray(item.value) ? (
              <ShapesMenu
                item={item}
                activeElement={activeElement}
                handleActiveElement={handleActiveElement}
              />
            ) : item?.value === "comments" ? (
              <button className="relative w-5 h-5 object-contain cursor-pointer">
                <Image
                  src={item.icon}
                  alt={item.name}
                  fill
                  className={isActive(item.value) ? "contrast-200" : "greyscale brightness-75"}
                />
              </button>
            ) : (
              <button className="relative w-5 h-5 object-contain cursor-pointer">
                <Image
                  src={item.icon}
                  alt={item.name}
                  fill
                  className={isActive(item.value) ? "contrast-200" : "greyscale brightness-75"}
                />
              </button>
            )}
          </NavigationMenu.Item>
        ))}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
};

export default ToolsBar;

export const ShapesMenu = ({
  item,
  activeElement,
  handleActiveElement,
}: {
  item: ActiveElement | any;
  activeElement: ActiveElement;
  handleActiveElement: (element: ActiveElement) => void;
}) => {
  const isDropdownElem = item.value.some(
    (elem: ActiveElement) => elem?.value === activeElement?.value
  );
  return (
    <Select.Root
      value={isDropdownElem ? activeElement?.value : undefined}
      onValueChange={(value) => {
        const selected = item.value.find((elem: ActiveElement) => elem?.value === value);
        if (selected) {
          handleActiveElement(selected);
        }
      }}
    >
      <Select.Trigger asChild className="no-ring group">
        <button
          className="flex flex-row gap-0.5 justify-center items-center cursor-pointer"
          onClick={() => handleActiveElement(item)}
        >
          <div className="relative w-6 h-6 flex items-center justify-center ">
            <Image
              src={isDropdownElem ? activeElement?.icon : item.icon}
              alt={item.name}
              fill
              className={`${
                isDropdownElem ? "contrast-200" : "greyscale brightness-75"
              } group-hover:brightness-100
          group-hover:greyscale-0`}
            />
          </div>
          <Select.Icon
            className="greyscale brightness-75 transition-transform duration-300 ease-in-out group-data-[state=open]:rotate-180
          group-data-[state=closed]:rotate-0 group-hover:brightness-100
          group-hover:greyscale-0"
          >
            <ChevronDownIcon />
          </Select.Icon>
        </button>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          side="bottom"
          position="popper"
          className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[side=bottom]:translate-y-2 -translate-x-8
          backdrop-blur-lg bg-primary/30 border border-primary/30 rounded-md shadow-md overflow-hidden relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto 
       "
        >
          <Select.Viewport className=" h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1">
            {item.value.map((elem: ActiveElement) => (
              <Select.Item
                value={elem?.value as string}
                key={elem?.name}
                className={`flex h-fit justify-between gap-10  px-5 py-3 focus:border-none no-ring cursor-pointer hover:bg-secondary rounded-md disabled:pointer-events-none disabled:opacity-50 data-[highlighted]:bg-secondary data-[highlighted]:text-text`}
                disabled={elem?.value === activeElement?.value}
              >
                <div className="group flex items-center gap-2">
                  <Image
                    src={elem?.icon as string}
                    alt={elem?.name as string}
                    width={20}
                    height={20}
                  />
                  <p className={`text-sm `}>{elem?.name}</p>
                </div>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};
