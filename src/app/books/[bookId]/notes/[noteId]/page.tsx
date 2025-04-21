// src/Components/NotesApp.tsx
import React, { useState, useEffect } from "react";
import {
  Search,
  User,
  PlusCircle,
  ArrowLeft,
  Tag,
  Edit,
  Trash2,
} from "lucide-react";
import Formato from "@/Components/Formato";
import MenuDesplegable from "@/Components/Menu_Desplegable";

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
  tags?: string[];
}

// Interfaz para la estructura completa de nota que maneja Formato
interface FullNote {
  id: number;
  title: string;
  date: string;
  content?: string;
  tags?: string[];
  cornell?: {
    content: string;
    keyPoints: string;
    summary: string;
  };
  feynman?: {
    concept: string;
    explanation: string;
    gaps: string;
    refinement: string;
  };
  charting?: {
    columns: any[];
  };
  mindMap?: {
    central: string;
    branches: any[];
  };
  lined?: {
    content: string;
  };
}

const NotesApp: React.FC<NotesAppProps> = ({ bookTitle, onBack }) => {
  // Estado para las notas (usando la estructura básica)
  const [notes, setNotes] = useState<BasicNote[]>([]);

  // Estado para la tabla de contenido
  const [tableOfContents, setTableOfContents] = useState<
    { id: number; text: string }[]
  >([]);

  // Estado para controlar la nota actualmente seleccionada (para la vista de formato)
  const [currentNote, setCurrentNote] = useState<FullNote | null>(null);

  // Estado para controlar si se está editando una nota
  const [isEditing, setIsEditing] = useState(false);

  // Estado para filtrar notas
  const [searchTerm, setSearchTerm] = useState("");

  // Carga inicial de datos de ejemplo
  useEffect(() => {
    // En una aplicación real, se cargarían desde un backend o localStorage
    const initialNotes: BasicNote[] = [];
    setNotes(initialNotes);

    // Generar tabla de contenidos vacía
    updateTableOfContents(initialNotes);
  }, []);

  // Actualiza la tabla de contenidos cuando cambian las notas
  const updateTableOfContents = (notesList: BasicNote[]) => {
    const toc = notesList.map((note) => ({
      id: note.id,
      text: note.title || "Sin título",
    }));

    // Si hay menos de 6 elementos, completar con guiones
    while (toc.length < 6) {
      toc.push({
        id: Date.now() + toc.length,
        text: "———————",
      });
    }

    setTableOfContents(toc);
  };

  // Función para manejar selecciones del menú
  const handleMenuOption = (optionId: string) => {
    console.log(`Acción seleccionada: ${optionId}`);
    if (optionId === "libros") {
      onBack();
    }
  };

  // Función para abrir el editor de notas
  const openNoteEditor = (note: BasicNote | null = null) => {
    if (note) {
      // Si abrimos una nota existente, creamos un objeto FullNote a partir de ella
      const fullNote: FullNote = {
        id: note.id,
        title: note.title,
        date: note.date,
        cornell: {
          content: note.content || "",
          keyPoints: "",
          summary: "",
        },
        feynman: {
          concept: "",
          explanation: "",
          gaps: "",
          refinement: "",
        },
        charting: {
          columns: [],
        },
        mindMap: {
          central: "",
          branches: [],
        },
        lined: {
          content: note.content || "",
        },
      };
      setCurrentNote(fullNote);
    } else {
      // Si es una nueva nota, creamos un objeto FullNote con valores iniciales
      const fullNote: FullNote = {
        id: Date.now(),
        title: "",
        date: new Date().toLocaleDateString(),
        cornell: {
          content: "",
          keyPoints: "",
          summary: "",
        },
        feynman: {
          concept: "",
          explanation: "",
          gaps: "",
          refinement: "",
        },
        charting: {
          columns: [],
        },
        mindMap: {
          central: "",
          branches: [],
        },
        lined: {
          content: "",
        },
      };
      setCurrentNote(fullNote);
    }
    setIsEditing(true);
  };

  // Función para guardar la nota editada y volver a la lista
  const saveNote = (note: FullNote) => {
    // Extraemos solo los campos básicos que necesitamos guardar
    const basicNoteData: BasicNote = {
      id: note.id,
      title: note.title || "Sin título",
      date: note.date || new Date().toLocaleDateString(),
      // Dependiendo del formato elegido, guardamos un tipo de contenido
      content:
        note.lined?.content ||
        note.cornell?.content ||
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

    // Actualizar tabla de contenidos
    updateTableOfContents([
      ...notes.filter((n) => n.id !== basicNoteData.id),
      basicNoteData,
    ]);

    setIsEditing(false);
    setCurrentNote(null);
  };

  // Función para cancelar la edición y volver a la lista de notas
  const cancelEditing = () => {
    setIsEditing(false);
    setCurrentNote(null);
  };

  // Función para eliminar una nota
  const deleteNote = (id: number) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    updateTableOfContents(updatedNotes);
  };

  // Filtrar notas según el término de búsqueda
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Si está en modo edición, mostrar el componente Formato
  if (isEditing && currentNote) {
    return (
      <Formato
        note={currentNote}
        onSave={(note: any) => saveNote(note)}
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
        <div className="flex gap-4">
          {/* Columna 1: Lista de notas */}
          <div className="flex-1 bg-white p-5 rounded-l-xl shadow-sm">
            {/* Lista de notas */}
            <div className="space-y-4">
              {filteredNotes.length > 0 ? (
                filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-4 border border-gray-100 rounded-lg hover:border-pink-200 hover:bg-pink-50 transition-colors relative group"
                  >
                    <div className="flex items-start">
                      <div
                        className="flex-grow cursor-pointer"
                        onClick={() => openNoteEditor(note)}
                      >
                        <h2 className="font-bold">{note.title}</h2>
                        <p className="text-sm text-gray-600">{note.date}</p>
                        {note.content && (
                          <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                            {note.content.substring(0, 100)}
                            {note.content.length > 100 ? "..." : ""}
                          </p>
                        )}
                      </div>

                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <button
                          onClick={() => openNoteEditor(note)}
                          className="p-1 bg-blue-100 rounded-full text-blue-600 hover:bg-blue-200"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : searchTerm ? (
                <div className="text-center p-8 text-gray-500">
                  <p>
                    No se encontraron notas que coincidan con "{searchTerm}"
                  </p>
                  <button
                    className="mt-4 text-pink-600 hover:underline"
                    onClick={() => setSearchTerm("")}
                  >
                    Limpiar búsqueda
                  </button>
                </div>
              ) : (
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
            {tableOfContents.length > 0 ? (
              <ul className="list-disc pl-6 space-y-2">
                {tableOfContents.map((item) => (
                  <li
                    key={item.id}
                    className={item.text === "———————" ? "text-gray-300" : ""}
                  >
                    {item.text}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-400">
                No hay elementos en la tabla de contenido
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesApp;
