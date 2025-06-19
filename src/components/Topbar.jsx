// src/components/Topbar.jsx
import { useAppContext } from "../context/AppContext";
import { Menu } from "lucide-react"; // Optional: use heroicons/lucide
import { saveCanvasToFile, loadCanvasFromFile } from "../utils/fileHelpers";
import { generateId } from "../utils/idGenerator";
import React, { useState, useEffect } from "react";


export default function Topbar({showToast}) {
  const { sidebarOpen, setSidebarOpen, activeFile, setActiveFile, folders, setFolders } = useAppContext();
  const [fileHandle, setFileHandle] = useState(null);


  // const handleDownload = () => {
  //   if (!window.canvasInstance) return;
  //   saveCanvasToFile(window.canvasInstance, `${activeFile?.name || "canvas"}.json`);
  // };
  const handleDownload = async () => {
     if (!window.canvasInstance || !activeFile) return;

  const handle = await saveCanvasToFile(
    window.canvasInstance,
    activeFile.name || "canvas",
    fileHandle
  );

  if (handle) setFileHandle(handle); // Save for next time
  };

  const handleZoomIn = () => {
  const canvas = window.canvasInstance;
  if (!canvas) return;
  const currentZoom = canvas.getZoom();
  canvas.setZoom(currentZoom * 1.1); // Zoom in by 10%
  canvas.requestRenderAll();
};

const handleZoomOut = () => {
  const canvas = window.canvasInstance;
  if (!canvas) return;
  const currentZoom = canvas.getZoom();
  canvas.setZoom(currentZoom / 1.1); // Zoom out by 10%
  canvas.requestRenderAll();
};

    const handleSave = () => {
    const canvas = window.canvasInstance;
    if (!canvas || !activeFile) return;

    const json = canvas.toJSON();

    // Update active file
    const updatedFile = { ...activeFile, content: json };
    setActiveFile(updatedFile);

    // Update file in folders
    const updatedFolders = folders.map(folder => ({
      ...folder,
      files: folder.files.map(file =>
        file.id === updatedFile.id ? updatedFile : file
      ),
    }));
    setFolders(updatedFolders);

    if (showToast) {
      showToast(`"${activeFile?.name}" saved successfully!`);
    }
  };

  const handleLoad = async () => {
  if (!window.canvasInstance) return;

  const { name, content } = await loadCanvasFromFile(window.canvasInstance);
  const id = generateId();
  const newFile = { id, name, content };

  // Add to the first folder
  const updatedFolders = folders.map((folder, index) => {
    if (index === 0) {
      return {
        ...folder,
        files: [...folder.files, newFile],
      };
    }
    return folder;
  });

  setFolders(updatedFolders);
  setActiveFile(newFile);
};



  

  return (
    <div className="p-2 border-b bg-white flex gap-2 items-center justify-between">
      <button
        className="bg-gray-200 p-2 rounded hover:bg-gray-300"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        title={sidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
      >
        <Menu size={20} />
      </button>
      <div className="font-bold text-lg">Notely</div>
      <div className="flex gap-2">
        <button onClick={handleZoomIn} className="bg-blue-200 text-black px-3 py-1 rounded">Zoom In</button>
  <button onClick={handleZoomOut} className="bg-blue-200 text-black px-3 py-1 rounded">Zoom Out</button>
        <button onClick={handleSave} className="bg-blue-500 text-white px-3 py-1 rounded">Save</button>
        <button onClick={handleLoad} className="bg-green-500 text-white px-3 py-1 rounded">Load</button>
        <button onClick={handleDownload} className="bg-green-500 text-white px-3 py-1 rounded">Download</button>
      </div>
    </div>
  );
}
