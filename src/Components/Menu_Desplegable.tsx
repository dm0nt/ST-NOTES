"use client";

import React, { useState } from "react";
import { Book, BookOpen, Settings, LogOut } from "lucide-react";

// Definición de la estructura de las opciones del menú
interface OpcionMenu {
  id: string;
  nombre: string;
  icono: React.ReactNode;
  accion: () => void;
}

const MenuDesplegable = () => {
  const [menuVisible, setMenuVisible] = useState(false);

  // Función para manejar clics en elementos del menú
  const handleMenuClick = (accion: string) => {
    console.log(`Acción seleccionada: ${accion}`);
    // Aquí puedes agregar la lógica de navegación o acciones
  };

  // Opciones del menú con sus iconos y nombres
  const opciones: OpcionMenu[] = [
    {
      id: "libros",
      nombre: "Mis Libros",
      icono: <Book size={20} color="black" />,
      accion: () => handleMenuClick("libros"),
    },
    {
      id: "configuracion",
      nombre: "Configuración",
      icono: <Settings size={20} color="black" />,
      accion: () => handleMenuClick("configuracion"),
    },
    {
      id: "salir",
      nombre: "Cerrar Sesión",
      icono: <LogOut size={20} color="black" />,
      accion: () => handleMenuClick("salir"),
    },
  ];

  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-pink-100 flex flex-col items-start py-6 z-40 transition-all duration-300 ease-in-out ${
        menuVisible ? "w-48" : "w-16"
      }`}
      onMouseEnter={() => setMenuVisible(true)}
      onMouseLeave={() => setMenuVisible(false)}
    >
      {/* Icono principal del menú */}
      <div className="mb-8 p-2 rounded-full cursor-pointer w-full flex items-center">
        <div className="flex justify-center w-12">
          {menuVisible ? (
            <BookOpen size={24} color="#db2777" />
          ) : (
            <Book size={24} color="#db2777" />
          )}
        </div>
        {menuVisible && (
          <span className="ml-2 font-medium text-black">ST-Notes</span>
        )}
      </div>

      {/* Opciones del menú */}
      <div className="w-full">
        <ul className="flex flex-col w-full">
          {opciones.map((opcion) => (
            <li
              key={opcion.id}
              className="w-full flex items-center py-3 hover:bg-pink-200 transition-colors cursor-pointer"
              onClick={opcion.accion}
            >
              {/* Contenedor para el icono que mantiene un ancho fijo */}
              <div className="flex justify-center w-16">{opcion.icono}</div>

              {/* Texto que aparece/desaparece según el estado del menú */}
              {menuVisible && (
                <span className="text-black transition-opacity duration-200">
                  {opcion.nombre}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MenuDesplegable;
