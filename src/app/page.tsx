"use client";

import React, { useState, useEffect } from "react";
import { Search, User, PlusCircle, Edit, Trash2, Check, X } from "lucide-react";
import NotesApp from "@/Components/NotesApp";
import MenuDesplegable from "@/Components/Menu_Desplegable";
import Calendar from "@/Components/Calendar";

// Interfaz para el tipo de libro
interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  color: string;
  lastUpdated: string;
}

// Colores pastel disponibles
const PASTEL_COLORS = [
  { name: "Rosa", value: "bg-pink-100" },
  { name: "Azul", value: "bg-blue-100" },
  { name: "Verde", value: "bg-green-100" },
  { name: "Amarillo", value: "bg-yellow-100" },
  { name: "Púrpura", value: "bg-purple-100" },
  { name: "Naranja", value: "bg-orange-100" },
  { name: "Turquesa", value: "bg-teal-100" },
];

export default function Home() {
  // Estado para controlar si se muestra NotesApp
  const [showNotesApp, setShowNotesApp] = useState(false);

  // Estado para guardar el libro actual
  const [currentBook, setCurrentBook] = useState<Book | null>(null);

  // Estado para los libros
  const [books, setBooks] = useState<Book[]>([]);

  // Estado para las categorías
  const [categories, setCategories] = useState<string[]>([]);

  // Estado para la nueva categoría
  const [newCategory, setNewCategory] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  // Estado para la edición de libros
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [editBookTitle, setEditBookTitle] = useState("");
  const [editBookAuthor, setEditBookAuthor] = useState("");
  const [editBookCategory, setEditBookCategory] = useState("");
  const [editBookColor, setEditBookColor] = useState("");

  // Cargar datos al iniciar
  useEffect(() => {
    // Intentar cargar libros desde localStorage
    const savedBooks = localStorage.getItem("st-notes-books");
    if (savedBooks) {
      try {
        setBooks(JSON.parse(savedBooks));
      } catch (e) {
        console.error("Error al cargar libros:", e);
        setBooks([]);
      }
    }

    // Intentar cargar categorías desde localStorage
    const savedCategories = localStorage.getItem("st-notes-categories");
    if (savedCategories) {
      try {
        setCategories(JSON.parse(savedCategories));
      } catch (e) {
        console.error("Error al cargar categorías:", e);
        setCategories([]);
      }
    }
  }, []);

  // Guardar libros en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem("st-notes-books", JSON.stringify(books));
  }, [books]);

  // Guardar categorías en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem("st-notes-categories", JSON.stringify(categories));
  }, [categories]);

  // Función para manejar selecciones del menú
  const handleMenuOption = (optionId: string) => {
    console.log(`Acción seleccionada: ${optionId}`);
    // Implementar lógica según sea necesario
  };

  // Función para abrir NotesApp con un libro específico
  const openBook = (book: Book) => {
    setCurrentBook(book);
    setShowNotesApp(true);
  };

  // Función para volver a la página principal
  const goBackToMain = () => {
    setShowNotesApp(false);
    // Mantenemos currentBook para conservar la selección
  };

  // Función para crear un nuevo libro
  const createNewBook = () => {
    const newBook: Book = {
      id: Date.now().toString(),
      title: "Nuevo Libro",
      author: "Sin autor",
      category: "", // Categoría vacía
      color: PASTEL_COLORS[0].value,
      lastUpdated: new Date().toLocaleDateString(),
    };

    const updatedBooks = [...books, newBook];
    setBooks(updatedBooks);

    // No seleccionamos automáticamente el libro al crearlo
    // para evitar que aparezca con el borde rosa
  };

  // Función para añadir una nueva categoría
  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory("");
    }
    setIsAddingCategory(false);
  };

  // Función para eliminar una categoría
  const deleteCategory = (categoryToDelete: string) => {
    // Eliminar la categoría de la lista
    setCategories(
      categories.filter((category) => category !== categoryToDelete)
    );

    // Actualizar libros que usen esta categoría
    setBooks(
      books.map((book) =>
        book.category === categoryToDelete ? { ...book, category: "" } : book
      )
    );
  };

  // Funciones para la edición de libros
  const startEditingBook = (book: Book) => {
    setEditingBookId(book.id);
    setEditBookTitle(book.title);
    setEditBookAuthor(book.author);
    setEditBookCategory(book.category);
    setEditBookColor(book.color);
  };

  const saveBookChanges = () => {
    setBooks(
      books.map((book) =>
        book.id === editingBookId
          ? {
              ...book,
              title: editBookTitle,
              author: editBookAuthor,
              category: editBookCategory,
              color: editBookColor,
              lastUpdated: new Date().toLocaleDateString(),
            }
          : book
      )
    );

    cancelEditingBook();
  };

  const cancelEditingBook = () => {
    setEditingBookId(null);
    setEditBookTitle("");
    setEditBookAuthor("");
    setEditBookCategory("");
    setEditBookColor("");
  };

  const deleteBook = (id: string) => {
    setBooks(books.filter((book) => book.id !== id));
    if (currentBook && currentBook.id === id) {
      setCurrentBook(null);
    }
  };

  // Si se está mostrando NotesApp, renderizarlo
  if (showNotesApp && currentBook) {
    return (
      <NotesApp
        bookTitle={currentBook.title}
        bookId={currentBook.id} // Pasamos el ID del libro
        onBack={goBackToMain}
      />
    );
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
        <div className="flex flex-col md:flex-row">
          {/* Columna 1: Libros recientes */}
          <div className="flex-1 bg-white p-5 rounded-l-xl shadow-sm mb-4 md:mb-0">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="text-pink-600">•</span>
              <span>Mis Libros</span>
            </h2>

            {books.length > 0 ? (
              <div className="space-y-4">
                {books.map((book) => (
                  <div key={book.id} className="relative">
                    {editingBookId === book.id ? (
                      <div
                        className={`p-4 border border-gray-200 rounded-lg ${editBookColor}`}
                      >
                        <div className="flex flex-col gap-2 mb-3">
                          <input
                            type="text"
                            value={editBookTitle}
                            onChange={(e) => setEditBookTitle(e.target.value)}
                            className="font-medium text-gray-900 border border-gray-300 rounded p-1"
                            placeholder="Título del libro"
                          />
                          <input
                            type="text"
                            value={editBookAuthor}
                            onChange={(e) => setEditBookAuthor(e.target.value)}
                            className="text-sm text-gray-600 border border-gray-300 rounded p-1"
                            placeholder="Autor"
                          />
                          <select
                            value={editBookCategory}
                            onChange={(e) =>
                              setEditBookCategory(e.target.value)
                            }
                            className="text-sm border border-gray-300 rounded p-1"
                          >
                            <option value="">Sin categoría</option>
                            {categories.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {PASTEL_COLORS.map((color) => (
                              <div
                                key={color.value}
                                onClick={() => setEditBookColor(color.value)}
                                className={`w-6 h-6 rounded-full ${
                                  color.value
                                } cursor-pointer ${
                                  editBookColor === color.value
                                    ? "ring-2 ring-pink-500"
                                    : ""
                                }`}
                                title={color.name}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={saveBookChanges}
                            className="p-1 bg-green-100 rounded text-green-600 hover:bg-green-200"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={cancelEditingBook}
                            className="p-1 bg-red-100 rounded text-red-600 hover:bg-red-200"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`p-4 border border-gray-200 hover:border-pink-200 hover:bg-pink-50 rounded-lg transition-all cursor-pointer ${book.color}`}
                        onClick={() => openBook(book)}
                      >
                        <div className="flex justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">
                              {book.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {book.author}
                            </p>
                            <div className="flex items-center gap-1 mt-2">
                              {book.category && (
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                                  {book.category}
                                </span>
                              )}
                              <span className="text-xs ml-2">
                                Actualizado: {book.lastUpdated}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // Evitar que se propague al clic del libro
                                startEditingBook(book);
                              }}
                              className="p-1 bg-blue-100 rounded text-blue-600 hover:bg-blue-200"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // Evitar que se propague al clic del libro
                                deleteBook(book.id);
                              }}
                              className="p-1 bg-red-100 rounded text-red-600 hover:bg-red-200"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-4 text-gray-500 border border-dashed border-gray-300 rounded-lg">
                <p>No hay libros todavía</p>
              </div>
            )}
          </div>

          {/* Separador vertical para pantallas medianas y grandes */}
          <div className="hidden md:block w-px bg-gray-200 mx-4"></div>

          {/* Columna 2: Categorías */}
          <div className="flex-1 bg-white p-5 shadow-sm mb-4 md:mb-0">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Categorías</h2>
              <button
                onClick={() => setIsAddingCategory(true)}
                className="text-xs bg-pink-100 hover:bg-pink-200 text-pink-600 px-2 py-1 rounded"
              >
                + Nueva
              </button>
            </div>

            {isAddingCategory && (
              <div className="mb-3 flex items-center gap-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="flex-1 border border-gray-300 rounded p-1 text-sm"
                  placeholder="Nombre de categoría"
                  autoFocus
                />
                <button
                  onClick={addCategory}
                  className="p-1 bg-green-100 rounded text-green-600 hover:bg-green-200"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={() => setIsAddingCategory(false)}
                  className="p-1 bg-red-100 rounded text-red-600 hover:bg-red-200"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <div className="space-y-2">
              {categories.length > 0 ? (
                categories.map((category, index) => (
                  <div
                    key={index}
                    className="p-2 border border-gray-100 rounded hover:bg-pink-50 transition-colors flex justify-between items-center"
                  >
                    <div>
                      <span className="text-pink-600 mr-2">•</span>
                      {category}
                    </div>
                    <button
                      onClick={() => deleteCategory(category)}
                      className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center p-3 text-gray-500 border border-dashed border-gray-300 rounded-lg">
                  <p>No hay categorías todavía</p>
                </div>
              )}
            </div>
          </div>

          {/* Separador vertical para pantallas medianas y grandes */}
          <div className="hidden md:block w-px bg-gray-200 mx-4"></div>

          {/* Columna 3: Vista Previa o Calendario */}
          <div className="flex-1 bg-white p-5 rounded-r-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Calendario</h2>
            <Calendar />
          </div>
        </div>
      </div>
    </div>
  );
}
