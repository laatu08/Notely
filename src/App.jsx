import Sidebar from "../src/components/Sidebar";
import CanvasEditor from "../src/components/CanvasEditor";
import Topbar from "../src/components/Topbar";
import ShapeToolbar from "../src/components/ShapeToolbar";
import { AppProvider } from "./context/AppContext";
import { useState } from "react";
import Toast from "./components/Toast";

function App() {
        const [toastMessage, setToastMessage] = useState("");

  return (

    <AppProvider>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar fixed width */}
        <Sidebar />

        {/* Main content area takes remaining space */}
        <div className="relative flex flex-col flex-1 h-full overflow-hidden">
          {/* Topbar at top */}
          <Topbar showToast={setToastMessage} />

          {/* Centered floating toolbar */}
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50">
            <ShapeToolbar />
          </div>

          {/* Canvas takes full remaining space */}
          <div className="flex-1 overflow-auto">
            <CanvasEditor />
          </div>
        </div>
         {toastMessage && (
          <Toast message={toastMessage} onClose={() => setToastMessage("")} />
        )}
      </div>
    </AppProvider>
  );
}

export default App;
