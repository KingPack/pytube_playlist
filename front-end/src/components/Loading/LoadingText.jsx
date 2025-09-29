import React from "react";

export default function LoadingText({ text = "Carregando..." }) {
  return (
    <p className="text-white text-xl font-semibold animate-pulse text-center">
      {text}
    </p>
  );
}
