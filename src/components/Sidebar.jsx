import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import {
  Plus,
  FilePlus,
  Trash2,
  Pencil,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

const Sidebar = () => {
  const {
    folders,
    setFolders,
    setActiveFile,
    activeFile,
    sidebarOpen,
  } = useAppContext();

  const [expandedFolders, setExpandedFolders] = useState({});

  
  const toggleFolder = (folderId) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };


  const addFolder = () => {
    const name = prompt("Enter folder name:");
    if (!name) return;
    setFolders((prev) => [
      ...prev,
      { id: Date.now().toString(), name, files: [] },
    ]);
  };

  const renameFolder = (folderId) => {
    const newName = prompt("Enter new folder name:");
    if (!newName) return;
    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === folderId ? { ...folder, name: newName } : folder
      )
    );
  };

  const addFileToFolder = (folderId) => {
    const name = prompt("Enter file name:");
    if (!name) return;
    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === folderId
          ? {
              ...folder,
              files: [...folder.files, { id: Date.now().toString(), name }],
            }
          : folder
      )
    );
  };

  const renameFile = (folderId, fileId) => {
    const newName = prompt("Enter new file name:");
    if (!newName) return;
    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === folderId
          ? {
              ...folder,
              files: folder.files.map((file) =>
                file.id === fileId ? { ...file, name: newName } : file
              ),
            }
          : folder
      )
    );
  };

  
const deleteFile = (folderId, fileId) => {
  setFolders((prev) =>
    prev.map((folder) =>
      folder.id === folderId
        ? {
            ...folder,
            files: folder.files.filter((file) => file.id !== fileId),
          }
        : folder
    )
  );

  // If deleted file was active, reset canvas
  if (activeFile?.id === fileId) {
    setActiveFile(null);
    if (window.canvasInstance) {
      window.canvasInstance.clear();
    }
  }
};

  if (!sidebarOpen) return null;

  return (
    <div className="w-64 bg-gray-100 p-4 border-r overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Folders</h2>
        <button
          onClick={addFolder}
          className="text-blue-600 text-sm hover:underline"
        >
          <Plus size={16} />
        </button>
      </div>

      {folders.map((folder) => (
        <div key={folder.id} className="mb-2">
          <div className="flex justify-between items-center">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => toggleFolder(folder.id)}
            >
              {expandedFolders[folder.id] ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
              <span className="ml-1 font-semibold">{folder.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => addFileToFolder(folder.id)}>
                <FilePlus size={14} />
              </button>
              <button onClick={() => renameFolder(folder.id)}>
                <Pencil size={14} />
              </button>
            </div>
          </div>

          {expandedFolders[folder.id] && (
            <ul className="ml-5 mt-2 space-y-1">
              {folder.files.map((file) => (
                <li
                  key={file.id}
                  className="flex justify-between items-center bg-white px-2 py-1 rounded hover:bg-gray-200 cursor-pointer"
                  onClick={() => setActiveFile(file)}
                >
                  <span>{file.name}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        renameFile(folder.id, file.id);
                      }}
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFile(folder.id, file.id);
                      }}
                      className="text-red-500"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
