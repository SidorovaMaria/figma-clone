/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Live from "@/components/Live";
import NavBar from "@/components/navigation/NavBar";
import LeftSideBar from "@/components/navigation/LeftSideBar";
import RightSideBar from "@/components/navigation/RightSideBar";
import { ActiveElement, Attributes } from "@/types/type";
import { RefObject, use, useCallback, useEffect, useRef, useState } from "react";
import { Canvas, FabricObject } from "fabric";

import {
  handleCanvaseMouseMove,
  handleCanvasMouseDown,
  handleCanvasMouseUp,
  handleCanvasObjectModified,
  handleCanvasObjectMoving,
  handleCanvasObjectRotating,
  handleCanvasObjectScaling,
  handleCanvasResize,
  handleCanvasSelectionCreated,
  handleCanvasSelectionUpdated,
  initializeFabric,
  renderCanvas,
} from "@/lib/canvas";
import { DEFAULT_FILL_COLOR, handleImageUpload } from "@/lib/shapes";
import { useMutation, useRedo, useStorage, useUndo } from "@liveblocks/react/suspense";
import { defaultNavElement } from "@/constants";
import {
  buildEditorBindings,
  handleCopy,
  handleDelete,
  handlePaste,
  handlePasteHere,
} from "@/lib/key-events";
import { useShortcut } from "@/hooks/useShortcut";

export default function Home() {
  /**
   * Undo/Redoc hook provided by LiveBlocks that allow you to undo and redo mutations
   */
  const undo = useUndo();
  const redo = useRedo();
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
  const selectedElementRef = useRef<ActiveElement | null>(null);
  const rightClickPosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
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
   * imageInputRef is a reference to the input element that we use to upload
   * an image to the canvas.
   *
   * We want image upload to happen when clicked on the image item from the
   * dropdown menu. So we're using this ref to trigger the click event on the
   * input element when the user clicks on the image item from the dropdown.
   */
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [disableEditing, setDisableEditing] = useState(true);

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
  const deleteShapeFromStorage = useMutation(({ storage }, shapeId) => {
    const canvasObjects = storage.get("canvasObjects");
    if (!canvasObjects || canvasObjects.size === 0) return true;
    canvasObjects.delete(shapeId);
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
      case "delete":
        handleDelete(fabricRef.current as any, deleteShapeFromStorage);
        setActiveElement(defaultNavElement);
        //Handle Delet one Item
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
    fill: DEFAULT_FILL_COLOR || "#d9d9d9",
    stroke: DEFAULT_FILL_COLOR || "#d9d9d9",
    strokeWidth: "",
    x: "",
    y: "",
    angle: "",
    opacity: "",
    radius: "",
    textAlign: "left",
    lineHeight: "",
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
    canvas.on("mouse:down", (options) => {
      handleCanvasMouseDown({ options, canvas, selectedShapeRef, isDrawing, shapeRef });
    });
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
     * listen to the selection created event on the canvas which is fired
     * when the user selects an object on the canvas.
     *
     
     */
    canvas.on("selection:created", (options) => {
      setDisableEditing(false);
      handleCanvasSelectionCreated({
        selectedElementRef,
        options,
        isEditingRef,
        setElementAttributes,
      });
    });

    canvas.on("selection:updated", (options) => {
      handleCanvasSelectionUpdated({
        selectedElementRef,
        options,
        isEditingRef,
        setElementAttributes,
      });
    });
    canvas.on("object:scaling", (options) => {
      handleCanvasObjectScaling({
        options,
        setElementAttributes,
      });
    });
    canvas.on("object:rotating", (options) => {
      handleCanvasObjectRotating({
        options,
        setElementAttributes,
      });
    });

    canvas.on("object:moving", (options) => {
      handleCanvasObjectMoving({
        options,
        setElementAttributes,
      });
    });
    canvas.on("selection:cleared", () => {
      if (isEditingRef.current) {
        console.log("in the process of editing an element");
      } else {
        console.log('disabling editing since "selection:cleared" fired');
        setDisableEditing(true);
        selectedElementRef.current = null;
      }
    });

    canvas.on("contextmenu:before", (options) => {
      if (!options.e) return;
      const pointer = canvas.getPointer(options.e as PointerEvent);
      rightClickPosition.current = { x: pointer.x, y: pointer.y };
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasRef]);
  // render the canvas when the canvasObjects from live storage changes
  useEffect(() => {
    renderCanvas({
      fabricRef,
      canvasObjects,
      activeObjectRef,
    });
  }, [canvasObjects]);
  useShortcut({
    bindings: buildEditorBindings({
      canvas: fabricRef.current,
      undo,
      redo,
      syncShapeInStorage,
      deleteShapeFromStorage,
    }),
    options: { preventDefault: true },
  });

  //Trigger ContextMenu Items Actions
  const handleMenuContextCanvasAction = useCallback((action: string) => {
    switch (action) {
      case "Undo":
        undo();
        break;
      case "Redo":
        redo();
        break;
      case "Copy":
        handleCopy(fabricRef.current as any);
        break;
      case "Paste":
        handlePaste(fabricRef.current as any, syncShapeInStorage);
        break;
      case "Paste here":
        handlePasteHere({
          rightClickPosition: rightClickPosition.current,
          canvas: fabricRef.current as any,
          syncShapeInStorage,
        });
        break;
      case "Cut":
        handleCopy(fabricRef.current as any);
        handleDelete(fabricRef.current as any, deleteShapeFromStorage);
        break;
      case "Show/Hide UI":
        const leftSideBar = document.getElementById("left-sidebar");
        const rightSideBar = document.getElementById("right-sidebar");
        if (leftSideBar && rightSideBar) {
          if (leftSideBar.style.display === "none") {
            leftSideBar.style.display = "flex";
            rightSideBar.style.display = "flex";
          } else {
            leftSideBar.style.display = "none";
            rightSideBar.style.display = "none";
          }
        }
        break;
    }
  }, []);

  return (
    <main className="h-screen  overflow-hidden">
      {/* <CollaborativeApp /> */}
      <NavBar
        activeElement={activeElement}
        handleActiveElement={handleActiveElement}
        imageInputRef={imageInputRef}
        handleImageUpload={(e: any) => {
          e.stopPropagation();
          handleImageUpload({
            file: e.target.files[0],
            canvas: fabricRef as any,
            shapeRef,
            syncShapeInStorage,
          });
        }}
      />
      <section className="flex h-full flex-row">
        <LeftSideBar shapes={Array.from(canvasObjects)} />

        <Live
          canvasRef={canvasRef}
          handleMenuContextCanvasAction={handleMenuContextCanvasAction}
          selectedElementRef={selectedElementRef}
        />

        <RightSideBar
          disableEditing={disableEditing}
          elementAttributes={elementAttributes}
          setElementAttributes={setElementAttributes}
          fabricRef={fabricRef as RefObject<Canvas>}
          isEditingRef={isEditingRef}
          activeObjectRef={activeObjectRef}
          syncShapeInStorage={syncShapeInStorage}
        />
      </section>
    </main>
  );
}
