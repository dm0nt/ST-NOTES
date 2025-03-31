// src/app/page.tsx
"use client";
import { useState } from "react";

export default function Home() {
  // Estado para controlar la visibilidad del menú desplegable
  const [menuVisible, setMenuVisible] = useState(false);

  // Función para alternar la visibilidad del menú
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  // Datos de ejemplo para las categorías
  const categorias = [
    { id: 1, nombre: "LIBRO", icono: "|" },
    { id: 2, nombre: "CATEGORÍA", icono: "|" },
    { id: 3, nombre: "CATEGORÍA", icono: "|" },
  ];

  return (
    <div className="container mx-auto p-4 max-w-screen-lg">
      {/* Marco principal */}
      <div className="border-2 border-black rounded-lg bg-white p-4">
        {/* Barra superior con menú, buscador y opciones de perfil */}
        <div className="flex justify-between items-center mb-4">
          {/* Menú desplegable */}
          <div className="flex items-center">
            <button onClick={toggleMenu} className="mr-4">
              <div className="w-6 h-0.5 bg-black mb-1"></div>
              <div className="w-6 h-0.5 bg-black mb-1"></div>
              <div className="w-6 h-0.5 bg-black"></div>
            </button>
            <span className="font-bold">MENÚ DESPLEGABLE</span>
          </div>

          {/* Buscador */}
          <div className="flex-grow mx-4">
            <input
              type="text"
              placeholder="BUSCADOR"
              className="w-full border-2 border-black rounded px-3 py-2 text-center"
            />
          </div>

          {/* Opciones de perfil y otros */}
          <div className="flex items-center">
            <span className="mr-2">OTROS</span>
            <button className="mr-2 border-2 border-black rounded p-2">
              <div className="w-4 h-4"></div>
            </button>
            <span className="mr-2">PERFIL</span>
            <button className="border-2 border-black rounded-full p-2">
              <div className="w-4 h-4 rounded-full"></div>
            </button>
          </div>
        </div>

        {/* Contenido principal con panel lateral y grid de categorías */}
        <div className="flex flex-col md:flex-row">
          {/* Panel lateral izquierdo */}
          <div className="w-full md:w-1/4 pr-0 md:pr-4 mb-4 md:mb-0">
            <div className="border-2 border-black rounded-lg p-4 mb-4">
              <p className="text-center">
                VISUALIZA CATEGORÍA EN LISTA DESPEGABLE, SOLO SE VISUALIZA
              </p>
            </div>
            <div className="border-2 border-black rounded-lg p-4">
              {/* Espacio en blanco para contenido adicional */}
            </div>
          </div>

          {/* Grid de categorías */}
          <div className="w-full md:w-3/4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Primera fila de categorías */}
            {categorias.map((categoria) => (
              <div
                key={categoria.id}
                className="border-2 border-black rounded-lg p-4"
              >
                <p className="text-center font-bold">CATEGORÍA</p>
                {categoria.nombre !== "CATEGORÍA" && (
                  <p className="text-center">{categoria.nombre}</p>
                )}
                <div className="flex justify-center mt-2">
                  <div className="w-1 h-8 bg-black"></div>
                </div>
              </div>
            ))}

            {/* Filas numéricas */}
            {[2, 3, 4].map((numero) => (
              <>
                {[1, 2, 3].map((indice) => (
                  <div
                    key={`${numero}-${indice}`}
                    className="border-2 border-black rounded-lg p-4"
                  >
                    <div className="flex justify-center">
                      <div className="text-5xl">{numero}</div>
                    </div>
                  </div>
                ))}
              </>
            ))}
          </div>
        </div>
      </div>

      {/* Menú desplegable */}
      {menuVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-10 flex">
          <div className="bg-white w-64 h-full p-4">
            <div className="flex justify-between mb-4">
              <h2 className="font-bold">Menú</h2>
              <button onClick={toggleMenu}>✕</button>
            </div>
            <ul>
              <li className="py-2 border-b">Inicio</li>
              <li className="py-2 border-b">Mis Notas</li>
              <li className="py-2 border-b">Categorías</li>
              <li className="py-2 border-b">Configuración</li>
              <li className="py-2">Cerrar Sesión</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
