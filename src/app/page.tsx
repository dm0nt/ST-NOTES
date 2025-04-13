"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, User, PlusCircle } from "lucide-react";
import MenuDesplegable from "@/Components/Menu_Desplegable";

export default function Home() {
  const router = useRouter();
  const [showNewBookModal, setShowNewBookModal] = useState(false);
  const [newBookTitle, setNewBookTitle] = useState("");
  const [newBookCategory, setNewBookCategory] = useState("");
  const [recentBooks, setRecentBooks] = useState([]);

  // Función para manejar selecciones del menú
  const handleMenuOption = (optionId: string) => {
    console.log(`Acción seleccionada: ${optionId}`);
    if (optionId === "libros") {
      // Redirigir a la página principal (ya estamos en ella)
      router.refresh();
    }
    // Implementar otras acciones según sea necesario
  };

  // Función para abrir un libro con una ruta específica
  const openBook = (bookTitle: string) => {
    // Crear un ID basado en el título
    const bookId = encodeURIComponent(
      bookTitle.replace(/\s+/g, "-").toLowerCase()
    );
    router.push(`/books/${bookId}`);
  };

  // Función para mostrar el modal de nuevo libro
  const showNewBookDialog = () => {
    setShowNewBookModal(true);
  };

  // Función para crear un nuevo libro
  const createNewBook = () => {
    if (newBookTitle.trim() === "") {
      alert("Por favor ingresa un título para el libro");
      return;
    }

    const newBook = {
      title: newBookTitle,
      category: newBookCategory,
      date: new Date().toLocaleDateString(),
    };

    // Agregar el nuevo libro a la lista de libros recientes
    setRecentBooks([newBook, ...recentBooks]);

    // Cerrar el modal y limpiar los campos
    setShowNewBookModal(false);
    setNewBookTitle("");
    setNewBookCategory("");

    // Redirigir al nuevo libro
    openBook(newBook.title);
  };

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
            onClick={showNewBookDialog}
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

            {/* Lista de libros recientes */}
            {recentBooks.length > 0 ? (
              <div className="space-y-3">
                {recentBooks.map((book, index) => (
                  <div
                    key={index}
                    className="p-4 mb-3 border border-gray-100 rounded-lg hover:border-pink-200 hover:bg-pink-50 transition-colors cursor-pointer"
                    onClick={() => openBook(book.title)}
                  >
                    <h3 className="font-medium">{book.title}</h3>
                    <p className="text-sm">{book.category}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="text-xs">Actualizado recientemente</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-6 text-gray-500">
                <p className="mt-2">Crea un nuevo libro para comenzar</p>
              </div>
            )}

            <button
              className="text-sm text-pink-600 hover:text-pink-800 mt-2"
              onClick={() => {}}
            >
              Ver todos
            </button>
          </div>

          {/* Separador vertical */}
          <div className="w-px bg-gray-200 mx-4"></div>

          {/* Columna 2: Categorías */}
          <div className="flex-1 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Categorías</h2>
            <p className="p-10 text-center">Stay Tunned</p>
          </div>

          {/* Separador vertical */}
          <div className="w-px bg-gray-200 mx-4"></div>

          {/* Columna 3: Notas */}
          <div className="flex-1 bg-white p-5 rounded-r-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Notas</h2>
            <div className="text-center p-10 text-gray-400">
              <p>Stay Tunned</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para nuevo libro */}
      {showNewBookModal && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
          <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl p-8 w-[500px] shadow-2xl border-2 border-pink-400">
            <h2 className="text-xl font-bold mb-4 text-center">Nuevo Libro</h2>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del libro
              </label>
              <input
                type="text"
                value={newBookTitle}
                onChange={(e) => setNewBookTitle(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                placeholder="Ingresa el título del libro"
              />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <input
                type="text"
                value={newBookCategory}
                onChange={(e) => setNewBookCategory(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                placeholder="Ingresa la categoría (opcional)"
              />
            </div>

            <div className="flex justify-center gap-4">
              <button
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 font-medium"
                onClick={() => setShowNewBookModal(false)}
              >
                Cancelar
              </button>
              <button
                className="px-6 py-2 bg-pink-600 text-white rounded-full hover:bg-pink-700 font-medium"
                onClick={createNewBook}
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
