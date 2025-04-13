"use client";

import React, { useState } from "react";
import { Book, BookOpen, Settings, LogOut } from "lucide-react";

// Interfaz para las opciones del menú
interface MenuOption {
  id: string;
  icon: React.ReactNode;
  label: string;
  action: () => void;
}

interface MenuDesplegableProps {
  onSelectOption?: (optionId: string) => void;
}

const MenuDesplegable: React.FC<MenuDesplegableProps> = ({
  onSelectOption = () => {},
}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [hoverOptionId, setHoverOptionId] = useState<string | null>(null);

  // Opciones del menú
  const menuOptions: MenuOption[] = [
    {
      id: "libros",
      icon: <Book size={20} color="#db2777" />,
      label: "Mis Libros",
      action: () => onSelectOption("libros"),
    },
    {
      id: "configuracion",
      icon: <Settings size={20} color="#db2777" />,
      label: "Configuración",
      action: () => onSelectOption("configuracion"),
    },
    {
      id: "salir",
      icon: <LogOut size={20} color="#db2777" />,
      label: "Cerrar Sesión",
      action: () => onSelectOption("salir"),
    },
  ];

  // Función para manejar clics en elementos del menú
  const handleMenuClick = (option: MenuOption) => {
    option.action();
    setMenuVisible(false);
  };

  return (
    <div className="relative">
      {/* Botón principal del menú */}
      <div
        className="p-2 rounded-md hover:bg-pink-50 transition-colors cursor-pointer"
        onMouseEnter={() => setMenuVisible(true)}
        onMouseLeave={() => {
          setMenuVisible(false);
          setHoverOptionId(null);
        }}
      >
        {menuVisible ? (
          <BookOpen size={24} color="#db2777" />
        ) : (
          <Book size={24} color="#db2777" />
        )}
      </div>

      {/* Menú desplegable */}
      {menuVisible && (
        <div
          className="absolute left-0 top-full mt-1 bg-white shadow-lg rounded-md py-2 z-50 w-10 border border-pink-100"
          onMouseEnter={() => setMenuVisible(true)}
          onMouseLeave={() => {
            setMenuVisible(false);
            setHoverOptionId(null);
          }}
        >
          {menuOptions.map((option) => (
            <div
              key={option.id}
              className="relative"
              onClick={() => handleMenuClick(option)}
              onMouseEnter={() => setHoverOptionId(option.id)}
              onMouseLeave={() => setHoverOptionId(null)}
            >
              <button className="flex items-center justify-center p-2 w-full hover:bg-pink-50 transition-colors">
                {option.icon}
              </button>

              {/* Texto flotante al hacer hover */}
              {hoverOptionId === option.id && (
                <div
                  className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-gray-200 text-black px-3 py-1 rounded-md text-sm whitespace-nowrap z-50 shadow-sm opacity-0 animate-fadeIn"
                  style={{
                    animation: "fadeIn 0.2s ease-in-out forwards",
                    color: "black",
                  }}
                >
                  {option.label}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Estilos para la animación */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-5px) translateY(-50%);
          }
          to {
            opacity: 1;
            transform: translateX(0) translateY(-50%);
          }
        }
      `}</style>
    </div>
  );
};

export default MenuDesplegable;
