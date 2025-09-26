import * as React from "react";
import { ContextMenu } from "radix-ui";
import { ChevronRightIcon } from "@radix-ui/react-icons";
const contextOptions = [
  { name: "Paste here", shortcut: "" },
  {
    name: "Cursor Chat",
    shortcut: "/",
  },
  {
    name: "Reactions",
    shortcut: "E",
  },
  {
    name: "Show/Hide UI",
    shortcut: "⌘ + I",
  },
  {
    name: "Redo",
    shortcut: "⌘ + Shift + Z",
  },
  {
    name: "Undo",
    shortcut: "⌘ + Z",
  },
  { name: "Show/Hide", shortcut: "⌘ + Alt + H" },
  {
    name: "Copy",
    shortcut: "⌘ + C",
  },
  {
    name: "Paste",
    shortcut: "⌘ + V",
  },
  {
    name: "Cut",
    shortcut: "⌘ + X",
  },
  //   TODO implement these features
  //   {
  //     name: "Send to back",
  //     shortcut: "[",
  //   },
  //   { name: "Bring to front", shortcut: "]" },
];
const Context = ({
  children,
  handleContextMenuLiveAction,
  handleMenuContextCanvasAction,
  itemSelected,
}: {
  children: React.ReactNode;
  handleContextMenuLiveAction: (action: string) => void;
  handleMenuContextCanvasAction: (action: string) => void;
  itemSelected: boolean;
}) => {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger className="relative flex h-full w-full flex-1 items-center justify-center">
        {children}
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content
          id="context-menu"
          loop={true}
          className="data-[state=open]:context-menu-open data-[state=closed]:context-menu-close context-menu-style
          transform-origin-[var(--radix-context-menu-content-transform-origin)]
          w-(var(--radix-context-menu-trigger-width)) min-w-[12rem]
       "
        >
          {contextOptions.slice(0, 1).map((option) => (
            <ContextMenu.Item
              key={option.name}
              className="context-menu-item"
              onClick={() => handleMenuContextCanvasAction(option.name)}
            >
              <p>{option.name}</p>
              <p className="text-text-muted">{option.shortcut}</p>
            </ContextMenu.Item>
          ))}
          {contextOptions.slice(1, 3).map((option) => (
            <ContextMenu.Item
              key={option.name}
              className="context-menu-item"
              onClick={() => handleContextMenuLiveAction(option.name)}
            >
              <p>{option.name}</p>
              <p className="text-text-muted">{option.shortcut}</p>
            </ContextMenu.Item>
          ))}
          <ContextMenu.Separator className="h-px bg-border my-1 mx-2" />
          {contextOptions.slice(3, 6).map((option) => (
            <ContextMenu.Item
              key={option.name}
              className="context-menu-item"
              onClick={() => handleMenuContextCanvasAction(option.name)}
            >
              <p>{option.name}</p>
              <p className="text-text-muted">{option.shortcut}</p>
            </ContextMenu.Item>
          ))}
          {/* Only will use it when item is selected */}
          {itemSelected && (
            <>
              {/* TODO  implement bring front and back functionality  */}
              {/* {contextOptions.slice(10).map((option) => (
                <ContextMenu.Item
                  key={option.name}
                  className="context-menu-item"
                  onClick={() => handleMenuContextCanvasAction(option.name)}
                >
                  <p>{option.name}</p>
                  <p className="text-text-muted">{option.shortcut}</p>
                </ContextMenu.Item>
              ))} */}
              <ContextMenu.Separator className="h-px bg-border my-1 mx-2" />
              <ContextMenu.Sub>
                <ContextMenu.SubTrigger className="context-menu-item">
                  Editing
                  <div className="ml-auto pl-5 text-mauve11 group-data-[disabled]:text-mauve8 group-data-[highlighted]:text-white">
                    <ChevronRightIcon />
                  </div>
                </ContextMenu.SubTrigger>
                <ContextMenu.Portal>
                  <ContextMenu.SubContent
                    sideOffset={4}
                    className="context-menu-style transform-origin-[var(--radix-context-menu-content-transform-origin)]
              -translate-y-1/3 data-[state=open]:slide-from-left
              "
                  >
                    {contextOptions.slice(6, 10).map((option) => (
                      <ContextMenu.Item
                        key={option.name}
                        className="context-menu-item"
                        onClick={() => handleMenuContextCanvasAction(option.name)}
                      >
                        <p>{option.name}</p>
                        <p className="text-text-muted">{option.shortcut}</p>
                      </ContextMenu.Item>
                    ))}
                  </ContextMenu.SubContent>
                </ContextMenu.Portal>
              </ContextMenu.Sub>
            </>
          )}
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
};

export default Context;
