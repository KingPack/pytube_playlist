import React from "react";

export default function LoadingBar({ progress = 50, color = "blue-500" }) {
  return (
    <div className="w-full max-w-xl bg-gray-800 rounded-full overflow-hidden h-4 shadow-inner">
      <div
        className={`h-full bg-${color}-500 transition-all duration-700 ease-in-out`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}
