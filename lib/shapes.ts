import { CustomFabricObject } from "@/types/type";
import { Circle, IText, Line, Polygon, Rect, Triangle } from "fabric";
import { ITextOptions } from "fabric/fabric-impl";
import { v4 as uuid } from "uuid";
export const DEFAULT_FULL_COLOR = "#D9D9D9";

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
    fontSize: 24,
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
