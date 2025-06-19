import React, { useEffect, useRef } from "react";
import { fabric } from "fabric";
import { useAppContext } from "../context/AppContext";

const INITIAL_WIDTH = 3000;
const INITIAL_HEIGHT = 2000;
const BUFFER = 100;
const INCREMENT = 1000;

const CanvasEditor = () => {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const { selectedTool, setSelectedTool, activeFile, folders, setFolders } =
    useAppContext();

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      backgroundColor: "#fff",
    });
    fabricRef.current = canvas;

    canvas.setWidth(INITIAL_WIDTH);
    canvas.setHeight(INITIAL_HEIGHT);
    canvasRef.current.width = INITIAL_WIDTH;
    canvasRef.current.height = INITIAL_HEIGHT;
    canvas.setZoom(1);

    // ⬇ Load content of activeFile on mount
    if (activeFile?.content) {
      canvas.loadFromJSON(activeFile.content, () => {
        canvas.renderAll();
      });
    }

    // Store instance globally (for save/load)
    window.canvasInstance = canvas;

    return () => {
      canvas.dispose();
    };
  }, []);

  // Load canvas content when activeFile changes
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas || !activeFile) return;

    canvas.clear();
    canvas.backgroundColor = "#fff";

    if (activeFile.content) {
      canvas.loadFromJSON(activeFile.content, () => {
        canvas.renderAll();
      });
    }
  }, [activeFile]);

  // Save canvas before file switches
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    return () => {
      if (!activeFile) return;

      const json = canvas.toJSON();
      const updatedFolders = folders.map((folder) => ({
        ...folder,
        files: folder.files.map((file) =>
          file.id === activeFile.id
            ? { ...file, content: JSON.stringify(json) }
            : file
        ),
      }));

      setFolders(updatedFolders);
    };
  }, [activeFile]);

  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas || !selectedTool) return;

    const handleClick = (event) => {
      const pointer = canvas.getPointer(event.e);
      const { x, y } = pointer;

      let shape;
      switch (selectedTool) {
        case "text":
          shape = new fabric.Textbox("Enter", {
            left: x,
            top: y,
            width: 200, // Set your desired wrapping width
            fontSize: 20,
            fill: "#333",
            editable: true, // Make it editable like IText
          });

          break;
        case "circle":
          shape = new fabric.Circle({
            left: x,
            top: y,
            radius: 50,
            fill: "lightcoral",
            stroke: "black",
            strokeWidth: 1,
          });
          break;
        case "rectangle":
          shape = new fabric.Rect({
            left: x,
            top: y,
            width: 100,
            height: 60,
            fill: "lightblue",
          });
          break;
        case "diamond":
          shape = new fabric.Polygon(
            [
              { x: 0, y: 50 },
              { x: 50, y: 0 },
              { x: 100, y: 50 },
              { x: 50, y: 100 },
            ],
            {
              left: x,
              top: y,
              fill: "lightgreen",
            }
          );
          break;
        case "arrow":
          shape = new fabric.Line([x, y, x + 100, y], {
            stroke: "black",
            strokeWidth: 2,
          });
          break;
        default:
          return;
      }

      if (shape) canvas.add(shape);

      // 🧠 Check if we need to expand
      let resized = false;
      const currentWidth = canvas.getWidth();
      const currentHeight = canvas.getHeight();

      if (x > currentWidth - BUFFER) {
        const newWidth = currentWidth + INCREMENT;
        canvas.setWidth(newWidth);
        canvasRef.current.width = newWidth;

        resized = true;
      }
      if (y > currentHeight - BUFFER) {
        const newHeight = currentHeight + INCREMENT;
        canvas.setHeight(newHeight);
        canvasRef.current.height = newHeight;

        resized = true;
      }

      if (resized) {
        canvas.renderAll();
      }

      setSelectedTool(null);
      canvas.off("mouse:down", handleClick);
    };

    canvas.on("mouse:down", handleClick);
    return () => canvas.off("mouse:down", handleClick);
  }, [selectedTool, setSelectedTool]);

  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const handleKeyDown = (e) => {
      if (e.key === "Delete") {
        const activeObj = canvas.getActiveObject();

        if (!activeObj) return;

        // 🔄 Handle multi-select
        if (activeObj.type === "activeSelection") {
          activeObj.forEachObject((obj) => {
            canvas.remove(obj);
          });
          canvas.discardActiveObject();
        } else {
          canvas.remove(activeObj);
        }

        canvas.renderAll();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="flex-1 overflow-auto h-full w-full">
      <canvas
        ref={canvasRef}
      />
    </div>
  );
};

export default CanvasEditor;
