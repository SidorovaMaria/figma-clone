import Image from "next/image";
import React from "react";
type Props = {
  name: string;
  className?: string;
};
const IMAGE_SIZE = 48;
const Avatar = ({ name, className }: Props) => {
  return (
    <div className={`avatar ${className}`} data-tooltip={name}>
      <Image
        src={`http://liveblocks.io/avatars/avatar-${Math.floor(Math.random() * 30)}.png`}
        width={IMAGE_SIZE}
        height={IMAGE_SIZE}
        className="avatar-picture"
        alt={`${name}'s avatar`}
      />
    </div>
  );
};

export default Avatar;
