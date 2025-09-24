import { CustomFabricObject, ImageUpload, ModifyShape } from "@/types/type";
import { Circle, FabricImage, IText, Line, Polygon, Rect, Triangle, util } from "fabric";
import { ITextOptions } from "fabric/fabric-impl";
import { read } from "fs";
import { v4 as uuid } from "uuid";
export const DEFAULT_FULL_COLOR = "#8c8c8c";

export const createRectangle = (pointer: PointerEvent) => {
  /**
   * constructor
   * new Rect<Props, SProps, EventSpec>(options?): Rect<Props, SProps, EventSpec>
   * //KEYBOARD SHORTCUT: R (as in Figma)
   */
  const rectangle = new Rect({
    left: pointer.x,
    top: pointer.y,
    width: 100,
    height: 100,
    fill: DEFAULT_FULL_COLOR || "#D9D9D9",
    objectId: uuid(),
  } as CustomFabricObject<Rect>);
  return rectangle;
};

export const createCircle = (pointer: PointerEvent) => {
  /**
   * constructor
   * new Circle<Props, SProps, EventSpec>(options?): Circle<Props, SProps, EventSpec>
   * //KEYBOARD SHORTCUT: O (as in Figma)
   */
  const circle = new Circle({
    left: pointer.x,
    top: pointer.y,
    radius: 50,
    fill: DEFAULT_FULL_COLOR || "#D9D9D9",
    objectId: uuid(),
  });

  return circle;
};

export const createTriangle = (pointer: PointerEvent) => {
  /**
   * Constructor
   * new Triangle<Props, SProps, EventSpec>(options?): Triangle<Props,
   * SProps, EventSpec>
   * //KEYBOARD SHORTCUT: None
   */
  const triangle = new Triangle({
    left: pointer.x,
    top: pointer.y,
    width: 100,
    height: 80,
    fill: DEFAULT_FULL_COLOR || "#D9D9D9",
    objectId: uuid(),
  } as CustomFabricObject<Rect>);
  return triangle;
};
export const createLine = (pointer: PointerEvent) => {
  /**
   * Constructor
   * new Line<Props, SProps, EventSpec>(points?, options?): Line<Props
   * SProps, EventSpec>
   * //KEYBOARD SHORTCUT: L (as in Figma)
   */
  const line = new Line([pointer.x, pointer.y, pointer.x + 100, pointer.y], {
    stroke: DEFAULT_FULL_COLOR || "#D9D9D9",
    strokeWidth: 2,
    objectId: uuid(),
  });
  return line;
};
export const createText = (pointer: PointerEvent, text: string) => {
  /**
   * Constructor
   * new IText<Props, SProps, EventSpec>(text, options?): IText<Props, SProps
   * EventSpec>
   * //KEYBOARD SHORTCUT: T (as in Figma)
   */
  const iText = new IText(text, {
    left: pointer.x,
    top: pointer.y,
    fontSize: 16,
    fontFamily: "Rubik",
    fontWeight: "400",
    fill: DEFAULT_FULL_COLOR || "#D9D9D9",
    objectId: uuid(),
  });
  return iText;
};

export const createFabricShape = (shapeType: string, pointer: PointerEvent) => {
  switch (shapeType) {
    case "rectangle":
      return createRectangle(pointer);
    case "circle":
      return createCircle(pointer);
    case "triangle":
      return createTriangle(pointer);
    case "line":
      return createLine(pointer);
    case "text":
      return createText(pointer, "Tap to start typing...");
    default:
      return null;
  }
};
export const handleImageUpload = ({ file, canvas, shapeRef, syncShapeInStorage }: ImageUpload) => {
  const reader = new FileReader();
  reader.onload = async () => {
    const image = await FabricImage.fromURL(reader.result as string);
    image.set({
      left: 100,
      top: 100,
      scaleX: 0.5,
      scaleY: 0.5,
      objectId: uuid(),
    });
    canvas.current?.add(image);
    shapeRef.current = image;
    syncShapeInStorage(image);
    canvas.current?.setActiveObject(image);
    canvas.current?.requestRenderAll();
  };
  reader.readAsDataURL(file);
};
export const modifyShape = ({
  canvas,
  property,
  value,
  activeObjectRef,
  syncShapeInStorage,
}: ModifyShape) => {
  const selectedElement = canvas.getActiveObject();

  if (!selectedElement || selectedElement?.type === "activeSelection") return;
  if (property === "x") {
    selectedElement.set("left", parseInt(value, 10));
    selectedElement.setCoords();
  } else if (property === "y") {
    selectedElement.set("top", parseInt(value, 10));
    selectedElement.setCoords();
  }
  //if change angle change origin to center and relocate to the prvios position
  else if (property === "angle") {
    const center = selectedElement.getCenterPoint();
    selectedElement.set({
      originX: "center",
      originY: "center",
      angle: parseInt(value, 10),
      left: center.x,
      top: center.y,
    });
    selectedElement.setCoords();
  }

  // if  property is width or height, set the scale of the selected element
  if (property === "width") {
    if (selectedElement.type === "circle") {
      console.log("Circle width change not supported");
      return;
    }
    selectedElement.set("scaleX", 1);
    selectedElement.set("width", value);
  } else if (property === "height") {
    if (selectedElement.type === "circle") {
      console.log("Circle height change not supported");
      return;
    }
    selectedElement.set("scaleY", 1);
    selectedElement.set("height", value);
  } else {
    if (selectedElement[property as keyof object] === value) return;
    selectedElement.set(property as keyof object, value);
  }

  // set selectedElement to activeObjectRef
  activeObjectRef.current = selectedElement;

  syncShapeInStorage(selectedElement);
};
