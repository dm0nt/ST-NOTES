"use client";

import React, { useState } from "react";
import { Search, User, PlusCircle } from "lucide-react";
import NotesApp from "@/Components/NotesApp";
import MenuDesplegable from "@/Components/Menu_Desplegable";

export default function Home() {
  // Estado para controlar si se muestra NotesApp
  const [showNotesApp, setShowNotesApp] = useState(false);

  // Estado para guardar el libro actual
  const [currentBook, setCurrentBook] = useState("");

  // Función para manejar selecciones del menú
  const handleMenuOption = (optionId: string) => {
    console.log(`Acción seleccionada: ${optionId}`);
    // Implementar lógica según sea necesario
  };

  // Función para abrir NotesApp con un libro específico
  const openBook = (bookTitle: string) => {
    setCurrentBook(bookTitle);
    setShowNotesApp(true);
  };

  // Función para volver a la página principal
  const goBackToMain = () => {
    setShowNotesApp(false);
  };

  // Función para crear un nuevo libro
  const createNewBook = () => {
    const newBookTitle = "Nuevo Libro - " + new Date().toLocaleDateString();
    openBook(newBookTitle);
  };

  // Si se está mostrando NotesApp, rendrizarlo
  if (showNotesApp) {
    return <NotesApp bookTitle={currentBook} onBack={goBackToMain} />;
  }

  // Si no, mostrar la página principal
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barra de navegación con menú, búsqueda y opciones */}
      <div className="sticky top-0 bg-white shadow-sm p-4 flex items-center justify-between">
        {/* Sección izquierda: Menú desplegable y logo */}
        <div className="flex items-center gap-4">
          <MenuDesplegable onSelectOption={handleMenuOption} />

          <div className="flex items-center">
            <span className="font-bold text-lg text-pink-600">ST-Notes</span>
          </div>
        </div>

        {/* Sección central: Búsqueda */}
        <div className="relative w-1/3">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar en mis libros..."
            className="block w-full pl-10 pr-3 py-2 border-2 border-pink-300 rounded-full focus:ring-pink-500 focus:border-pink-500 shadow-sm"
          />
        </div>

        {/* Sección derecha: Perfil de usuario */}
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-pink-100 border-2 border-pink-300 flex items-center justify-center">
            <User size={20} className="text-pink-600" />
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="p-6">
        {/* Encabezado de la sección */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Mis Libros</h1>
          <button
            className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors"
            onClick={createNewBook}
          >
            <PlusCircle size={18} />
            <span className="text-white">Nuevo Libro</span>
          </button>
        </div>

        {/* Sistema de tres columnas con separación vertical */}
        <div className="flex">
          {/* Columna 1: Libros recientes */}
          <div className="flex-1 bg-white p-5 rounded-l-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="text-pink-600">•</span>
              <span>Libros Recientes</span>
            </h2>

            {/* Tarjeta de libro */}
            <div
              className="p-4 mb-3 border border-gray-100 rounded-lg hover:border-pink-200 hover:bg-pink-50 transition-colors cursor-pointer"
              onClick={() => openBook("Cien años de soledad")}
            >
              <h3 className="font-medium">Cien años de soledad</h3>
              <p className="text-sm">Gabriel García Márquez</p>
              <div className="flex items-center gap-1 mt-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-xs">Actualizado recientemente</span>
              </div>
            </div>

            <button className="text-sm text-pink-600 hover:text-pink-800 mt-2">
              Ver todos
            </button>
          </div>

          {/* Separador vertical */}
          <div className="w-px bg-gray-200 mx-4"></div>

          {/* Columna 2: Categorías */}
          <div className="flex-1 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Categorías</h2>
            <div className="space-y-2">
              <div className="p-2 border border-gray-100 rounded hover:bg-pink-50 transition-colors">
                <span className="text-pink-600 mr-2">•</span>
                Literatura
              </div>
              <div className="p-2 border border-gray-100 rounded hover:bg-pink-50 transition-colors">
                <span className="text-blue-600 mr-2">•</span>
                Ciencia
              </div>
              <div className="p-2 border border-gray-100 rounded hover:bg-pink-50 transition-colors">
                <span className="text-green-600 mr-2">•</span>
                Historia
              </div>
            </div>
          </div>

          {/* Separador vertical */}
          <div className="w-px bg-gray-200 mx-4"></div>

          {/* Columna 3: Notas */}
          <div className="flex-1 bg-white p-5 rounded-r-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Notas</h2>
            <div className="text-center p-10 text-gray-400">
              <p>Selecciona un libro para ver sus notas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
