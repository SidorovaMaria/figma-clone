import Image from "next/image";
import React from "react";
import AvatarsList from "../users/AvatarsList";
import { navElements } from "@/constants";
import { ActiveElement } from "@/types/type";
import ToolsBar from "../tools/ToolsBar";
type NavBarProps = {
  activeElement: ActiveElement;
  imageInputRef: React.MutableRefObject<HTMLInputElement | null>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleActiveElement: (element: ActiveElement) => void;
};
const NavBar = ({
  activeElement,
  imageInputRef,
  handleImageUpload,
  handleActiveElement,
}: NavBarProps) => {
  return (
    <nav className="flex select-none items-center justify-between gap-4 bg-muted  text-text px-6">
      <Image priority src="/assets/logo.svg" alt="CANVO" width={80} height={80} className=" " />
      <ToolsBar
        activeElement={activeElement}
        handleActiveElement={handleActiveElement}
        handleImageUpload={handleImageUpload}
        imageInputRef={imageInputRef}
      />
      <AvatarsList />
    </nav>
  );
};

export default NavBar;
