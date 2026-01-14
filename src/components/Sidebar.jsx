import React, { useReducer } from "react";
import { Plus, FilePlus, Trash2, Pencil, ChevronDown, ChevronRight } from "lucide-react";

// -------------------- TYPES --------------------
// Folder: { id, name, files: [{ id, name, content }] }
// ActiveFile: { id, folderId }

// -------------------- REDUCER --------------------
const initialState = {
  folders: [],
  expanded: {},
  activeFile: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "ADD_FOLDER": {
      const id = Date.now().toString();
      return {
        ...state,
        folders: [...state.folders, { id, name: action.name, files: [] }],
        expanded: { ...state.expanded, [id]: true },
      };
    }

    case "RENAME_FOLDER":
      return {
        ...state,
        folders: state.folders.map(f =>
          f.id === action.folderId ? { ...f, name: action.name } : f
        ),
      };

    case "DELETE_FOLDER": {
      const folders = state.folders.filter(f => f.id !== action.folderId);
      const expanded = { ...state.expanded };
      delete expanded[action.folderId];

      const activeFile =
        state.activeFile?.folderId === action.folderId
          ? null
          : state.activeFile;

      return { ...state, folders, expanded, activeFile };
    }

    case "TOGGLE_FOLDER":
      return {
        ...state,
        expanded: {
          ...state.expanded,
          [action.folderId]: !state.expanded[action.folderId],
        },
      };

    case "ADD_FILE":
      return {
        ...state,
        folders: state.folders.map(f =>
          f.id === action.folderId
            ? {
                ...f,
                files: [...f.files, { id: Date.now().toString(), name: action.name, content: "" }],
              }
            : f
        ),
      };

    case "RENAME_FILE":
      return {
        ...state,
        folders: state.folders.map(f =>
          f.id === action.folderId
            ? {
                ...f,
                files: f.files.map(file =>
                  file.id === action.fileId ? { ...file, name: action.name } : file
                ),
              }
            : f
        ),
      };

    case "DELETE_FILE": {
      const folders = state.folders.map(f =>
        f.id === action.folderId
          ? { ...f, files: f.files.filter(file => file.id !== action.fileId) }
          : f
      );

      const activeFile =
        state.activeFile?.id === action.fileId ? null : state.activeFile;

      return { ...state, folders, activeFile };
    }

    case "SET_ACTIVE_FILE":
      return { ...state, activeFile: action.file };

    default:
      return state;
  }
}

// -------------------- UTIL --------------------
const safePrompt = (msg) => {
  const v = prompt(msg);
  return v && v.trim() ? v.trim() : null;
};

// -------------------- COMPONENT --------------------
export default function Sidebar() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div className="w-64 bg-gray-100 p-4 border-r overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Folders</h2>
        <button
          onClick={() => {
            const name = safePrompt("Enter folder name");
            if (name) dispatch({ type: "ADD_FOLDER", name });
          }}
        >
          <Plus size={16} />
        </button>
      </div>

      {state.folders.map(folder => (
        <div key={folder.id} className="mb-2">
          <div className="flex justify-between items-center">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => dispatch({ type: "TOGGLE_FOLDER", folderId: folder.id })}
            >
              {state.expanded[folder.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <span className="ml-1 font-semibold">{folder.name}</span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => {
                  const name = safePrompt("Enter file name");
                  if (name) dispatch({ type: "ADD_FILE", folderId: folder.id, name });
                }}
              >
                <FilePlus size={14} />
              </button>
              <button
                onClick={() => {
                  const name = safePrompt("Rename folder");
                  if (name) dispatch({ type: "RENAME_FOLDER", folderId: folder.id, name });
                }}
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => dispatch({ type: "DELETE_FOLDER", folderId: folder.id })}
                className="text-red-500"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {state.expanded[folder.id] && (
            <ul className="ml-5 mt-2 space-y-1">
              {folder.files.map(file => (
                <li
                  key={file.id}
                  onClick={() => dispatch({ type: "SET_ACTIVE_FILE", file: { id: file.id, folderId: folder.id } })}
                  className="flex justify-between items-center bg-white px-2 py-1 rounded hover:bg-gray-200 cursor-pointer"
                >
                  <span>{file.name}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        const name = safePrompt("Rename file");
                        if (name)
                          dispatch({ type: "RENAME_FILE", folderId: folder.id, fileId: file.id, name });
                      }}
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        dispatch({ type: "DELETE_FILE", folderId: folder.id, fileId: file.id });
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
}
