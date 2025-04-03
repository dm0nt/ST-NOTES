// src/Components/Formato.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  User,
  Book,
  BookOpen,
  ArrowLeft,
  Save,
  Share,
} from "lucide-react";

// Definimos interfaces para tipado
interface QuickNote {
  id: number;
  text: string;
  completed: boolean;
}

interface StickyNote {
  id: number;
  text: string;
  color: string;
  position: {
    x: string;
    y: string;
  };
}

interface CornellFormat {
  content: string;
  keyPoints: string;
  summary: string;
}

interface FeynmanFormat {
  concept: string;
  explanation: string;
  gaps: string;
  refinement: string;
}

interface ChartingFormat {
  columns: any[]; // Puedes detallar esto más según tu estructura
}

interface MindMapFormat {
  central: string;
  branches: any[]; // Puedes detallar esto más según tu estructura
}

interface LinedFormat {
  content: string;
}

interface MainNote {
  id: number;
  title: string;
  date: string;
  cornell: CornellFormat;
  feynman: FeynmanFormat;
  charting: ChartingFormat;
  mindMap: MindMapFormat;
  lined: LinedFormat;
}

// Definimos la interfaz de las props
interface FormatoProps {
  note?: Partial<MainNote> | null;
  onSave: (note: MainNote) => void;
  onBack: () => void;
}

