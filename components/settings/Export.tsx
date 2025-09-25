import { exportToPDF } from "@/lib/utils";
import React from "react";

const Export = () => {
  return (
    <section className="flex flex-col px-5 py-3 border-t border-border gap-3">
      <h4 className="text-xs ">Export</h4>

      <button
        className="w-full text-sm border rounded-md border-border  py-1.5 font-bold no-ring focus:bg-primary hover:bg-primary hover:text-background transition ease-in-out duration-150 cursor-pointer active:scale-90"
        onClick={exportToPDF}
      >
        Download PDF
      </button>
    </section>
  );
};

export default Export;
