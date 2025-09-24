import { modifyShape } from "@/lib/shapes";
import { RightSideBarProps } from "@/types/type";
import { Canvas } from "fabric/fabric-impl";
import React, { useMemo, useRef } from "react";
import Position from "../settings/Position";
import Layout from "../settings/Layout";
import Appearance from "../settings/Appearance";

const RightSideBar = ({
  elementAttributes,
  setElementAttributes,
  fabricRef,
  isEditingRef,
  activeObjectRef,
  syncShapeInStorage,
}: RightSideBarProps) => {
  const colorInputRef = useRef(null);
  const strokeInputRef = useRef(null);
  const handleInputChange = (property: string, value: string | boolean) => {
    if (!isEditingRef.current) isEditingRef.current = true;

    setElementAttributes((prev) => ({ ...prev, [property]: value }));
    modifyShape({
      canvas: fabricRef.current as Canvas,
      property,
      value,
      activeObjectRef,
      syncShapeInStorage,
    });
  };
  const selectedObjectType = useMemo(() => {
    return fabricRef.current?.getActiveObject()?.type || null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fabricRef.current?.getActiveObject()?.objectId]);

  return (
    <section className="flex flex-col  bg-muted text-text min-w-[227px] max-w-[227px] sticky right -0 h-full max-sm:hidden select-none overflow-y-auto pb-20">
      <h3 className="px-5 py-4 text-xs uppercase">Design</h3>
      <Position
        x={elementAttributes.x}
        y={elementAttributes.y}
        angle={elementAttributes.angle}
        isEditingRef={isEditingRef}
        handleInputChange={handleInputChange}
      />
      <Layout
        objectType={selectedObjectType}
        width={elementAttributes.width}
        height={elementAttributes.height}
        isEditingRef={isEditingRef}
        handleInputChange={handleInputChange}
      />
      <Appearance
        objectType={selectedObjectType}
        radius={elementAttributes.radius}
        opacity={elementAttributes.opacity}
        isEditingRef={isEditingRef}
        handleInputChange={handleInputChange}
      />
    </section>
  );
};

export default RightSideBar;
