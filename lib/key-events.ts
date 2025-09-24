/* eslint-disable @typescript-eslint/no-explicit-any */
import { toolBarShortCuts } from "@/constants";
import { ShortcutMap } from "@/hooks/useShortcut";
import { ActiveElement } from "@/types/type";
import { Canvas, FabricObject, util } from "fabric";
import { v4 as uuidv4 } from "uuid";
const OFFSET = 25;

export const handleCopy = (canvas: fabric.Canvas) => {
  const activeObjects = canvas.getActiveObjects();
  const activeObject = canvas.getActiveObject();
  let serializedObjects;
  if (activeObjects.length === 1) {
    // Serialize the selected objects
    serializedObjects = activeObjects.map((obj) => obj.toObject());
    // Store the serialized objects in the clipboard
    localStorage.setItem("clipboard", JSON.stringify(serializedObjects));
  } else if (activeObjects.length > 1) {
    serializedObjects = activeObject?.toObject();
    localStorage.setItem("clipboard", JSON.stringify(serializedObjects));
  }
  return activeObjects;
};
export const handlePaste = async (
  canvas: Canvas,
  syncShapeInStorage: (object: FabricObject) => void
) => {
  const clipboard = localStorage.getItem("clipboard");
  if (!clipboard) return;
  const serialized = JSON.parse(clipboard);
  try {
    if (serialized.type !== "ActiveSelection") {
      const obj = await util.enlivenObjects<FabricObject>(serialized);
      if (!obj || obj.length === 0) return;
      for (const o of obj) {
        o.set({ left: (o.left ?? 0) + OFFSET, top: (o.top ?? 0) + OFFSET, objectId: uuidv4() });
        canvas.add(o as any);
        syncShapeInStorage(o as any);
        canvas.setActiveObject(o as any);
        canvas.requestRenderAll();
      }
    } else {
      //Due to the fact that once there are more active objects and their position stores relative to the active selection center we need to calculate the center of the active selection and then position each object relative to that center
      const activeSelectionCenterX = serialized.left + serialized.width / 2;
      const activeSelectionCenterY = serialized.top + serialized.height / 2;

      const objects = await util.enlivenObjects<FabricObject>(serialized.objects);
      for (const obj of objects) {
        const newLeft = activeSelectionCenterX + obj.left;
        const newTop = activeSelectionCenterY + obj.top;
        obj.set({ left: newLeft + OFFSET, top: newTop + OFFSET, objectId: uuidv4() });
        canvas.add(obj as any);
        syncShapeInStorage(obj as any);
        canvas.setActiveObject(obj as any);
        canvas.requestRenderAll();
      }
    }
  } catch (e) {
    console.error("Error parsing clipboard data:", e);
    return;
  }
};

export const handleDelete = (canvas: Canvas, deleteShapeFromStorage: (id: string) => void) => {
  const activeObjects = canvas.getActiveObjects();
  if (!activeObjects || activeObjects.length === 0) return;
  if (activeObjects.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    activeObjects.forEach((obj: any) => {
      if (!obj.objectId) return;
      canvas.remove(obj);
      deleteShapeFromStorage(obj.objectId);
    });
  }
  canvas.discardActiveObject();
  canvas.requestRenderAll();
};
export const toolBarShortcuts = (handleActiveElement: (element: ActiveElement) => void) => {
  const base = toolBarShortCuts;
  const map: ShortcutMap = {
    r: () => handleActiveElement(base.r),
    o: () => handleActiveElement(base.o),
    p: () => handleActiveElement(base.p),
    l: () => handleActiveElement(base.l),
    f: () => handleActiveElement(base.f),
    v: () => handleActiveElement(base.v),
    t: () => handleActiveElement(base.t),
    c: () => handleActiveElement(base.c),
    Backspace: () => handleActiveElement(base.Backspace),
    Delete: () => handleActiveElement(base.Delete),
  };
  return map;
};
type buildEditorBindingsArgs = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  canvas: Canvas | any;
  undo: () => void;
  redo: () => void;
  syncShapeInStorage: (object: FabricObject) => void;
  deleteShapeFromStorage: (id: string) => void;
};
export const buildEditorBindings = (args: buildEditorBindingsArgs): ShortcutMap => {
  const { canvas, undo, redo, syncShapeInStorage, deleteShapeFromStorage } = args;
  const isMod = (e: KeyboardEvent) => (/mac/i.test(navigator.userAgent) ? e.metaKey : e.ctrlKey);
  return {
    //Copy (MOD + C)
    c: (e) => {
      if (!isMod(e)) return;
      e.preventDefault();

      handleCopy(canvas);
    },
    v: (e) => {
      if (!isMod(e)) return;
      e.preventDefault();
      handlePaste(canvas, syncShapeInStorage);
    },
    //Cut (MOD + X)
    x: (e) => {
      if (!isMod(e)) return;
      e.preventDefault();

      handleCopy(canvas);
      handleDelete(canvas, deleteShapeFromStorage);
    },
    z: (e) => {
      if (!isMod(e) || e.shiftKey) return; // plain Mod+Z only
      e.preventDefault();

      undo();
    },
    y: (e) => {
      if (!isMod(e) || !e.shiftKey) return; // plain Mod+Y or Mod+Shift+Z
      e.preventDefault();

      redo();
    },
  };
};
