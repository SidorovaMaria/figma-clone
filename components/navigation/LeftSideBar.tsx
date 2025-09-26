/* eslint-disable @typescript-eslint/no-explicit-any */
import { getShapeInfo } from "@/lib/utils";
import { Canvas } from "fabric";
import Image from "next/image";
import React, { useMemo } from "react";
import ConfirmResetModal from "../modals/ConfirmResetModal";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";

const LeftSideBar = ({
  shapes,
  canvas,
  selectedElementRef,
}: {
  shapes: Array<any>;
  canvas: any;
  selectedElementRef: React.RefObject<any>;
}) => {
  const sel = () => {
    console.log("selectedElementRef", selectedElementRef.current);
  };
  return (
    <section
      className="flex flex-col  bg-muted text-text min-w-[227px] sticky left-0 h-full max-sm:hidden select-none overflow-y-auto pb-20"
      id="left-sidebar"
    >
      <h3 className="border border-text-muted/30 px-5 py-4 text-xs uppercase" onClick={() => sel()}>
        Layers
      </h3>
      <div className="flex flex-col gap-1 p-5">
        {shapes.map((shape: any) => {
          return (
            <ItemLayout
              key={shape[1]?.objectId}
              shape={shape}
              canvas={canvas}
              selectedElementRef={selectedElementRef}
            />
          );
        })}
      </div>
    </section>
  );
};

export default LeftSideBar;

const ItemLayout = ({
  shape,
  canvas,
  selectedElementRef,
}: {
  shape: any;
  canvas: React.RefObject<Canvas>;
  selectedElementRef: React.RefObject<any>;
}) => {
  const info = useMemo(() => getShapeInfo(shape[1]?.type), [shape]);
  const isSelected = useMemo(() => {
    return selectedElementRef.current?.objectId === shape[1]?.objectId;
  }, [selectedElementRef.current, shape]);

  const [isVisible, setIsVisible] = React.useState(shape[1]?.visible);
  const changeVisibility = (id: string) => {
    //@ts-expect-error objectId exists
    const object = canvas.current.getObjects().find((obj) => obj.objectId === id);
    if (object) {
      object.set("visible", !object.visible);
      canvas.current.requestRenderAll();
      return object.visible;
    }
  };
  return (
    <div
      className={`group flex cursor-pointer items-center gap-3 rounded-md border border-transparent px-3 py-2 hover:border-text-muted/30 transition ease-in-out duration-150 ${
        isSelected ? "bg-secondary border-text-muted/30" : ""
      }
      `}
    >
      <Image src={info?.icon} alt="Layer" width={16} height={16} />
      <h3 className="text-sm font-semibold capitalize">{info.name}</h3>
      <button
        type="button"
        className="ml-auto p-2 rounded-md hover:bg-secondary transition ease-in-out duration-150 cursor-pointer"
      >
        {isVisible ? (
          <EyeOpenIcon
            onClick={(e) => {
              e.stopPropagation();
              const vis = changeVisibility(shape[1]?.objectId);
              setIsVisible(vis);
            }}
          />
        ) : (
          <EyeClosedIcon
            onClick={(e) => {
              e.stopPropagation();
              const vis = changeVisibility(shape[1]?.objectId);
              setIsVisible(vis);
            }}
          />
        )}
      </button>
    </div>
  );
};
