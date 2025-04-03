"use client";

import React, { ReactNode, useEffect } from "react";

interface ThemeProviderProps {
  children: ReactNode;
}

// Componente que fuerza el tema claro
const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Asegura que el tema claro se aplique en cuanto el componente se monte
  useEffect(() => {
    // Forzar modo claro
    document.documentElement.classList.remove("dark");
    document.documentElement.style.colorScheme = "light";
    document.body.classList.remove("dark");
    document.body.style.backgroundColor = "#ffffff";
    document.body.style.color = "#000000";

    // Agregar estilos globales para garantizar texto negro
    const styleEl = document.createElement("style");
    styleEl.innerHTML = `
      p, h1, h2, h3, h4, h5, h6, span, div, li, label {
        color: black !important;
      }
      
      /* Excepciones para botones con fondo de color */
      .bg-pink-600 *, .bg-pink-700 * {
        color: white !important;
      }
      
      .text-pink-600 {
        color: #db2777 !important;
      }
    `;
    document.head.appendChild(styleEl);

    return () => {
      // Remover los estilos al desmontar
      document.head.removeChild(styleEl);
    };
  }, []);

  return <div className="theme-provider light-mode">{children}</div>;
};

export default ThemeProvider;
