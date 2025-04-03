"use client";

import React, { useState } from "react";
import { Book, BookOpen, Settings, LogOut } from "lucide-react";

// Componente simplificado del menú
const MenuDesplegable = () => {
  const [menuVisible, setMenuVisible] = useState(false);

  // Función para manejar clics en elementos del menú
  const handleMenuClick = (accion: string) => {
    console.log(`Acción seleccionada: ${accion}`);
    // Aquí puedes agregar la lógica de navegación o acciones
  };

  return (
    <div
      className="fixed left-0 top-0 h-screen w-16 bg-pink-100 flex flex-col items-center py-6 z-40"
      onMouseEnter={() => setMenuVisible(true)}
      onMouseLeave={() => setMenuVisible(false)}
    >
      {/* Icono principal del menú */}
      <div className="mb-8 p-2 rounded-full cursor-pointer">
        {menuVisible ? (
          <BookOpen size={24} color="#db2777" />
        ) : (
          <Book size={24} color="#db2777" />
        )}
      </div>

      {/* Contenedor de opciones del menú */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden w-full ${
          menuVisible ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col items-center">
          <li
            className="w-full flex justify-center py-3 hover:bg-pink-200 transition-colors cursor-pointer"
            onClick={() => handleMenuClick("libros")}
          >
            <Book size={20} color="black" />
          </li>
          <li
            className="w-full flex justify-center py-3 hover:bg-pink-200 transition-colors cursor-pointer"
            onClick={() => handleMenuClick("configuracion")}
          >
            <Settings size={20} color="black" />
          </li>
          <li
            className="w-full flex justify-center py-3 hover:bg-pink-200 transition-colors cursor-pointer"
            onClick={() => handleMenuClick("salir")}
          >
            <LogOut size={20} color="black" />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MenuDesplegable;
