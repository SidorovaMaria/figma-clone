/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { navElements } from "@/constants";
import { useShortcut } from "@/hooks/useShortcut";
import { toolBarShortcuts } from "@/lib/key-events";
import { ActiveElement, shapeElement } from "@/types/type";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { NavigationMenu, Select } from "radix-ui";

import React, { useEffect, useMemo } from "react";
type ToolsBarProps = {
  activeElement: ActiveElement;
  handleActiveElement: (element: ActiveElement) => void;
};

// Creating using RADIX UI
const ToolsBar = ({ handleActiveElement, activeElement }: ToolsBarProps) => {
  //KEYBOARD SHORTCUTS
  useShortcut({
    bindings: toolBarShortcuts(handleActiveElement),
    options: { preventDefault: true },
  });
  const isActive = useMemo(
    () => (value: string | Array<ActiveElement>) =>
      (activeElement && activeElement.value === value) ||
      (Array.isArray(value) && value.some((v) => v?.value === activeElement?.value)),
    [activeElement]
  );
  return (
    <NavigationMenu.Root>
      <NavigationMenu.List className="center flex list-none rounded-md  m-2.5 p-0.5 gap-1.5">
        {navElements.map((item: ActiveElement | any) => (
          <NavigationMenu.Item
            key={item?.name}
            onClick={() => {
              if (Array.isArray(item?.value)) return; // shapes handled by <ShapesMenu/>
              handleActiveElement(item as ActiveElement);
            }}
            className={`group px-2.5 py-2.5 rounded-md flex justify-center items-center cursor-pointer min-w-10 h-10
                ${isActive(item?.value) ? "bg-secondary" : "hover:bg-secondary/50"}`}
          >
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
  const options = item.value; // array of shape options (leaf items)
  const selectedValue = options.some((o: shapeElement) => o?.value === activeElement?.value)
    ? (activeElement.value as string)
    : (options[0]?.value as string);
  return (
    <Select.Root
      value={selectedValue}
      onOpenChange={(isOpen) => {
        if (!isOpen) return;
        // when opening the dropdown, set the active element to the first option if the current active element is not in the options
        if (!options.some((o: shapeElement) => o?.value === activeElement?.value)) {
          handleActiveElement(options[0] as ActiveElement);
        }
      }}
      onValueChange={(value) => {
        const selected = options.find((o: shapeElement) => o.value === value);
        if (selected) handleActiveElement(selected);
      }}
    >
      <Select.Trigger asChild className="no-ring group">
        <button className="flex flex-row gap-0.5 justify-center items-center cursor-pointer">
          <span className="relative w-6 h-6 flex items-center justify-center ">
            <Image
              src={options.find((o: shapeElement) => o.value === selectedValue)?.icon ?? item.icon}
              alt={item.name}
              fill
              className={`${
                selectedValue ? "contrast-200" : "greyscale brightness-75"
              } group-hover:brightness-100
          group-hover:greyscale-0`}
            />
          </span>
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
          className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[side=bottom]:translate-y-4 -translate-x-8
          backdrop-blur-xl bg-muted/70 border border-primary/30 rounded-md shadow-md overflow-hidden relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto
       "
        >
          <Select.Viewport className=" h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1">
            {options.map((elem: ActiveElement) => (
              <Select.Item
                value={elem.value as string}
                key={elem.name}
                className={`flex h-fit justify-between gap-10  px-4 py-2.5 focus:border-none no-ring cursor-pointer hover:bg-secondary rounded-md `}
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
                {elem.shortcut && (
                  <p className="ml-auto text-xs text-text-muted">{elem.shortcut}</p>
                )}
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};
