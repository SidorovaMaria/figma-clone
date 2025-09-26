/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ActiveElement,
  CanvasMouseDown,
  CanvasMouseMove,
  CanvasMouseUp,
  CanvasObjectModified,
  CanvasObjectScaling,
  CanvasSelectionCreated,
  CanvasSelectionUpdated,
  RenderCanvasArgs,
} from "@/types/type";
import { Canvas, FabricObject, PencilBrush, Point, util } from "fabric";

import { createFabricShape } from "./shapes";

import { defaultNavElement } from "@/constants";
export const initializeFabric = ({
  fabricRef,
  canvasRef,
}: {
  fabricRef: React.MutableRefObject<Canvas | null>;
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
}) => {
  const canvasElement = document.getElementById("canvas") as HTMLCanvasElement;
  //create fabric canvas
  if (!canvasRef.current) {
    throw new Error("canvasRef.current is null");
  }
  const canvas = new Canvas(canvasRef.current, {
    width: canvasElement.clientWidth,
    height: canvasElement.clientHeight,
  });
  //set fabricRef to the created canvas
  fabricRef.current = canvas;
  return canvas;
};

export const renderCanvas = async ({
  fabricRef,
  canvasObjects,
  activeObjectRef,
}: RenderCanvasArgs) => {
  const canvas = fabricRef.current;
  if (!canvas) return;

  // Clear once
  canvas.clear();

  // Optional: avoid re-rendering on every add
  const prevRenderOnAddRemove = canvas.renderOnAddRemove;
  canvas.renderOnAddRemove = false;

  let objectToActivate: FabricObject | null = null;

  // v6: enlivenObjects returns a Promise< FabricObject[] >
  for (const [objectId, objectData] of Array.from(canvasObjects as Iterable<[string, any]>)) {
    const [obj] = await util.enlivenObjects<FabricObject>([objectData]); // reviver/namespace not needed in v6
    if (!obj) continue;

    canvas.add(obj as any);

    if (activeObjectRef.current?.objectId === objectId) {
      objectToActivate = obj; // set active after the batch to avoid extra layout thrash
    }
  }

  if (objectToActivate) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    canvas.setActiveObject(objectToActivate as any);
  }

  // Restore and paint once
  canvas.renderOnAddRemove = prevRenderOnAddRemove;
  canvas.requestRenderAll(); // prefer requestRenderAll over renderAll in modern Fabric
};

export const handleCanvasMouseDown = ({
  options,
  canvas,
  selectedShapeRef,
  isDrawing,
  shapeRef,
}: CanvasMouseDown) => {
  // get pointer coordinates
  const pointer = canvas.getPointer(options.e);

  /**
   * get target object i.e., the object that is clicked
   * findtarget() returns the object that is clicked
   *
   * findTarget: http://fabricjs.com/docs/fabric.Canvas.html#findTarget
   */
  const target = canvas.findTarget(options.e, false);

  // set canvas drawing mode to false
  canvas.isDrawingMode = false;

  // if selected shape is freeform, set drawing mode to true and return
  if (selectedShapeRef.current === "freeform") {
    isDrawing.current = true;
    canvas.isDrawingMode = true;
    if (!canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush = new PencilBrush(canvas);
    }

    canvas.freeDrawingBrush.width = 2;
    canvas.freeDrawingBrush.color = "#fff";
    canvas.freeDrawingBrush.drawStraightLine = true;
    canvas.freeDrawingBrush.straightLineKey = "shiftKey";

    return;
  }

  canvas.isDrawingMode = false;

  // if target is the selected shape or active selection, set isDrawing to false
  if (target && (target.type === selectedShapeRef.current || target.type === "activeSelection")) {
    isDrawing.current = false;

    // set active object to target
    canvas.setActiveObject(target);

    /**
     * setCoords() is used to update the controls of the object
     * setCoords: http://fabricjs.com/docs/fabric.Object.html#setCoords
     */
    target.setCoords();
  } else {
    isDrawing.current = true;

    // create custom fabric object/shape and set it to shapeRef
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    shapeRef.current = createFabricShape(selectedShapeRef.current, pointer as any);

    // if shapeRef is not null, add it to canvas
    if (shapeRef.current) {
      // add: http://fabricjs.com/docs/fabric.Canvas.html#add
      canvas.add(shapeRef.current);
    }
  }
};

