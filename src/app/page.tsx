"use client";

import React, { useState } from "react";
import {
  Search,
  User,
  BookOpen,
  Book,
  Settings,
  LogOut,
  PlusCircle,
} from "lucide-react";
import NotesApp from "@/Components/NotesApp";

// Estilos inline para forzar el color negro
const textStyle = { color: "black" };
const titleStyle = { color: "black", fontWeight: "bold" };

export default function Home() {
  // Estado para controlar si el menú está desplegado
  const [menuDesplegado, setMenuDesplegado] = useState(false);
  // Estado para controlar sobre qué opción está el hover
  const [opcionHover, setOpcionHover] = useState<string | null>(null);
  // Estado para controlar si se muestra NotesApp
  const [showNotesApp, setShowNotesApp] = useState(false);
  // Estado para guardar el libro actual
  const [currentBook, setCurrentBook] = useState("");

  // Opciones del menú principal
  const opcionesMenu = [
    {
      id: "libros",
      nombre: "Mis Libros",
      icono: <Book size={20} color="#db2777" />,
    },
    {
      id: "configuracion",
      nombre: "Configuración",
      icono: <Settings size={20} color="#db2777" />,
    },
    {
      id: "salir",
      nombre: "Cerrar Sesión",
      icono: <LogOut size={20} color="#db2777" />,
    },
  ];

  // Función para manejar clics en elementos del menú
  const handleMenuClick = (accion: string) => {
    console.log(`Acción seleccionada: ${accion}`);
    // Aquí puedes agregar la lógica de navegación o acciones
    setMenuDesplegado(false); // Ocultar menú después de hacer clic
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
        <div className="flex items-center">
          {/* Menú desplegable */}
          <div
            className="relative mr-4"
            onMouseEnter={() => setMenuDesplegado(true)}
            onMouseLeave={() => {
              setMenuDesplegado(false);
              setOpcionHover(null);
            }}
          >
            {/* Icono del libro (cerrado/abierto) */}
            <button className="p-2 rounded-md hover:bg-pink-50 transition-colors">
              {menuDesplegado ? (
                <BookOpen size={24} color="#db2777" />
              ) : (
                <Book size={24} color="#db2777" />
              )}
            </button>

            {/* Menú desplegable que aparece al hacer hover - sin espaciado adicional (eliminado mt-1) */}
            {menuDesplegado && (
              <div className="absolute left-0 top-full bg-white shadow-lg rounded-md py-2 z-50 w-10 border border-pink-100">
                {opcionesMenu.map((opcion) => (
                  <div
                    key={opcion.id}
                    className="relative"
                    onClick={() => handleMenuClick(opcion.id)}
                    onMouseEnter={() => setOpcionHover(opcion.id)}
                    onMouseLeave={() => setOpcionHover(null)}
                  >
                    <button className="flex items-center justify-center p-2 w-full hover:bg-pink-50 transition-colors">
                      <div>{opcion.icono}</div>
                    </button>

                    {/* Texto flotante con fondo gris claro y texto negro */}
                    {opcionHover === opcion.id && (
                      <div
                        className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-gray-200 text-black px-3 py-1 rounded-md text-sm whitespace-nowrap z-50 shadow-sm opacity-0 animate-fadeIn"
                        style={{
                          animation: "fadeIn 0.2s ease-in-out forwards",
                          color: "black",
                        }}
                      >
                        {opcion.nombre}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Logo/Título */}
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
            style={{ color: "black" }}
          />
        </div>

        {/* Sección derecha: Perfil de usuario */}
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-pink-100 border-2 border-pink-300 flex items-center justify-center">
            <User size={20} className="text-pink-600" />
          </div>
        </div>
      </div>

      {/* Definición de la animación de aparición */}
      <style jsx global>{`
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

      {/* Contenido principal */}
      <div className="p-6">
        {/* Encabezado de la sección */}
        <div className="flex justify-between items-center mb-6">
          <h1 style={titleStyle} className="text-2xl font-bold">
            Mis Libros
          </h1>
          <button
            className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors"
            onClick={createNewBook}
          >
            <PlusCircle size={18} />
            <span style={{ color: "white" }}>Nuevo Libro</span>
          </button>
        </div>

        {/* Sistema de tres columnas con separación vertical */}
        <div className="flex">
          {/* Columna 1: Libros recientes */}
          <div className="flex-1 bg-white p-5 rounded-l-xl shadow-sm">
            <h2
              style={titleStyle}
              className="text-lg font-semibold mb-4 flex items-center gap-2"
            >
              <BookOpen size={18} className="text-pink-600" />
              <span>Libros Recientes</span>
            </h2>

            {/* Tarjeta de libro */}
            <div
              className="p-4 mb-3 border border-gray-100 rounded-lg hover:border-pink-200 hover:bg-pink-50 transition-colors cursor-pointer"
              onClick={() => openBook("Cien años de soledad")}
            >
              <h3 style={titleStyle} className="font-medium">
                Cien años de soledad
              </h3>
              <p style={textStyle} className="text-sm">
                Gabriel García Márquez
              </p>
              <div className="flex items-center gap-1 mt-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span style={textStyle} className="text-xs">
                  Actualizado recientemente
                </span>
              </div>
            </div>

            <button
              style={{ color: "#db2777" }}
              className="text-sm hover:text-pink-800 mt-2"
            >
              Ver todos
            </button>
          </div>

          {/* Separador vertical */}
          <div className="w-px bg-gray-200 mx-4"></div>

          {/* Columna 2: Categorías (solo título) */}
          <div className="flex-1 bg-white p-5 shadow-sm">
            <h2 style={titleStyle} className="text-lg font-semibold mb-4">
              Categorías
            </h2>
            {/* Contenido eliminado pero manteniendo el título */}
          </div>

          {/* Separador vertical */}
          <div className="w-px bg-gray-200 mx-4"></div>

          {/* Columna 3: Nueva categoría (solo título) */}
          <div className="flex-1 bg-white p-5 rounded-r-xl shadow-sm">
            <h2 style={titleStyle} className="text-lg font-semibold mb-4">
              Notas
            </h2>
            {/* Sin contenido */}
          </div>
        </div>
      </div>
    </div>
  );
}
