"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Search, User, PlusCircle, ArrowLeft } from "lucide-react";
import MenuDesplegable from "@/Components/Menu_Desplegable";

// Interfaz para la estructura básica de nota
interface BasicNote {
  id: number;
  title: string;
  date: string;
  content: string;
}

// Función auxiliar para formatear la fecha en formato "Mes día, año"
const getCurrentFormattedDate = (): string => {
  const now = new Date();
  const month = now.toLocaleString("es-ES", { month: "long" });
  // Capitalizamos la primera letra del mes
  const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
  const day = now.getDate();
  const year = now.getFullYear();
  return `${capitalizedMonth} ${day}, ${year}`;
};

export default function BookPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.bookId as string;

  // Decodificar el título del libro a partir del ID
  const bookTitle = decodeURIComponent(bookId).replace(/-/g, " ");

  // Estado para las notas (en una aplicación real vendría de una base de datos)
  const [notes, setNotes] = useState<BasicNote[]>([]);

  // Función para manejar selecciones del menú
  const handleMenuOption = (optionId: string) => {
    console.log(`Acción seleccionada: ${optionId}`);
    if (optionId === "libros") {
      router.push("/");
    }
  };

  // Función para abrir el editor de notas
  const openNoteEditor = (note: BasicNote | null = null) => {
    if (note) {
      router.push(`/books/${bookId}/notes/${note.id}`);
    } else {
      // Crear un nuevo ID para la nota
      const newNoteId = Date.now();
      router.push(`/books/${bookId}/notes/${newNoteId}`);
    }
  };

  // Función para volver a la página principal
  const goBackToMain = () => {
    router.push("/");
  };

  // Efecto para simular la carga de datos
  useEffect(() => {
    // Aquí se podrían cargar las notas del libro desde una API
    console.log(`Cargando notas para el libro: ${bookTitle}`);
  }, [bookTitle]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barra de navegación con menú, búsqueda y opciones */}
      <div className="sticky top-0 bg-white shadow-sm p-4 flex items-center justify-between">
        {/* Sección izquierda: Menú desplegable y volver */}
        <div className="flex items-center gap-4">
          <MenuDesplegable onSelectOption={handleMenuOption} />

          <button
            onClick={goBackToMain}
            className="p-2 rounded-md hover:bg-pink-50 transition-colors flex items-center"
          >
            <ArrowLeft size={20} color="#db2777" />
            <span className="ml-1 text-pink-600">Volver</span>
          </button>
          <h1 className="text-lg font-bold">{bookTitle}</h1>
        </div>

        {/* Sección central: Búsqueda */}
        <div className="relative w-1/3">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar en notas..."
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
          <h1 className="text-2xl font-bold italic">NOTAS</h1>
          <button
            className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors"
            onClick={() => openNoteEditor()}
          >
            <PlusCircle size={18} />
            <span className="text-white">Nueva Nota</span>
          </button>
        </div>

        {/* Lista de notas - Ocupa todo el ancho disponible */}
        <div className="bg-white p-5 rounded-xl shadow-sm">
          {/* Lista de notas */}
          <div className="space-y-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className="p-4 border border-gray-100 rounded-lg hover:border-pink-200 hover:bg-pink-50 transition-colors cursor-pointer"
                onClick={() => openNoteEditor(note)}
              >
                <h2 className="font-bold">{note.title}</h2>
                <p className="text-sm text-gray-600">{note.date}</p>
              </div>
            ))}
            {notes.length === 0 && (
              <div className="text-center p-20 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-lg text-gray-600 font-medium">
                  No hay notas todavía
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
