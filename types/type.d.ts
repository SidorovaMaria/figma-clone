/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseUserMeta, User } from "@liveblocks/client";
import { FabricObject, GradientType, Pattern } from "fabric";
import React from "react";

export type Reaction = {
  value: string;
  timestamp: number;
  point: { x: number; y: number };
};
export type ReactionEvent = {
  x: number;
  y: number;
  value: string;
};

export type ShapeData = {
  type: string;
  width: number;
  height: number;
  fill: string | Pattern | GradientType;
  left: number;
  top: number;
  objectId: string | undefined;
};

export type Attributes = {
  x: string;
  y: string;
  angle: string;
  opacity: string;
  width: string;
  height: string;
  fontSize: string;
  fontFamily: string;
  fontWeight: string;
  fill: string;
  stroke: string;
  radius: string;
};
export type shapeElement = {
  icon: string;
  name: string;
  value: string;
  shortcut?: string;
};
export type navElement = {
  icon: string;
  name: string;
  value: string | shapeElement[];
  shortcut?: string;
};
export type ActiveElement = Partial<navElement>;

export interface CustomFabricObject<T extends FabricObject> extends FabricObject {
  objectId?: string;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface CustomFabricObject<T extends fabric.Object> extends fabric.Object {
  objectId?: string;
}
export type LiveCursorProps = {
  others: readonly User<Presence, BaseUserMeta>[];
};
export type CanvasMouseDown = {
  options: IEvent;
  canvas: Canvas;
  isDrawing: React.MutableRefObject<boolean>;
  selectedShapeRef: any;
  shapeRef: any;
};

export type CanvasMouseUp = {
  canvas: Canvas;
  isDrawing: React.MutableRefObject<boolean>;
  shapeRef: any;
  activeObjectRef: React.MutableRefObject<FabricObject | null>;
  selectedShapeRef: any;
  syncShapeInStorage: (shape: FabricObject) => void;
  setActiveElement: React.Dispatch<React.SetStateAction<ActiveElement>>;
};
export type CanvasMouseMove = {
  options: IEvent;
  canvas: Canvas;
  isDrawing: React.MutableRefObject<boolean>;
  selectedShapeRef: any;
  shapeRef: any;
  syncShapeInStorage: (shape: FabricObject) => void;
};
export type ImageUpload = {
  file: File;
  canvas: React.MutableRefObject<Canvas>;
  shapeRef: React.MutableRefObject<FabricObject | null>;
  syncShapeInStorage: (shape: FabricObject) => void;
};

export type CanvasMouseUp = {
  canvas: Canvas;
  isDrawing: React.MutableRefObject<boolean>;
  shapeRef: any;
  activeObjectRef: React.MutableRefObject<FabricObject | null>;
  selectedShapeRef: any;
  syncShapeInStorage: (shape: FabricObject) => void;
  setActiveElement: any;
};
export type CanvasObjectModified = {
  options: IEvent;
  syncShapeInStorage: (shape: FabricObject) => void;
};
export type RenderCanvasArgs = {
  fabricRef: React.MutableRefObject<Canvas | null>;
  canvasObjects: any;
  activeObjectRef: any;
};
export type CanvasSelectionCreated = {
  options: IEvent;
  isEditingRef: React.MutableRefObject<boolean>;
  setElementAttributes: React.Dispatch<React.SetStateAction<Attributes>>;
};
export type CanvasObjectScaling = {
  options: IEvent;
  setElementAttributes: React.Dispatch<React.SetStateAction<Attributes>>;
};

export type CanvasSelectionUpdated = {
  options: IEvent;
  isEditingRef: React.MutableRefObject<boolean>;
  setElementAttributes: React.Dispatch<React.SetStateAction<Attributes>>;
};
export type RightSideBarProps = {
  elementAttributes: Attributes;
  setElementAttributes: React.Dispatch<React.SetStateAction<Attributes>>;
  fabricRef: React.RefObject<Canvas>;
  isEditingRef: React.MutableRefObject<boolean>;
  activeObjectRef: React.MutableRefObject<FabricObject | null>;
  syncShapeInStorage: (shape: FabricObject) => void;
};
export type ModifyShape = {
  canvas: Canvas;
  property: string;
  value: any;
  activeObjectRef: React.MutableRefObject<FabricObject | null>;
  syncShapeInStorage: (shape: FabricObject) => void;
};
