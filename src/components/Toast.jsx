import React, { useEffect } from "react";

const Toast = ({ message, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-green-600 text-white px-4 py-2 rounded shadow-lg animate-fade-in-up">
      {message}
    </div>
  );
};

export default Toast;
