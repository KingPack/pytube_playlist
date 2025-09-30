import React from "react";

export default function LoadingCircle({ size = 40, color = "white", message }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div
        className="animate-spin rounded-full border-t-4 border-b-4"
        style={{
          width: size,
          height: size,
          borderColor: `${color} transparent ${color} transparent`,
        }}
      />
      {message && <span className="text-sm text-gray-300">{message}</span>}
    </div>
  );
}
