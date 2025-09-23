import Image from "next/image";
import React from "react";
import AvatarsList from "../users/AvatarsList";
import { navElements } from "@/constants";
import { ActiveElement } from "@/types/type";
import ToolsBar from "../tools/ToolsBar";
type NavBarProps = {
  activeElement: ActiveElement;
  handleActiveElement: (element: ActiveElement) => void;
};
const NavBar = ({ activeElement, handleActiveElement }: NavBarProps) => {
  return (
    <nav className="flex select-none items-center justify-between gap-4 bg-muted  text-text px-6">
      <Image priority src="/assets/logo.svg" alt="CANVO" width={80} height={80} className=" " />
      <ToolsBar activeElement={activeElement} handleActiveElement={handleActiveElement} />
      <AvatarsList />
    </nav>
  );
};

export default NavBar;
