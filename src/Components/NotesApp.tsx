// src/Components/NotesApp.tsx
import React, { useState } from "react";
import { Search, User, PlusCircle, ArrowLeft } from "lucide-react";
import Formato from "@/Components/Formato"; // Importamos el componente Formato
import MenuDesplegable from "@/Components/Menu_Desplegable"; // Importamos el menú optimizado

// Definimos los props para recibir de la página principal
interface NotesAppProps {
  bookTitle: string;
  onBack: () => void;
}

// Interfaz para la estructura básica de nota
interface BasicNote {
  id: number;
  title: string;
  date: string;
  content: string;
}

const NotesApp = ({ bookTitle, onBack }: NotesAppProps) => {
  // Estado para las notas (usando la estructura básica)
  const [notes, setNotes] = useState<BasicNote[]>([
    { id: 1, title: "TITULO", date: "FECHA DE CREACIÓN", content: "" },
    { id: 2, title: "TITULO", date: "FECHA DE CREACIÓN", content: "" },
    { id: 3, title: "TITULO", date: "FECHA DE CREACIÓN", content: "" },
  ]);

  // Estado para la tabla de contenido
  const [tableOfContents] = useState([
    { id: 1, text: "———————" },
    { id: 2, text: "———————" },
    { id: 3, text: "———————" },
    { id: 4, text: "———————" },
    { id: 5, text: "———————" },
    { id: 6, text: "———————" },
  ]);

  // Estado para controlar la nota actualmente seleccionada (para la vista de formato)
  const [currentNote, setCurrentNote] = useState<BasicNote | null>(null);

  // Estado para controlar si se está editando una nota
  const [isEditing, setIsEditing] = useState(false);

  // Función para manejar selecciones del menú
  const handleMenuOption = (optionId: string) => {
    console.log(`Acción seleccionada: ${optionId}`);
    // Implementar lógica adicional según sea necesario
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
  const saveNote = (note: BasicNote) => {
    // Extraemos solo los campos básicos que necesitamos guardar
    const basicNoteData: BasicNote = {
      id: note.id,
      title: note.title || "Sin título",
      date: note.date || new Date().toLocaleDateString(),
      content: note.content || "",
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

  // Función para cancelar la edición y volver a la lista de notas
  const cancelEditing = () => {
    setIsEditing(false);
    setCurrentNote(null);
  };

  // Si está en modo edición, mostrar el componente Formato
  if (isEditing) {
    return (
      <Formato
        note={currentNote} // Pasamos la estructura básica, Formato la expandirá según sea necesario
        onSave={(note: BasicNote) =>
          saveNote({
            ...note,
            content: "",
            id: note.id || Date.now(),
            date: note.date || new Date().toLocaleDateString(),
          })
        }
        onBack={cancelEditing}
      />
    );
  }

  // Mostrar la lista de notas si no está en modo edición
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barra de navegación con menú, búsqueda y opciones */}
      <div className="sticky top-0 bg-white shadow-sm p-4 flex items-center justify-between">
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
        <div className="flex gap-4">
          {/* Columna 1: Lista de notas */}
          <div className="flex-1 bg-white p-5 rounded-l-xl shadow-sm">
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
                <div className="text-center p-8 text-gray-500">
                  <p>No hay notas todavía</p>
                  <button
                    className="mt-4 text-pink-600 hover:underline"
                    onClick={() => openNoteEditor()}
                  >
                    Crear una nota
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Columna 2: Tabla de contenido */}
          <div className="w-64 bg-white p-5 rounded-r-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Tabla de contenido</h2>
            <ul className="list-disc pl-6 space-y-2">
              {tableOfContents.map((item) => (
                <li key={item.id}>{item.text}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesApp;