const Formato: React.FC<FormatoProps> = ({ note = null, onSave, onBack }) => {
  // Estados para gestionar las notas
  const [mainNote, setMainNote] = useState<MainNote>({
    id: note?.id || Date.now(),
    title: note?.title || "",
    date: note?.date || new Date().toLocaleDateString(),

    // Campos separados para cada formato
    cornell: {
      content: note?.cornell?.content || "",
      keyPoints: note?.cornell?.keyPoints || "",
      summary: note?.cornell?.summary || "",
    },
    feynman: {
      concept: note?.feynman?.concept || "",
      explanation: note?.feynman?.explanation || "",
      gaps: note?.feynman?.gaps || "",
      refinement: note?.feynman?.refinement || "",
    },
    charting: {
      columns: note?.charting?.columns || [],
    },
    mindMap: {
      central: note?.mindMap?.central || "",
      branches: note?.mindMap?.branches || [],
    },
    lined: {
      content: note?.lined?.content || "",
    },
  });

  const [quickNotes, setQuickNotes] = useState<QuickNote[]>([]);
  const [newQuickNote, setNewQuickNote] = useState("");
  const [pageType, setPageType] = useState("cornell"); // cornell, lined, feynman, charting, mindmap
  const [stickyNotes, setStickyNotes] = useState<StickyNote[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedNoteId, setDraggedNoteId] = useState<number | null>(null);
  const [initialPos, setInitialPos] = useState({ x: 0, y: 0 });
  const noteAreaRef = useRef<HTMLDivElement>(null);

  // Función para guardar la nota y volver
  const handleSave = () => {
    onSave(mainNote);
  };

  // Función para añadir notas rápidas
  const addQuickNote = () => {
    if (newQuickNote.trim() === "") return;
    setQuickNotes([
      ...quickNotes,
      { id: Date.now(), text: newQuickNote, completed: false },
    ]);
    setNewQuickNote("");
  };

  // Función para marcar/desmarcar una nota rápida como completada
  const toggleQuickNote = (id: number) => {
    setQuickNotes(
      quickNotes.map((note) =>
        note.id === id ? { ...note, completed: !note.completed } : note
      )
    );
  };

  // Función para eliminar una nota rápida
  const deleteQuickNote = (id: number) => {
    setQuickNotes(quickNotes.filter((note) => note.id !== id));
  };

  // Función para cambiar el tipo de página
  const handlePageTypeChange = (type: string) => {
    setPageType(type);
  };

  // Función para manejar cambios en las notas
  const handleNoteChange = (field: string, value: string) => {
    if (field === "title") {
      // El título es común para todos los formatos
      setMainNote({
        ...mainNote,
        title: value,
      });
      return;
    }

    // Actualizar el campo específico del formato actual
    setMainNote({
      ...mainNote,
      [pageType]: {
        ...mainNote[pageType as keyof typeof mainNote],
        [field]: value,
      },
    });
  };

  // Funciones para notas adhesivas
  const addStickyNote = () => {
    const colors = [
      "bg-yellow-100",
      "bg-blue-100",
      "bg-green-100",
      "bg-pink-100",
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newNote: StickyNote = {
      id: Date.now(),
      text: "",
      color: randomColor,
      position: { x: "70%", y: "20%" },
    };

    setStickyNotes([...stickyNotes, newNote]);
  };

  const updateStickyNote = (id: number, text: string) => {
    setStickyNotes(
      stickyNotes.map((note) => (note.id === id ? { ...note, text } : note))
    );
  };

  const deleteStickyNote = (id: number) => {
    setStickyNotes(stickyNotes.filter((note) => note.id !== id));
  };

  // Manejo del arrastre para la nota completa
  const handleNoteMouseDown = (e: React.MouseEvent, noteId: number) => {
    // Solo activar el arrastre si se hace clic en el área superior (los primeros 20px de altura)
    const rect = e.currentTarget.getBoundingClientRect();
    const isHeader = e.clientY - rect.top <= 20;

    if (isHeader) {
      setIsDragging(true);
      setDraggedNoteId(noteId);

      // Obtener la posición inicial del cursor
      setInitialPos({
        x: e.clientX,
        y: e.clientY,
      });

      // Evitar el comportamiento predeterminado de arrastre del navegador
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !draggedNoteId || !noteAreaRef.current) return;

    const noteAreaRect = noteAreaRef.current.getBoundingClientRect();

    setStickyNotes((prevNotes) =>
      prevNotes.map((note) => {
        if (note.id === draggedNoteId) {
          // Calcular la nueva posición
          const deltaX = e.clientX - initialPos.x;
          const deltaY = e.clientY - initialPos.y;

          // Convertir la posición actual de porcentaje a píxeles
          const currentX =
            (parseFloat(note.position.x) / 100) * noteAreaRect.width;
          const currentY =
            (parseFloat(note.position.y) / 100) * noteAreaRect.height;

          // Calcular la nueva posición en píxeles
          const newX = currentX + deltaX;
          const newY = currentY + deltaY;

          // Convertir de nuevo a porcentajes y asegurar que esté dentro de los límites
          const newXPercent = Math.max(
            0,
            Math.min(95, (newX / noteAreaRect.width) * 100)
          );
          const newYPercent = Math.max(
            0,
            Math.min(95, (newY / noteAreaRect.height) * 100)
          );

          return {
            ...note,
            position: {
              x: `${newXPercent}%`,
              y: `${newYPercent}%`,
            },
          };
        }
        return note;
      })
    );

    // Actualizar la posición inicial para el siguiente movimiento
    setInitialPos({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedNoteId(null);
  };

  // Agregar y eliminar los event listeners
  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, draggedNoteId, initialPos]);

  // Renderizar información del método según el tipo de página
  const renderMethodInfo = () => {
    switch (pageType) {
      case "cornell":
        return (
          <>
            <h2 className="text-sm font-semibold text-gray-700 mb-3">
              MÉTODO CORNELL
            </h2>
            <div className="text-xs text-gray-600 space-y-2">
              <p>
                Desarrollado por Walter Pauk, este método divide la página en
                tres secciones para optimizar la toma y revisión de notas:
              </p>
              <ul className="list-disc pl-4 space-y-1">
                <li>
                  <span className="font-medium">Columna izquierda:</span>{" "}
                  Palabras clave, preguntas principales y conceptos
                  fundamentales.
                </li>
                <li>
                  <span className="font-medium">Sección principal:</span> Notas
                  detalladas, ideas y explicaciones.
                </li>
                <li>
                  <span className="font-medium">Área de resumen:</span> Síntesis
                  con tus propias palabras para consolidar el aprendizaje.
                </li>
              </ul>
              <p className="pt-2 italic">
                Ideal para clases, conferencias y material de estudio. Facilita
                la revisión y preparación de exámenes.
              </p>
            </div>
          </>
        );
      case "feynman":
        return (
          <>
            <h2 className="text-sm font-semibold text-gray-700 mb-3">
              MÉTODO FEYNMAN
            </h2>
            <div className="text-xs text-gray-600 space-y-2">
              <p>
                Creado por el físico Richard Feynman, esta técnica se basa en
                explicar conceptos complejos de forma sencilla:
              </p>
              <ul className="list-disc pl-4 space-y-1">
                <li>
                  <span className="font-medium">Estudio inicial:</span>{" "}
                  Documentar lo que sabes sobre el tema con tus propias
                  palabras.
                </li>
                <li>
                  <span className="font-medium">Explicación simple:</span>{" "}
                  Reformular como si explicaras a alguien sin conocimientos
                  previos.
                </li>
                <li>
                  <span className="font-medium">Identificar vacíos:</span>{" "}
                  Reconocer aspectos que no puedes explicar claramente.
                </li>
                <li>
                  <span className="font-medium">Refinar:</span> Volver a las
                  fuentes, simplificar y mejorar tu explicación.
                </li>
              </ul>
              <p className="pt-2 italic">
                Especialmente útil para dominar conceptos complejos y preparar
                presentaciones o exámenes.
              </p>
            </div>
          </>
        );
      case "charting":
        return (
          <>
            <h2 className="text-sm font-semibold text-gray-700 mb-3">
              MÉTODO CHARTING
            </h2>
            <div className="text-xs text-gray-600 space-y-2">
              <p>
                Técnica que organiza información en formato de tabla para
                facilitar comparaciones y análisis:
              </p>
              <ul className="list-disc pl-4 space-y-1">
                <li>
                  <span className="font-medium">Categorización:</span>{" "}
                  Identifica temas principales como encabezados de columnas.
                </li>
                <li>
                  <span className="font-medium">Estructura tabular:</span>{" "}
                  Organiza datos relacionados verticalmente bajo cada categoría.
                </li>
                <li>
                  <span className="font-medium">Comparación visual:</span>{" "}
                  Facilita identificar patrones, similitudes y diferencias.
                </li>
                <li>
                  <span className="font-medium">Síntesis:</span> Permite
                  condensar grandes cantidades de información estructurada.
                </li>
              </ul>
              <p className="pt-2 italic">
                Eficaz para comparar teorías, analizar datos de múltiples
                fuentes o preparar estudios comparativos.
              </p>
            </div>
          </>
        );
      case "mindmap":
        return (
          <>
            <h2 className="text-sm font-semibold text-gray-700 mb-3">
              MAPA MENTAL
            </h2>
            <div className="text-xs text-gray-600 space-y-2">
              <p>
                Técnica de visualización desarrollada por Tony Buzan que
                representa conexiones entre ideas:
              </p>
              <ul className="list-disc pl-4 space-y-1">
                <li>
                  <span className="font-medium">Idea central:</span> Coloca el
                  concepto principal en el centro como punto de partida.
                </li>
                <li>
                  <span className="font-medium">Ramas principales:</span>{" "}
                  Extiende los subtemas más importantes desde el centro.
                </li>
                <li>
                  <span className="font-medium">Ramificaciones:</span>{" "}
                  Desarrolla detalles específicos en niveles posteriores.
                </li>
                <li>
                  <span className="font-medium">Elementos visuales:</span> Usa
                  colores, imágenes y símbolos para reforzar la memoria.
                </li>
              </ul>
              <p className="pt-2 italic">
                Potencia el pensamiento creativo, la organización de ideas y la
                memoria visual.
              </p>
            </div>
          </>
        );
      default:
        return (
          <>
            <h2 className="text-sm font-semibold text-gray-700 mb-3">
              NOTAS LINEALES
            </h2>
            <div className="text-xs text-gray-600 space-y-2">
              <p>
                El formato tradicional mejorado con técnicas para optimizar la
                captura de información:
              </p>
              <ul className="list-disc pl-4 space-y-1">
                <li>
                  <span className="font-medium">Estructura jerárquica:</span>{" "}
                  Organiza con títulos, subtítulos y puntos clave.
                </li>
                <li>
                  <span className="font-medium">Abreviaturas:</span> Desarrolla
                  un sistema personal para escribir más rápido.
                </li>
                <li>
                  <span className="font-medium">Marcadores visuales:</span> Usa
                  símbolos para destacar ideas importantes.
                </li>
                <li>
                  <span className="font-medium">Revisión activa:</span>{" "}
                  Complementa y refina tus notas dentro de 24 horas.
                </li>
              </ul>
              <p className="pt-2 italic">
                Método versátil para cualquier tipo de contenido, especialmente
                cuando la secuencia es importante.
              </p>
            </div>
          </>
        );
    }
  };

  // Renderiza el área principal de notas según el tipo seleccionado
  const renderNotesArea = () => {
    switch (pageType) {
      case "cornell":
        return (
          <div className="h-full flex flex-col">
            {/* Título */}
            <div className="border-b border-gray-200 p-4">
              <input
                type="text"
                value={mainNote.title}
                onChange={(e) => handleNoteChange("title", e.target.value)}
                placeholder="Título / Tema"
                className="w-full text-lg font-medium text-gray-800 bg-transparent border-none focus:outline-none focus:ring-0"
              />
            </div>

            {/* Área de contenido del método Cornell */}
            <div className="flex flex-1 h-full">
              {/* Columna izquierda para palabras clave */}
              <div className="w-1/4 border-r border-gray-200 p-4">
                <div className="text-xs uppercase text-gray-500 mb-2 font-medium">
                  Palabras clave
                </div>
                <textarea
                  value={mainNote.cornell.keyPoints}
                  onChange={(e) =>
                    handleNoteChange("keyPoints", e.target.value)
                  }
                  className="w-full h-full p-0 bg-transparent resize-none focus:outline-none focus:ring-0 text-gray-700"
                  placeholder="• Conceptos importantes&#10;• Preguntas clave&#10;• Ideas principales"
                />
              </div>

              {/* Columna principal para notas */}
              <div className="w-3/4 p-4">
                <div className="text-xs uppercase text-gray-500 mb-2 font-medium">
                  Notas
                </div>
                <textarea
                  value={mainNote.cornell.content}
                  onChange={(e) => handleNoteChange("content", e.target.value)}
                  className="w-full h-5/6 p-0 bg-[linear-gradient(to_bottom,transparent_23px,#e5e7eb_1px,transparent_1px)] bg-[size:100%_24px] resize-none focus:outline-none focus:ring-0 text-gray-700 leading-6"
                  placeholder="Desarrolla aquí tus ideas principales..."
                />
              </div>
            </div>

            {/* Área de resumen */}
            <div className="p-4 border-t border-gray-200">
              <div className="text-xs uppercase text-gray-500 mb-2 font-medium">
                Resumen
              </div>
              <textarea
                value={mainNote.cornell.summary}
                onChange={(e) => handleNoteChange("summary", e.target.value)}
                className="w-full h-20 p-0 bg-transparent resize-none focus:outline-none focus:ring-0 text-gray-700"
                placeholder="Escribe un breve resumen con tus propias palabras..."
              />
            </div>
          </div>
        );

      case "lined":
        return (
          <div className="h-full flex flex-col">
            {/* Título */}
            <div className="border-b border-gray-200 p-4">
              <input
                type="text"
                value={mainNote.title}
                onChange={(e) => handleNoteChange("title", e.target.value)}
                placeholder="Título / Tema"
                className="w-full text-lg font-medium text-gray-800 bg-transparent border-none focus:outline-none focus:ring-0"
              />
            </div>

            {/* Área de notas con líneas */}
            <div className="flex-1 p-4">
              <textarea
                value={mainNote.lined.content}
                onChange={(e) => handleNoteChange("content", e.target.value)}
                className="w-full h-full p-0 bg-[linear-gradient(to_bottom,transparent_23px,#e5e7eb_1px,transparent_1px)] bg-[size:100%_24px] resize-none focus:outline-none focus:ring-0 text-gray-700 leading-6"
                placeholder="Escribe tus notas aquí..."
              />
            </div>
          </div>
        );

      case "feynman":
        return (
          <div className="h-full flex flex-col">
            {/* Título */}
            <div className="border-b border-gray-200 p-4">
              <input
                type="text"
                value={mainNote.title}
                onChange={(e) => handleNoteChange("title", e.target.value)}
                placeholder="Concepto / Tema"
                className="w-full text-lg font-medium text-gray-800 bg-transparent border-none focus:outline-none focus:ring-0"
              />
            </div>

            {/* Pasos del método Feynman */}
            <div className="flex-1 overflow-auto p-4 space-y-4">
              <div>
                <div className="text-xs uppercase text-gray-500 mb-2 font-medium">
                  Paso 1: Estudiar el concepto
                </div>
                <textarea
                  value={mainNote.feynman.concept}
                  onChange={(e) => handleNoteChange("concept", e.target.value)}
                  className="w-full h-28 p-2 bg-white border border-gray-200 rounded resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
                  placeholder="Escribe lo que sabes sobre este tema..."
                />
              </div>

              <div>
                <div className="text-xs uppercase text-gray-500 mb-2 font-medium">
                  Paso 2: Enseñar en términos simples
                </div>
                <textarea
                  value={mainNote.feynman.explanation}
                  onChange={(e) =>
                    handleNoteChange("explanation", e.target.value)
                  }
                  className="w-full h-32 p-2 bg-white border border-gray-200 rounded resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
                  placeholder="Explica el concepto como si le hablaras a un niño de 12 años..."
                />
              </div>

              <div>
                <div className="text-xs uppercase text-gray-500 mb-2 font-medium">
                  Paso 3: Identificar lagunas de conocimiento
                </div>
                <textarea
                  value={mainNote.feynman.gaps}
                  onChange={(e) => handleNoteChange("gaps", e.target.value)}
                  className="w-full h-28 p-2 bg-white border border-gray-200 rounded resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
                  placeholder="Anota los puntos que no has podido explicar con claridad..."
                />
              </div>

              <div>
                <div className="text-xs uppercase text-gray-500 mb-2 font-medium">
                  Paso 4: Simplificar y clarificar
                </div>
                <textarea
                  value={mainNote.feynman.refinement}
                  onChange={(e) =>
                    handleNoteChange("refinement", e.target.value)
                  }
                  className="w-full h-32 p-2 bg-white border border-gray-200 rounded resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
                  placeholder="Revisa tu explicación y simplifícala aún más..."
                />
              </div>
            </div>
          </div>
        );

      case "charting":
        return (
          <div className="h-full flex flex-col">
            {/* Título */}
            <div className="border-b border-gray-200 p-4">
              <input
                type="text"
                value={mainNote.title}
                onChange={(e) => handleNoteChange("title", e.target.value)}
                placeholder="Tema de comparación"
                className="w-full text-lg font-medium text-gray-800 bg-transparent border-none focus:outline-none focus:ring-0"
              />
            </div>

            {/* Tabla de comparación */}
            <div className="flex-1 overflow-auto p-4">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {/* Encabezados de columna */}
                    <th className="p-2 border border-gray-300 bg-gray-50">
                      <input
                        type="text"
                        placeholder="Categoría 1"
                        className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-center text-sm font-medium"
                      />
                    </th>
                    <th className="p-2 border border-gray-300 bg-gray-50">
                      <input
                        type="text"
                        placeholder="Categoría 2"
                        className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-center text-sm font-medium"
                      />
                    </th>
                    <th className="p-2 border border-gray-300 bg-gray-50">
                      <input
                        type="text"
                        placeholder="Categoría 3"
                        className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-center text-sm font-medium"
                      />
                    </th>
                    <th className="p-2 border border-gray-300 bg-gray-50">
                      <input
                        type="text"
                        placeholder="Categoría 4"
                        className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-center text-sm font-medium"
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Filas para datos - Reducido a 6 filas para optimizar */}
                  {[...Array(6)].map((_, rowIndex) => (
                    <tr key={rowIndex}>
                      {[...Array(4)].map((_, colIndex) => (
                        <td
                          key={colIndex}
                          className="p-0 border border-gray-300"
                        >
                          <textarea
                            className="w-full h-20 p-2 bg-transparent resize-none focus:outline-none focus:ring-0 text-sm"
                            placeholder="Información..."
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "mindmap":
        return (
          <div className="h-full flex flex-col">
            {/* Título */}
            <div className="border-b border-gray-200 p-4">
              <input
                type="text"
                value={mainNote.title}
                onChange={(e) => handleNoteChange("title", e.target.value)}
                placeholder="Tema del mapa mental"
                className="w-full text-lg font-medium text-gray-800 bg-transparent border-none focus:outline-none focus:ring-0"
              />
            </div>

            {/* Área para mapa mental */}
            <div className="flex-1 p-4 overflow-auto">
              <div className="w-full h-full bg-white rounded border border-gray-200 p-4 flex flex-col items-center">
                <div className="mb-4">
                  <div className="py-3 px-6 border-2 border-blue-500 rounded-full text-center bg-blue-50">
                    <input
                      type="text"
                      value={mainNote.mindMap.central}
                      onChange={(e) =>
                        handleNoteChange("central", e.target.value)
                      }
                      placeholder="Idea central"
                      className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-center font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 w-full">
                  {/* Rama 1 */}
                  <div className="space-y-3">
                    <div className="py-2 px-4 border-2 border-green-500 rounded-lg bg-green-50 ml-8">
                      <input
                        type="text"
                        placeholder="Rama principal 1"
                        className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-center font-medium"
                      />
                    </div>
                    <div className="ml-12 space-y-2">
                      <div className="py-1 px-3 border border-green-400 rounded bg-white">
                        <input
                          type="text"
                          placeholder="Subtema 1.1"
                          className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-sm"
                        />
                      </div>
                      <div className="py-1 px-3 border border-green-400 rounded bg-white">
                        <input
                          type="text"
                          placeholder="Subtema 1.2"
                          className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Rama 2 */}
                  <div className="space-y-3">
                    <div className="py-2 px-4 border-2 border-purple-500 rounded-lg bg-purple-50 ml-8">
                      <input
                        type="text"
                        placeholder="Rama principal 2"
                        className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-center font-medium"
                      />
                    </div>
                    <div className="ml-12 space-y-2">
                      <div className="py-1 px-3 border border-purple-400 rounded bg-white">
                        <input
                          type="text"
                          placeholder="Subtema 2.1"
                          className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-sm"
                        />
                      </div>
                      <div className="py-1 px-3 border border-purple-400 rounded bg-white">
                        <input
                          type="text"
                          placeholder="Subtema 2.2"
                          className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Rama 3 */}
                  <div className="space-y-3">
                    <div className="py-2 px-4 border-2 border-orange-500 rounded-lg bg-orange-50 ml-8">
                      <input
                        type="text"
                        placeholder="Rama principal 3"
                        className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-center font-medium"
                      />
                    </div>
                    <div className="ml-12 space-y-2">
                      <div className="py-1 px-3 border border-orange-400 rounded bg-white">
                        <input
                          type="text"
                          placeholder="Subtema 3.1"
                          className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Rama 4 */}
                  <div className="space-y-3">
                    <div className="py-2 px-4 border-2 border-cyan-500 rounded-lg bg-cyan-50 ml-8">
                      <input
                        type="text"
                        placeholder="Rama principal 4"
                        className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-center font-medium"
                      />
                    </div>
                    <div className="ml-12 space-y-2">
                      <div className="py-1 px-3 border border-cyan-400 rounded bg-white">
                        <input
                          type="text"
                          placeholder="Subtema 4.1"
                          className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="h-full flex flex-col">
            {/* Título */}
            <div className="border-b border-gray-200 p-4">
              <input
                type="text"
                value={mainNote.title}
                onChange={(e) => handleNoteChange("title", e.target.value)}
                placeholder="Título / Tema"
                className="w-full text-lg font-medium text-gray-800 bg-transparent border-none focus:outline-none focus:ring-0"
              />
            </div>

            {/* Área de notas con líneas */}
            <div className="flex-1 p-4">
              <textarea
                value={mainNote.lined.content}
                onChange={(e) => handleNoteChange("content", e.target.value)}
                className="w-full h-full p-0 bg-[linear-gradient(to_bottom,transparent_23px,#e5e7eb_1px,transparent_1px)] bg-[size:100%_24px] resize-none focus:outline-none focus:ring-0 text-gray-700 leading-6"
                placeholder="Escribe tus notas aquí..."
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white text-gray-800">
      {/* Barra de navegación superior */}
      <nav className="sticky top-0 bg-white shadow-sm p-4 flex items-center justify-between">
        {/* Sección izquierda: Volver y título */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onBack}
            className="p-2 rounded-md hover:bg-pink-50 transition-colors flex items-center"
          >
            <ArrowLeft size={20} color="#db2777" />
            <span className="ml-1 text-pink-600">Volver</span>
          </button>
        </div>

        {/* Sección central: Título de la nota */}
        <div className="flex-1 mx-4">
          <input
            type="text"
            value={mainNote.title}
            onChange={(e) => handleNoteChange("title", e.target.value)}
            className="w-full px-3 py-1 bg-white rounded border border-pink-300 focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
            placeholder="Título de la nota"
          />
        </div>

        {/* Sección derecha: Botones de acción */}
        <div className="flex space-x-3">
          <button
            onClick={addStickyNote}
            className="px-3 py-1 text-sm rounded bg-yellow-50 text-yellow-600 hover:bg-yellow-100 transition-colors flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
            </svg>
            Nota
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1 text-sm rounded bg-pink-600 text-white hover:bg-pink-700 transition-colors"
          >
            <Save size={16} className="inline mr-1" />
            Guardar
          </button>
          <button className="px-3 py-1 text-sm rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
            <Share size={16} className="inline mr-1" />
            Compartir
          </button>
          <div className="h-10 w-10 rounded-full bg-pink-100 border-2 border-pink-300 flex items-center justify-center">
            <User size={20} className="text-pink-600" />
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col md:flex-row">
          {/* Área principal para tomar notas */}
          <div
            className="md:w-3/4 h-full border-r border-gray-200 flex flex-col relative"
            ref={noteAreaRef}
          >
            {/* Selector de tipo de plantilla */}
            <div className="bg-gray-50 p-2 border-b border-gray-200 flex items-center">
              <div className="text-sm font-medium text-gray-600 mr-4">
                Formato:
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handlePageTypeChange("cornell")}
                  className={`px-3 py-1 text-sm rounded-md ${
                    pageType === "cornell"
                      ? "bg-pink-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Cornell
                </button>
                <button
                  onClick={() => handlePageTypeChange("feynman")}
                  className={`px-3 py-1 text-sm rounded-md ${
                    pageType === "feynman"
                      ? "bg-pink-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Feynman
                </button>
                <button
                  onClick={() => handlePageTypeChange("charting")}
                  className={`px-3 py-1 text-sm rounded-md ${
                    pageType === "charting"
                      ? "bg-pink-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Charting
                </button>
                <button
                  onClick={() => handlePageTypeChange("mindmap")}
                  className={`px-3 py-1 text-sm rounded-md ${
                    pageType === "mindmap"
                      ? "bg-pink-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Mapa Mental
                </button>
                <button
                  onClick={() => handlePageTypeChange("lined")}
                  className={`px-3 py-1 text-sm rounded-md ${
                    pageType === "lined"
                      ? "bg-pink-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Líneas
                </button>
              </div>
            </div>

            {/* Área de notas */}
            <div className="flex-1 overflow-auto relative">
              {renderNotesArea()}

              {/* Notas adhesivas con un solo color uniforme */}
              {stickyNotes.map((note) => (
                <div
                  key={note.id}
                  className={`absolute p-2 w-40 shadow-md ${note.color} rounded cursor-default`}
                  style={{
                    top: note.position.y,
                    left: note.position.x,
                    zIndex: 10,
                  }}
                  onMouseDown={(e) => handleNoteMouseDown(e, note.id)}
                >
                  {/* Área de control en la parte superior - ahora del mismo color */}
                  <div className="flex justify-end items-center h-6">
                    <button
                      onClick={() => deleteStickyNote(note.id)}
                      className="text-gray-500 hover:text-red-500 text-xs"
                    >
                      ×
                    </button>
                  </div>

                  {/* Área de texto */}
                  <textarea
                    value={note.text}
                    onChange={(e) => updateStickyNote(note.id, e.target.value)}
                    className="w-full h-24 bg-transparent resize-none focus:outline-none focus:ring-0 text-gray-700 text-sm"
                    placeholder="Nota adhesiva..."
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Panel lateral */}
          <div className="md:w-1/4 h-full bg-gray-50 flex flex-col">
            {/* Sección de notas rápidas */}
            <div className="flex-1 overflow-auto p-4 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">
                TAREAS PENDIENTES
              </h2>

              <div className="mb-4">
                <div className="flex mb-2">
                  <input
                    type="text"
                    value={newQuickNote}
                    onChange={(e) => setNewQuickNote(e.target.value)}
                    onKeyPress={(e: React.KeyboardEvent) =>
                      e.key === "Enter" && addQuickNote()
                    }
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
                    placeholder="Nueva tarea..."
                  />
                  <button
                    onClick={addQuickNote}
                    className="px-3 py-2 bg-pink-600 text-white rounded-r hover:bg-pink-700 transition-colors"
                  >
                    +
                  </button>
                </div>

                <ul className="space-y-1">
                  {quickNotes.map((note) => (
                    <li
                      key={note.id}
                      className="flex items-center py-2 px-1 hover:bg-gray-100 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={note.completed}
                        onChange={() => toggleQuickNote(note.id)}
                        className="mr-2 h-4 w-4 text-pink-600 focus:ring-pink-500 rounded"
                      />
                      <span
                        className={`flex-1 text-sm ${
                          note.completed
                            ? "line-through text-gray-400"
                            : "text-gray-700"
                        }`}
                      >
                        {note.text}
                      </span>
                      <button
                        onClick={() => deleteQuickNote(note.id)}
                        className="text-gray-400 hover:text-red-500 text-sm"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                  {quickNotes.length === 0 && (
                    <li className="text-gray-400 text-center py-2 text-sm">
                      No hay tareas pendientes
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Consejos según método seleccionado */}
            <div className="p-4">{renderMethodInfo()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Formato;
