// src/Components/NotesApp.tsx
import React, { useState } from "react";
import {
  Search,
  User,
  PlusCircle,
  ArrowLeft,
  BookText, // Icono para Cornell
  Brain, // Icono para Feynman
  Table, // Icono para Charting
  Network, // Icono para Mapa Mental
  AlignLeft, // Icono para Líneas
} from "lucide-react";
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
    columns: any[]; // Puedes detallar esto más según tu estructura
  };
  mindMap?: {
    central: string;
    branches: any[]; // Puedes detallar esto más según tu estructura
  };
  lined?: {
    content: string;
  };
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

const NotesApp = ({ bookTitle, onBack }: NotesAppProps) => {
  // Estado para las notas (usando la estructura básica)
  const [notes, setNotes] = useState<BasicNote[]>([
    {
      id: 1,
      title: `Nota ${getCurrentFormattedDate()}`,
      date: getCurrentFormattedDate(),
      content: "",
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
      lined: {
        content: "",
      },
    },
    {
      id: 2,
      title: `Nota ${getCurrentFormattedDate()}`,
      date: getCurrentFormattedDate(),
      content: "",
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
      lined: {
        content: "",
      },
    },
    {
      id: 3,
      title: `Nota ${getCurrentFormattedDate()}`,
      date: getCurrentFormattedDate(),
      content: "",
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
      lined: {
        content: "",
      },
    },
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

  // Estado para el formato seleccionado
  const [selectedFormat, setSelectedFormat] = useState("cornell");

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
        title: `Nota ${getCurrentFormattedDate()}`,
        date: getCurrentFormattedDate(),
        content: "",
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
      }
    );
    setIsEditing(true);
  };

  // Función para guardar la nota editada y volver a la lista
  const saveNote = (note: BasicNote) => {
    // Conservar todos los campos de la nota
    const fullNoteData: BasicNote = {
      id: note.id || Date.now(),
      title: note.title || "Sin título",
      date: note.date || getCurrentFormattedDate(),
      content: note.content || "",
      cornell: note.cornell || {
        content: "",
        keyPoints: "",
        summary: "",
      },
      feynman: note.feynman || {
        concept: "",
        explanation: "",
        gaps: "",
        refinement: "",
      },
      charting: note.charting || {
        columns: [],
      },
      mindMap: note.mindMap || {
        central: "",
        branches: [],
      },
      lined: note.lined || {
        content: "",
      },
    };

    if (notes.some((n) => n.id === fullNoteData.id)) {
      // Actualizar nota existente
      setNotes(notes.map((n) => (n.id === fullNoteData.id ? fullNoteData : n)));
    } else {
      // Agregar nueva nota
      setNotes([...notes, fullNoteData]);
    }

    setIsEditing(false);
    setCurrentNote(null);
  };