import { BaseUserMeta, User } from "@liveblocks/client";
import { FabricObject, GradientType, Pattern } from "fabric";

export enum CursorMode {
  Hidden,
  Chat,
  ReactionSelector,
  Reaction,
}
export type CursorState =
  | {
      mode: CursorMode.Hidden;
    }
  | {
      mode: CursorMode.Chat;
      message: string;
      previousMessage: string | null;
    }
  | {
      mode: CursorMode.ReactionSelector;
    }
  | {
      mode: CursorMode.Reaction;
      reaction: string;
      isPressed: boolean;
    };
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
  width: string;
  height: string;
  fontSize: string;
  fontFamily: string;
  fontWeight: string;
  fill: string;
  stroke: string;
};

export type ActiveElement = {
  name: string;
  value: string;
  icon: string;
} | null;

export interface CustomFabricObject<T extends FabricObject> extends FabricObject {
  objectId?: string;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Presence = any;
export type LiveCursorProps = {
  others: readonly User<Presence, BaseUserMeta>[];
};
