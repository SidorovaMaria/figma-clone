import { Label } from "radix-ui";
import React from "react";

const InputElement = () => {
  return (
    <div className="flex flex-row gap-1 w-fit">
      <Label.Root className="text-xs" htmlFor="x">
        X
      </Label.Root>
      <input type="text" id="x" />
    </div>
  );
};

export default InputElement;
