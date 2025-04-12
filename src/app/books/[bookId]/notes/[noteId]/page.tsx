"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Formato from "@/Components/Formato";

// Definición de la interfaz MainNote
interface MainNote {
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
    columns: Array<{
      header: string;
      content: string[];
    }>;
  };
  mindMap?: {
    central: string;
    branches: Array<{
      text: string;
      children?: Array<{
        text: string;
        children?: Array<{
          text: string;
        }>;
      }>;
    }>;
  };
  lined?: {
    content: string;
  };
}

export default function NotePage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.bookId as string;
  const noteId = params.noteId as string;

  // Mock data - En una app real, esto vendría de una base de datos
  const [note, setNote] = useState<Partial<MainNote>>({
    id: parseInt(noteId),
    title: "Nota " + noteId.substring(0, 4),
    date: new Date().toLocaleDateString(),
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
  });

  // Efecto para simular la carga de datos
  useEffect(() => {
    // Aquí se podría cargar la nota específica desde una API
    console.log(`Cargando nota ID: ${noteId} del libro: ${bookId}`);

    // Comprobar si la nota es nueva (como en nuestra implementación noteId es un timestamp)
    const isNewNote = noteId.length > 8; // Asumiendo que un ID largo es un timestamp
    if (isNewNote) {
      setNote((prev) => ({
        ...prev,
        title: "Nueva nota",
        date: new Date().toLocaleDateString(),
      }));
    }
  }, [noteId, bookId]);

  // Función para guardar la nota y volver a la página del libro
  const handleSave = (savedNote: MainNote) => {
    // Aquí iría la lógica para guardar la nota en la base de datos
    console.log("Nota guardada:", savedNote);

    // Redirigir de vuelta a la página del libro
    router.push(`/books/${bookId}`);
  };

  // Función para volver a la página del libro sin guardar
  const handleBack = () => {
    router.push(`/books/${bookId}`);
  };

  return (
    <Formato note={note as MainNote} onSave={handleSave} onBack={handleBack} />
  );
}
