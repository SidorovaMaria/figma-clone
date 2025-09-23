"use client";
import Live from "@/components/Live";
import NavBar from "@/components/navigation/NavBar";
import LeftSideBar from "@/components/navigation/LeftSideBar";
import RightSideBar from "@/components/navigation/RightSideBar";
import { ActiveElement, Attributes } from "@/types/type";
import { useEffect, useRef, useState } from "react";
import { Canvas, FabricObject } from "fabric";

import {
  handleCanvaseMouseMove,
  handleCanvasMouseDown,
  handleCanvasMouseUp,
  handleCanvasObjectModified,
  handleCanvasResize,
  handleCanvasZoom,
  initializeFabric,
  renderCanvas,
} from "@/lib/canvas";
import { DEFAULT_FULL_COLOR } from "@/lib/shapes";
import { useMutation, useStorage } from "@liveblocks/react/suspense";
import { defaultNavElement } from "@/constants";

export default function Home() {
  /**
   * useStorage is a hook provided by Liveblocks that allows you to store
   * data in a key-value store and automatically sync it with other users
   * i.e., subscribes to updates to that selected data
   *
   * useStorage: https://liveblocks.io/docs/api-reference/liveblocks-react#useStorage
   *
   * Over here, we are storing the canvas objects in the key-value store.
   * from theliveblocks.config.ts
   */
  const canvasObjects = useStorage((root) => root.canvasObjects);

  const syncShapeInStorage = useMutation(({ storage }, object) => {
    //Check if we have a valid object
    if (!object) return;
    // Get the objectId from the object - descructuring
    const { objectId } = object;
    //Turn the fabric object into a JSON format to be able to store it in the storage
    const dataShape = object.toJSON();
    dataShape.objectId = objectId;
    const canvasObjects = storage.get("canvasObjects");
    canvasObjects.set(objectId, dataShape);
  }, []);

  /** canvasRef is a reference to the canvas element that we'll use to
   * initialize the fabric canvas.
   */
  const canvasRef = useRef<HTMLCanvasElement>(null);
  /**
   * * fabricRef is a reference to the fabric canvas that we use to perform
   * operations on the canvas. It's a copy of the created canvas so we can use
   * it outside the canvas event listeners.
   */
  const fabricRef = useRef<Canvas | null>(null);
  /**
   * isDrawing is a boolean that tells us if the user is drawing on the canvas.
   * We use this to determine if the user is drawing or not
   * i.e., if the freeform drawing mode is on or not.
   */
  const isDrawing = useRef(false);
  /**
   * shapeRef is a reference to the shape that the user is currently drawing.
   * We use this to update the shape's properties when the user is
   * drawing/creating shape
   */
  const shapeRef = useRef<FabricObject | null>(null);

  /**
   * selectedShapeRef is a reference to the shape that the user has selected.
   * For example, if the user has selected the rectangle shape, then this will
   * be set to "rectangle".
   *
   * We're using refs here because we want to access these variables inside the
   * event listeners. We don't want to lose the values of these variables when
   * the component re-renders. Refs help us with that.
   */
  const selectedShapeRef = useRef<string | null>(null);
  /**
   * activeObjectRef is a reference to the currently active object on the canvas.
   * We want to keep track of the active object so that we can keep it in
   * selected form when user is editing the width, height, color etc
   * properties/attributes of the object.
   *
   * As we using live storage to sync the canvas across multiple users,
   * we have to re-render the canvas when shapes are added/modified/deleted.
   * Due to this the selected object gets lost. We want to keep track
   * of the selected shape so that we can keep it selected when the
   * canvas re-renders.
   */
  const activeObjectRef = useRef<FabricObject | null>(null);
  const isEditingRef = useRef(false);

  /**
   * activeElement is an object that wll contain the name, value and icon of the active element in the toolbar
   * For example, if the user has selected the rectangle shape, then this will
   * be set to { name: "Rectangle", value: "rectangle", icon: "rectangle-icon" }
   * We use this to highlight the active element in the toolbar.
   */
  const [activeElement, setActiveElement] = useState<ActiveElement>({
    name: "",
    value: "",
    icon: "",
  });
  const deleteAllShapes = useMutation(({ storage }) => {
    const canvasObjects = storage.get("canvasObjects");
    if (!canvasObjects || canvasObjects.size === 0) return true;
    for (const [key, value] of canvasObjects.entries()) {
      canvasObjects.delete(key);
    }
    return canvasObjects.size === 0;
  }, []);
  const handleActiveElement = (element: ActiveElement) => {
    setActiveElement(element);
    switch (element?.value) {
      case "reset":
        deleteAllShapes();
        //Clear the Canvas
        fabricRef.current?.clear();
        setActiveElement(defaultNavElement);
        //Delete all objects from the canvas and storage
        break;
    }
    selectedShapeRef.current = element?.value as string;
  };
  /**
   * elementAttributes is an object that contains the attributes of the selected
   * element in the canvas.
   *
   * We use this to update the attributes of the selected element when the user
   * is editing the width, height, color etc properties/attributes of the
   * object.
   */
  const [elementAttributes, setElementAttributes] = useState<Attributes>({
    width: "",
    height: "",
    fontSize: "",
    fontFamily: "",
    fontWeight: "",
    fill: DEFAULT_FULL_COLOR || "#d9d9d9",
    stroke: DEFAULT_FULL_COLOR || "#d9d9d9",
  });

  useEffect(() => {
    const canvas = initializeFabric({
      canvasRef,
      fabricRef,
    });
    /**
     * listen to the mouse down event on the canvas which is fired when the
     * user clicks on the canvas
     * Event Inspector:https://fabricjs.com/api/classes/canvas/#on
     */
    canvas.on("mouse:down", (options) =>
      handleCanvasMouseDown({ options, canvas, selectedShapeRef, isDrawing, shapeRef })
    );
    canvas.on("mouse:up", () =>
      handleCanvasMouseUp({
        canvas,
        isDrawing,
        shapeRef,
        activeObjectRef,
        selectedShapeRef,
        syncShapeInStorage,
        setActiveElement,
      })
    );

    canvas.on("mouse:move", (options) => {
      handleCanvaseMouseMove({
        options,
        canvas,
        isDrawing,
        selectedShapeRef,
        shapeRef,
        syncShapeInStorage,
      });
    });
    canvas.on("object:modified", (options) => {
      handleCanvasObjectModified({
        options,
        syncShapeInStorage,
      });
    });

    /**
     * listen to the resize event on the window which is fired when the
     * user resizes the window.
     *
     * We're using this to resize the canvas when the user resizes the
     * window.
     */

    window.addEventListener("resize", () => {
      handleCanvasResize({
        canvas: fabricRef.current,
      });
    });

    return () => {
      /**
       * dispose is a method provided by Fabric that allows you to dispose
       * the canvas. It clears the canvas and removes all the event
       * listeners
       *
       * dispose: http://fabricjs.com/docs/fabric.Canvas.html#dispose
       */
      canvas.dispose();
    };
  }, [canvasRef]);
  // render the canvas when the canvasObjects from live storage changes
  useEffect(() => {
    renderCanvas({
      fabricRef,
      canvasObjects,
      activeObjectRef,
    });
  }, [canvasObjects]);

  return (
    <main className="h-screen  overflow-hidden">
      <NavBar activeElement={activeElement} handleActiveElement={handleActiveElement} />
      <section className="flex h-full flex-row">
        <LeftSideBar shapes={Array.from(canvasObjects)} />
        <Live canvasRef={canvasRef} />
        <RightSideBar />
      </section>
    </main>
  );
}
