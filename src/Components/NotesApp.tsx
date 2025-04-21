// src/Components/NotesApp.tsx
import React, { useState, useEffect } from "react";
import { Search, User, PlusCircle, ArrowLeft } from "lucide-react";
import Formato from "@/Components/Formato";
import MenuDesplegable from "@/Components/Menu_Desplegable";

// Definimos los props para recibir de la página principal
interface NotesAppProps {
  bookTitle: string;
  bookId: string; // ID único para el libro
  onBack: () => void;
}

// Interfaz para la estructura básica de nota
interface BasicNote {
  id: number;
  title: string;
  date: string;
  content: string;
}

const NotesApp: React.FC<NotesAppProps> = ({ bookTitle, bookId, onBack }) => {
  // Estado para las notas del libro actual
  const [notes, setNotes] = useState<BasicNote[]>([]);

  // Estado para la tabla de contenido
  const [tableOfContents, setTableOfContents] = useState<
    { id: number; text: string }[]
  >([]);

  // Estado para controlar la nota actualmente seleccionada
  const [currentNote, setCurrentNote] = useState<BasicNote | null>(null);

  // Estado para controlar si se está editando una nota
  const [isEditing, setIsEditing] = useState(false);

  // Estado para búsqueda
  const [searchTerm, setSearchTerm] = useState("");

  // Cargar notas del localStorage al iniciar
  useEffect(() => {
    const savedNotes = localStorage.getItem(`st-notes-book-${bookId}`);
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes);
      setNotes(parsedNotes);

      // Generar tabla de contenido a partir de las notas
      setTableOfContents(
        parsedNotes.map((note: BasicNote) => ({
          id: note.id,
          text: note.title || "Sin título",
        }))
      );
    }
  }, [bookId]);

  // Guardar notas en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem(`st-notes-book-${bookId}`, JSON.stringify(notes));

    // Actualizar tabla de contenido
    setTableOfContents(
      notes.map((note) => ({
        id: note.id,
        text: note.title || "Sin título",
      }))
    );
  }, [notes, bookId]);

  // Función para manejar selecciones del menú
  const handleMenuOption = (optionId: string) => {
    if (optionId === "libros") {
      onBack();
    }
  };

  // Función para abrir el editor de notas
  const openNoteEditor = (note: BasicNote | null = null) => {
    setCurrentNote(
      note || {
        id: Date.now(),
        title: "",
        date: new Date().toLocaleDateString(),
        content: "",
      }
    );
    setIsEditing(true);
  };

  // Función para guardar la nota editada y volver a la lista
  const saveNote = (note: any) => {
    // Extraer los campos básicos de la nota (ignorando los campos específicos de formato)
    const basicNoteData: BasicNote = {
      id: note.id || Date.now(),
      title: note.title || "Sin título",
      date: note.date || new Date().toLocaleDateString(),
      content:
        note.cornell?.content ||
        note.lined?.content ||
        note.feynman?.concept ||
        "",
    };

    if (notes.some((n) => n.id === basicNoteData.id)) {
      // Actualizar nota existente
      setNotes(
        notes.map((n) => (n.id === basicNoteData.id ? basicNoteData : n))
      );
    } else {
      // Agregar nueva nota
      setNotes([...notes, basicNoteData]);
    }

    setIsEditing(false);
    setCurrentNote(null);
  };

  // Función para eliminar una nota
  const deleteNote = (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta nota?")) {
      setNotes(notes.filter((note) => note.id !== id));
    }
  };

  // Función para cancelar la edición y volver a la lista de notas
  const cancelEditing = () => {
    setIsEditing(false);
    setCurrentNote(null);
  };

  // Filtrar notas según el término de búsqueda
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Si está en modo edición, mostrar el componente Formato
  if (isEditing) {
    return (
      <Formato note={currentNote} onSave={saveNote} onBack={cancelEditing} />
    );
  }

  // Mostrar la lista de notas si no está en modo edición
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barra de navegación */}
      <div className="sticky top-0 bg-white shadow-sm p-4 flex items-center justify-between z-10">
        {/* Sección izquierda: Menú desplegable y volver */}
        <div className="flex items-center gap-4">
          <MenuDesplegable onSelectOption={handleMenuOption} />

          <button
            onClick={onBack}
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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

        {/* Sistema de dos columnas */}
        <div className="flex gap-4 flex-col md:flex-row">
          {/* Columna 1: Lista de notas */}
          <div className="w-full md:flex-1 bg-white p-5 rounded-l-xl shadow-sm">
            {/* Contador de notas */}
            <div className="text-sm text-gray-500 mb-4">
              {filteredNotes.length}{" "}
              {filteredNotes.length === 1 ? "nota" : "notas"}
              {searchTerm ? ` encontradas para "${searchTerm}"` : ""}
            </div>

            {/* Lista de notas */}
            <div className="space-y-4">
              {filteredNotes.length > 0 ? (
                filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-4 border border-gray-100 rounded-lg hover:border-pink-200 hover:bg-pink-50 transition-colors cursor-pointer group"
                  >
                    <div className="flex justify-between items-start">
                      <div
                        className="flex-1"
                        onClick={() => openNoteEditor(note)}
                      >
                        <h2 className="font-bold">{note.title}</h2>
                        <p className="text-sm text-gray-600">{note.date}</p>
                        {note.content && (
                          <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                            {note.content.substring(0, 100)}
                            {note.content.length > 100 ? "..." : ""}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-1"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-8 text-gray-500">
                  {searchTerm ? (
                    <p>No se encontraron notas que coincidan con tu búsqueda</p>
                  ) : (
                    <>
                      <p>No hay notas todavía</p>
                      <button
                        className="mt-4 text-pink-600 hover:underline"
                        onClick={() => openNoteEditor()}
                      >
                        Crear una nota
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Columna 2: Tabla de contenido */}
          <div className="w-full md:w-64 bg-white p-5 rounded-r-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Tabla de contenido</h2>

            {tableOfContents.length > 0 ? (
              <ul className="list-disc pl-6 space-y-2">
                {tableOfContents.map((item) => (
                  <li
                    key={item.id}
                    className="text-sm hover:text-pink-600 cursor-pointer"
                  >
                    <span
                      onClick={() => {
                        const note = notes.find((n) => n.id === item.id);
                        if (note) openNoteEditor(note);
                      }}
                    >
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 text-center">
                No hay elementos en la tabla de contenido
              </p>
            )}

            {/* Información sobre métodos de toma de notas */}
            <div className="mt-8 p-3 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium mb-2">Métodos disponibles</h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Cornell: Para estructura y revisión</li>
                <li>• Feynman: Conceptos complejos simplificados</li>
                <li>• Charting: Comparaciones y análisis</li>
                <li>• Mapa Mental: Ideas visuales conectadas</li>
                <li>• Líneas: Formato tradicional flexible</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesApp;
