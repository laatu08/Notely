import React from 'react';
import { useAppContext } from '../context/AppContext';

const ShapeToolbar = () => {
  const { selectedTool, setSelectedTool } = useAppContext();

  const tools = [
    { name: "text", label: "Text" },
    { name: "rectangle", label: "Rectangle" },
    { name: "diamond", label: "Diamond" },
    { name: "arrow", label: "Arrow" },
    { name: "circle", label: "Circle" },
  ];

  return (
    <div className="bg-white/5 backdrop-blur-lg p-3 border border-gray-300 rounded-lg shadow-xl flex gap-3 fixed top-6 left-1/2 -translate-x-1/2 z-50">
      {tools.map((tool) => (
        <button
          key={tool.name}
          onClick={() => setSelectedTool(tool.name)}
          className={`px-4 py-1 rounded-md text-sm font-medium transition-all ${
            selectedTool === tool.name
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {tool.label}
        </button>
      ))}
    </div>
  );
};

export default ShapeToolbar;