//Handle Resize:
export const handleCanvasResize = ({ canvas }: { canvas: Canvas | null }) => {
  const canvasElement = document.getElementById("canvas") as HTMLCanvasElement;
  if (!canvas || !canvasElement) return;
  canvas.setDimensions({
    width: canvasElement.clientWidth,
    height: canvasElement.clientHeight,
  });
};
export const handleCanvasZoom = ({ options, canvas }: { options: any; canvas: fabric.Canvas }) => {
  const delta = options.e?.deltaY;
  //https://fabricjs.com/api/classes/canvas/#getzoom
  let zoom = canvas.getZoom();
  /** Allow zoom to be minimum 20% and max 100% for better view */
  const minZoom = 0.2;
  const maxZoom = 1;
  const zoomStep = 0.001;
  // Calculate zoom based on mouse scroll wheel with min and max zoom values
  zoom = Math.min(Math.max(minZoom, zoom + delta * zoomStep), maxZoom);
  canvas.zoomToPoint(
    {
      x: options.e.offsetX,
      y: options.e.offsetY,
    },
    zoom
  );
  options.e.preventDefault();
  options.e.stopPropagation();
};
export const handleCanvaseMouseMove = ({
  options,
  canvas,
  isDrawing,
  selectedShapeRef,
  shapeRef,
  syncShapeInStorage,
}: CanvasMouseMove) => {
  // if selected shape is freeform, return
  if (!isDrawing.current) return;
  if (selectedShapeRef.current === "freeform") return;

  canvas.isDrawingMode = false;

  // get pointer coordinates
  const pointer = canvas.getPointer(options.e);
  // depending on the selected shape, set the dimensions of the shape stored in shapeRef in previous step of handelCanvasMouseDown
  // calculate shape dimensions based on pointer coordinates
  switch (selectedShapeRef?.current) {
    case "rectangle":
      shapeRef.current?.set({
        width: pointer.x - (shapeRef.current?.left || 0),
        height: pointer.y - (shapeRef.current?.top || 0),
      });
      break;

    case "circle":
      shapeRef.current.set({
        radius: Math.abs(pointer.x - (shapeRef.current?.left || 0)) / 2,
      });
      break;

    case "triangle":
      shapeRef.current?.set({
        width: pointer.x - (shapeRef.current?.left || 0),
        height: pointer.y - (shapeRef.current?.top || 0),
      });
      break;

    case "line":
      shapeRef.current?.set({
        x2: pointer.x,
        y2: pointer.y,
      });
      break;

    case "image":
      shapeRef.current?.set({
        width: pointer.x - (shapeRef.current?.left || 0),
        height: pointer.y - (shapeRef.current?.top || 0),
      });

    default:
      break;
  }
  // render objects on canvas
  // renderAll: http://fabricjs.com/docs/fabric.Canvas.html#renderAll
  canvas.renderAll();

  // sync shape in storage
  if (shapeRef.current?.objectId) {
    syncShapeInStorage(shapeRef.current);
  }
};
export const handleCanvasMouseUp = ({
  canvas,
  isDrawing,
  shapeRef,
  activeObjectRef,
  selectedShapeRef,
  syncShapeInStorage,
  setActiveElement,
}: CanvasMouseUp) => {
  isDrawing.current = false;
  if (selectedShapeRef.current === "freeform") return;

  // sync shape in storage as drawing is stopped
  syncShapeInStorage(shapeRef.current);

  // set everything to null
  shapeRef.current = null;
  activeObjectRef.current = null;
  selectedShapeRef.current = null;
  // if canvas is not in drawing mode, set active element to default nav element after 700ms
  if (!canvas.isDrawingMode) {
    setTimeout(() => {
      setActiveElement(defaultNavElement);
    }, 700);
  }
};
export const handleCanvasObjectModified = ({
  options,
  syncShapeInStorage,
}: CanvasObjectModified) => {
  const target = options.target;
  if (!target) return;
  if (target?.type == "activeSelection") {
  } else {
    syncShapeInStorage(target as FabricObject);
  }
};
export const handleCanvasSelectionCreated = ({
  selectedElementRef,
  options,
  isEditingRef,
  setElementAttributes,
}: CanvasSelectionCreated) => {
  //If user is editing manually, do not override selection
  if (isEditingRef.current) return;
  //if no elements selected, return
  if (!options?.selected) return;
  //Get Selected Element

  const selectedElement = options?.selected[0] as FabricObject;
  selectedElementRef.current = options?.selected as any;

  // If Only One Element is Selected set element attributes
  if (selectedElement && options.selected.length === 1) {
    if (selectedElement.width === undefined || selectedElement.height === undefined) {
      console.log("No width or height");
      return;
    }
    const scaledWidth = selectedElement?.scaleX
      ? selectedElement?.width * selectedElement?.scaleX
      : selectedElement?.width;
    const scaledHeight = selectedElement?.scaleY
      ? selectedElement?.height * selectedElement?.scaleY
      : selectedElement?.height;
    setElementAttributes({
      x: selectedElement?.top?.toFixed(0).toString() || "",
      y: selectedElement?.left?.toFixed(0).toString() || "",
      angle: selectedElement?.angle?.toFixed(0).toString() || "",
      opacity: selectedElement?.opacity?.toFixed(2).toString() || "",
      width: scaledWidth?.toFixed(0).toString() || "",
      height: scaledHeight?.toFixed(0).toString() || "",
      fill: selectedElement?.fill?.toString() || "",
      //@ts-expect-error might not have stroke property
      stroke: selectedElement?.stroke || "",
      strokeWidth: selectedElement?.strokeWidth?.toString() || "",
      //@ts-expect-error might not be text object
      fontSize: selectedElement?.fontSize || "",
      //@ts-expect-error might not be text object
      fontFamily: selectedElement?.fontFamily || "",
      //@ts-expect-error might not be text object
      fontWeight: selectedElement?.fontWeight || "",
      //@ts-expect-error might not be text object
      radius: selectedElement?.rx?.toString() || "",
      //@ts-expect-error might not be text object
      textAlign: selectedElement?.textAlign || "",
      //@ts-expect-error might not be text object
      lineHeight: selectedElement?.lineHeight?.toString() || "",
    });
  }
};
export const handleCanvasSelectionUpdated = ({
  selectedElementRef,
  options,
  isEditingRef,
  setElementAttributes,
}: CanvasSelectionUpdated) => {
  if (options.deselected) {
    isEditingRef.current = false;
  }
  handleCanvasSelectionCreated({
    selectedElementRef,
    options,
    isEditingRef,
    setElementAttributes,
  });
};
export const handleCanvasObjectScaling = ({
  options,
  setElementAttributes,
}: CanvasObjectScaling) => {
  const selectedElement = options.target;
  if (!selectedElement) return;
  if (selectedElement.width === undefined || selectedElement.height === undefined) {
    console.log("No width or height");
    return;
  }

  // calculate scaled dimensions of the object
  const scaledWidth = selectedElement?.scaleX
    ? selectedElement?.width * selectedElement?.scaleX
    : selectedElement?.width;

  const scaledHeight = selectedElement?.scaleY
    ? selectedElement?.height * selectedElement?.scaleY
    : selectedElement?.height;

  setElementAttributes((prev) => ({
    ...prev,
    width: scaledWidth?.toFixed(0).toString() || "",
    height: scaledHeight?.toFixed(0).toString() || "",
  }));
};
export const handleCanvasObjectRotating = ({
  options,
  setElementAttributes,
}: CanvasObjectScaling) => {
  const selectedElement = options.target;
  if (!selectedElement) return;
  if (selectedElement.angle === undefined) {
    console.log("No angle");
    return;
  }
  setElementAttributes((prev) => ({
    ...prev,
    angle: selectedElement.angle?.toFixed(0).toString() || "",
  }));
};
export const handleCanvasObjectMoving = ({
  options,
  setElementAttributes,
}: CanvasObjectScaling) => {
  const selectedElement = options.target;
  if (!selectedElement) return;
  if (selectedElement.top === undefined || selectedElement.left === undefined) {
    console.log("No top or left");
    return;
  }
  setElementAttributes((prev) => ({
    ...prev,
    x: selectedElement.left.toFixed(0).toString() || "",
    y: selectedElement.top.toFixed(0).toString() || "",
  }));
};
