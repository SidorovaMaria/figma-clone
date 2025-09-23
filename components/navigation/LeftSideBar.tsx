/* eslint-disable @typescript-eslint/no-explicit-any */
import { getShapeInfo } from "@/lib/utils";
import { Canvas } from "fabric";
import Image from "next/image";
import React from "react";

const LeftSideBar = ({ shapes }: { shapes: Array<any> }) => {
  return (
    <section className="flex flex-col  bg-muted text-text min-w-[227px] sticky left-0 h-full max-sm:hidden select-none overflow-y-auto pb-20">
      <h3 className="border border-text-muted/30 px-5 py-4 text-xs uppercase">Layers</h3>
      <div className="flex flex-col gap-1 p-5">
        {shapes.map((shape: any) => {
          const info = getShapeInfo(shape[1]?.type);
          return (
            <div
              key={shape[1]?.objectId}
              className="group flex cursor-pointer items-center gap-3 rounded-md border border-transparent px-3 py-2 hover:border-text-muted/30 transition ease-in-out duration-150"
            >
              <Image src={info?.icon} alt="Layer" width={16} height={16} />
              <h3 className="text-sm font-semibold capitalize">{info.name}</h3>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default LeftSideBar;
