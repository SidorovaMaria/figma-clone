import { CanvasMouseDown } from "@/types/type";
import { Canvas, PatternBrush, PencilBrush, Rect } from "fabric";
import { createFabricShape } from "./shapes";
import { IEvent } from "fabric/fabric-impl";
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
export const handleCanvasZoom = ({
  options,
  canvas,
}: {
  options: IEvent & { e: WheelEvent };
  canvas: fabric.Canvas;
}) => {
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
