import React, { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [selectedTool, setSelectedTool] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  let fileHandle = null; // Save globally or in context

  // Load from localStorage
  const [folders, setFolders] = useState(() => {
    const saved = localStorage.getItem("folders");
    return saved ? JSON.parse(saved) : [
      {
        id: "default-folder",
        name: "My Notes",
        files: [
          { id: "file-1", name: "Untitled File", content: "" },
        ],
      },
    ];
  });

 const [activeFile, setActiveFile] = useState(() => {
    const saved = localStorage.getItem("activeFile");
    return saved ? JSON.parse(saved) : null;
  });

  // Save folders & activeFile to localStorage
  useEffect(() => {
    localStorage.setItem("folders", JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    localStorage.setItem("activeFile", JSON.stringify(activeFile));
  }, [activeFile]);

  return (
    <AppContext.Provider
      value={{
        selectedTool,
        setSelectedTool,
        sidebarOpen,
        setSidebarOpen,
        folders,
        setFolders,
        activeFile,
        setActiveFile,
        fileHandle
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
