import { ActiveElement, navElement, shapeElement } from "@/types/type";

export const COLORS = ["#EFCA08", "#00A6A6", "#FF8552", "#8AAEE5", "#F61067"];

export const shapeElements: shapeElement[] = [
  {
    icon: "/assets/rectangle.svg",
    name: "Rectangle",
    value: "rectangle",
    shortcut: "R",
  },
  {
    icon: "/assets/circle.svg",
    name: "Circle",
    value: "circle",
    shortcut: "O",
  },
  {
    icon: "/assets/triangle.svg",
    name: "Triangle",
    value: "triangle",
    shortcut: "P", //for polygon
  },
  {
    icon: "/assets/line.svg",
    name: "Line",
    value: "line",
    shortcut: "L",
  },
  {
    icon: "/assets/image.svg",
    name: "Image",
    value: "image",
  },
  {
    icon: "/assets/freeform.svg",
    name: "Free Drawing",
    value: "freeform",
    shortcut: "F",
  },
];

export const navElements: navElement[] = [
  {
    icon: "/assets/select.svg",
    name: "Select",
    value: "select",
    shortcut: "V",
  },
  {
    icon: "/assets/rectangle.svg",
    name: "Rectangle",
    value: shapeElements,
  },
  {
    icon: "/assets/text.svg",
    value: "text",
    name: "Text",
    shortcut: "T",
  },
  {
    icon: "/assets/delete.svg",
    value: "delete",
    name: "Delete",
    shortcut: "D",
  },
  {
    icon: "/assets/reset.svg",
    value: "reset",
    name: "Reset",
  },
  {
    icon: "/assets/comments.svg",
    value: "comments",
    name: "Comments",
    shortcut: "C",
  },
];
export const toolBarShortCuts: Record<string, ActiveElement> = {
  r: { icon: "/assets/rectangle.svg", name: "Rectangle", value: "rectangle" },
  o: { icon: "/assets/circle.svg", name: "Circle", value: "circle" },
  p: { icon: "/assets/triangle.svg", name: "Triangle", value: "triangle" },
  l: { icon: "/assets/line.svg", name: "Line", value: "line" },
  f: { icon: "/assets/freeform.svg", name: "Free Drawing", value: "freeform" },
  v: { icon: "/assets/select.svg", name: "Select", value: "select" },
  t: { icon: "/assets/text.svg", name: "Text", value: "text" },
  c: { icon: "/assets/comments.svg", name: "Comments", value: "comments" },
  Backspace: { icon: "/assets/delete.svg", name: "Delete", value: "delete" },
  Delete: { icon: "/assets/delete.svg", name: "Delete", value: "delete" },
};

export const defaultNavElement = {
  icon: "/assets/select.svg",
  name: "Select",
  value: "select",
};

export const directionOptions = [
  { label: "Bring to Front", value: "front", icon: "/assets/front.svg" },
  { label: "Send to Back", value: "back", icon: "/assets/back.svg" },
];

export const fontFamilyOptions = [
  { value: "Helvetica", label: "Helvetica" },
  { value: "Times New Roman", label: "Times New Roman" },
  { value: "Comic Sans MS", label: "Comic Sans MS" },
  { value: "Brush Script MT", label: "Brush Script MT" },
  { value: "Days One", label: "Days One" },
  { value: "Rubik", label: "Rubik" },
  { value: "Arial", label: "Arial" },
  { value: "Courier New", label: "Courier New" },
  { value: "Georgia", label: "Georgia" },
  { value: "Impact", label: "Impact" },
  { value: "Lucida Console", label: "Lucida Console" },
  { value: "Tahoma", label: "Tahoma" },
  { value: "Trebuchet MS", label: "Trebuchet MS" },
  { value: "Verdana", label: "Verdana" },
];

export const fontSizeOptions = [
  {
    value: "10",
    label: "10",
  },
  {
    value: "12",
    label: "12",
  },
  {
    value: "14",
    label: "14",
  },
  {
    value: "16",
    label: "16",
  },
  {
    value: "18",
    label: "18",
  },
  {
    value: "20",
    label: "20",
  },
  {
    value: "22",
    label: "22",
  },
  {
    value: "24",
    label: "24",
  },
  {
    value: "26",
    label: "26",
  },
  {
    value: "28",
    label: "28",
  },
  {
    value: "30",
    label: "30",
  },
  {
    value: "32",
    label: "32",
  },
  {
    value: "34",
    label: "34",
  },
  {
    value: "36",
    label: "36",
  },
];
export const fontWeightName = {
  "300": "Light",
  "400": "Regular",
  "500": "Medium",
  "600": "Semibold",
  "700": "Bold",
  "800": "Extra Bold",
  "900": "Black",
};
export const fontWeightOptions = {
  Helvetica: [
    { value: "400", label: "Regular" },
    { value: "700", label: "Bold" },
  ],
  "Times New Roman": [
    { value: "400", label: "Regular" },
    { value: "700", label: "Bold" },
  ],
  "Comic Sans MS": [
    { value: "400", label: "Regular" },
    { value: "700", label: "Bold" },
  ],
  "Brush Script MT": [{ value: "400", label: "Regular" }],
  "Days One": [{ value: "400", label: "Regular" }],
  Rubik: [
    { value: "300", label: "Light" },
    { value: "400", label: "Regular" },
    { value: "500", label: "Medium" },
    { value: "600", label: "Semibold" },
    { value: "700", label: "Bold" },
    { value: "800", label: "Extra Bold" },
    { value: "900", label: "Black" },
  ],
  Arial: [
    { value: "400", label: "Regular" },
    { value: "700", label: "Bold" },
  ],
  "Courier New": [
    { value: "400", label: "Regular" },
    { value: "700", label: "Bold" },
  ],
  Georgia: [
    { value: "400", label: "Regular" },
    { value: "700", label: "Bold" },
  ],
  Impact: [{ value: "400", label: "Regular" }],
  "Lucida Console": [{ value: "400", label: "Regular" }],
  Tahoma: [
    { value: "400", label: "Regular" },
    { value: "700", label: "Bold" },
  ],
  "Trebuchet MS": [
    { value: "400", label: "Regular" },
    { value: "700", label: "Bold" },
  ],
  Verdana: [
    { value: "400", label: "Regular" },
    { value: "700", label: "Bold" },
  ],
} as const;

export const alignmentOptions = [
  { value: "left", label: "Align Left", icon: "/assets/align-left.svg" },
  {
    value: "horizontalCenter",
    label: "Align Horizontal Center",
    icon: "/assets/align-horizontal-center.svg",
  },
  { value: "right", label: "Align Right", icon: "/assets/align-right.svg" },
  { value: "top", label: "Align Top", icon: "/assets/align-top.svg" },
  {
    value: "verticalCenter",
    label: "Align Vertical Center",
    icon: "/assets/align-vertical-center.svg",
  },
  { value: "bottom", label: "Align Bottom", icon: "/assets/align-bottom.svg" },
];

export const shortcuts = [
  {
    key: "1",
    name: "Chat",
    shortcut: "/",
  },
  {
    key: "2",
    name: "Undo",
    shortcut: "⌘ + Z",
  },
  {
    key: "3",
    name: "Redo",
    shortcut: "⌘ + Y",
  },
  {
    key: "4",
    name: "Reactions",
    shortcut: "E",
  },
];
