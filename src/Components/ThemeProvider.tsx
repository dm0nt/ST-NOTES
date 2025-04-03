"use client";

import React from "react";

// Componente que fuerza el tema claro
const ThemeProvider = ({ children }) => {
  // Asegura que el tema claro se aplique en cuanto el componente se monte
  React.useEffect(() => {
    // Forzar modo claro
    document.documentElement.classList.remove("dark");
    document.documentElement.style.colorScheme = "light";
    document.body.classList.remove("dark");
    document.body.style.backgroundColor = "#ffffff";
    document.body.style.color = "#000000";
  }, []);

  return <div className="theme-provider light-mode">{children}</div>;
};

export default ThemeProvider;
