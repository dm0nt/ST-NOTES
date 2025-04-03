import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  User,
  ArrowLeft,
  Save,
  BookOpen,
  Book,
  Settings,
  LogOut,
  PlusCircle,
  StickyNote,
} from "lucide-react";

interface FormatoProps {
  note: {
    id: number;
    title: string;
    date: string;
    content: string;
  } | null;
  onSave: (note: any) => void;
  onBack: () => void;
}

const Formato = ({ note, onSave, onBack }: FormatoProps) => {
  // Estados para gestionar las notas, las notas rápidas y el libro actual
  const [mainNote, setMainNote] = useState({
    id: note?.id || Date.now(),
    title: note?.title || "",
    content: note?.content || "",
    date: note?.date || new Date().toLocaleDateString(),
    keyPoints: "",
    summary: "",
    questions: [],
    columns: [],
    mindMap: { central: "", branches: [] },
  });

  // Estado para controlar si el menú está desplegado
  const [menuDesplegado, setMenuDesplegado] = useState(false);
  // Estado para controlar sobre qué opción está el hover
  const [opcionHover, setOpcionHover] = useState<string | null>(null);

  const [quickNotes, setQuickNotes] = useState([]);
  const [newQuickNote, setNewQuickNote] = useState("");
  const [pageType, setPageType] = useState("cornell"); // cornell, lined, feynman, charting, mindmap
  const [stickyNotes, setStickyNotes] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedNoteId, setDraggedNoteId] = useState(null);
  const [initialPos, setInitialPos] = useState({ x: 0, y: 0 });
  const noteAreaRef = useRef(null);

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
  const toggleQuickNote = (id) => {
    setQuickNotes(
      quickNotes.map((note) =>
        note.id === id ? { ...note, completed: !note.completed } : note
      )
    );
  };

  // Función para eliminar una nota rápida
  const deleteQuickNote = (id) => {
    setQuickNotes(quickNotes.filter((note) => note.id !== id));
  };

  // Función para cambiar el tipo de página
  const handlePageTypeChange = (type) => {
    setPageType(type);
  };

  // Función para manejar cambios en las notas
  const handleNoteChange = (field, value) => {
    setMainNote({
      ...mainNote,
      [field]: value,
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

    const newNote = {
      id: Date.now(),
      text: "",
      color: randomColor,
      position: { x: "70%", y: "20%" },
    };

    setStickyNotes([...stickyNotes, newNote]);
  };

  const updateStickyNote = (id, text) => {
    setStickyNotes(
      stickyNotes.map((note) => (note.id === id ? { ...note, text } : note))
    );
  };

  const deleteStickyNote = (id) => {
    setStickyNotes(stickyNotes.filter((note) => note.id !== id));
  };

  // Funciones para arrastrar notas adhesivas
  const handleMouseDown = (e, noteId) => {
    setIsDragging(true);
    setDraggedNoteId(noteId);

    // Obtener la posición inicial del cursor
    setInitialPos({
      x: e.clientX,
      y: e.clientY,
    });

    // Evitar el comportamiento predeterminado de arrastre del navegador
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !draggedNoteId) return;

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

  // Función para guardar la nota
  const handleSave = () => {
    // Preparar los datos para guardar
    const noteToSave = {
      id: mainNote.id,
      title: mainNote.title,
      content: mainNote.content,
      date: mainNote.date,
      // Puedes agregar más campos si necesitas guardar otras partes de la nota
    };

    onSave(noteToSave);
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

  // Estilos inline para forzar el color negro
  const textStyle = { color: "black" };
  const titleStyle = { color: "black", fontWeight: "bold" };

  // Renderizar información del método según el tipo de página
  const renderMethodInfo = () => {
    switch (pageType) {
      case "cornell":
        return (
          <>
            <h2 style={titleStyle} className="text-sm font-semibold mb-3">
              MÉTODO CORNELL
            </h2>
            <div className="text-xs space-y-2">
              <p style={textStyle}>
                Desarrollado por Walter Pauk, este método divide la página en
                tres secciones para optimizar la toma y revisión de notas.
              </p>
            </div>
          </>
        );
      case "feynman":
        return (
          <>
            <h2 style={titleStyle} className="text-sm font-semibold mb-3">
              MÉTODO FEYNMAN
            </h2>
            <div className="text-xs space-y-2">
              <p style={textStyle}>
                Creado por el físico Richard Feynman, esta técnica se basa en
                explicar conceptos complejos de forma sencilla.
              </p>
            </div>
          </>
        );
      case "charting":
        return (
          <>
            <h2 style={titleStyle} className="text-sm font-semibold mb-3">
              MÉTODO CHARTING
            </h2>
            <div className="text-xs space-y-2">
              <p style={textStyle}>
                Técnica que organiza información en formato de tabla para
                facilitar comparaciones y análisis.
              </p>
            </div>
          </>
        );
      case "mindmap":
        return (
          <>
            <h2 style={titleStyle} className="text-sm font-semibold mb-3">
              MAPA MENTAL
            </h2>
            <div className="text-xs space-y-2">
              <p style={textStyle}>
                Técnica de visualización desarrollada por Tony Buzan que
                representa conexiones entre ideas.
              </p>
            </div>
          </>
        );
      default:
        return (
          <>
            <h2 style={titleStyle} className="text-sm font-semibold mb-3">
              NOTAS LINEALES
            </h2>
            <div className="text-xs space-y-2">
              <p style={textStyle}>
                El formato tradicional mejorado con técnicas para optimizar la
                captura de información.
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
                className="w-full text-lg font-medium bg-transparent border-none focus:outline-none focus:ring-0"
                style={{ color: "black" }}
              />
            </div>

            {/* Área de contenido del método Cornell */}
            <div className="flex flex-1 h-full">
              {/* Columna izquierda para palabras clave */}
              <div className="w-1/4 border-r border-gray-200 p-4">
                <div
                  className="text-xs uppercase mb-2 font-medium"
                  style={{ color: "black" }}
                >
                  Palabras clave
                </div>
                <textarea
                  value={mainNote.keyPoints}
                  onChange={(e) =>
                    handleNoteChange("keyPoints", e.target.value)
                  }
                  className="w-full h-full p-0 bg-transparent resize-none focus:outline-none focus:ring-0"
                  placeholder="• Conceptos importantes&#10;• Preguntas clave&#10;• Ideas principales"
                  style={{ color: "black" }}
                />
              </div>

              {/* Columna principal para notas */}
              <div className="w-3/4 p-4">
                <div
                  className="text-xs uppercase mb-2 font-medium"
                  style={{ color: "black" }}
                >
                  Notas
                </div>
                <textarea
                  value={mainNote.content}
                  onChange={(e) => handleNoteChange("content", e.target.value)}
                  className="w-full h-5/6 p-0 bg-[linear-gradient(to_bottom,transparent_23px,#e5e7eb_1px,transparent_1px)] bg-[size:100%_24px] resize-none focus:outline-none focus:ring-0 leading-6"
                  placeholder="Desarrolla aquí tus ideas principales..."
                  style={{ color: "black" }}
                />
              </div>
            </div>

            {/* Área de resumen */}
            <div className="p-4 border-t border-gray-200">
              <div
                className="text-xs uppercase mb-2 font-medium"
                style={{ color: "black" }}
              >
                Resumen
              </div>
              <textarea
                value={mainNote.summary}
                onChange={(e) => handleNoteChange("summary", e.target.value)}
                className="w-full h-20 p-0 bg-transparent resize-none focus:outline-none focus:ring-0"
                placeholder="Escribe un breve resumen con tus propias palabras..."
                style={{ color: "black" }}
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
                className="w-full text-lg font-medium bg-transparent border-none focus:outline-none focus:ring-0"
                style={{ color: "black" }}
              />
            </div>

            {/* Área de notas con líneas */}
            <div className="flex-1 p-4">
              <textarea
                value={mainNote.content}
                onChange={(e) => handleNoteChange("content", e.target.value)}
                className="w-full h-full p-0 bg-[linear-gradient(to_bottom,transparent_23px,#e5e7eb_1px,transparent_1px)] bg-[size:100%_24px] resize-none focus:outline-none focus:ring-0 leading-6"
                placeholder="Escribe tus notas aquí..."
                style={{ color: "black" }}
              />
            </div>
          </div>
        );

      // Simplificación de otros tipos por brevedad
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
                className="w-full text-lg font-medium bg-transparent border-none focus:outline-none focus:ring-0"
                style={{ color: "black" }}
              />
            </div>

            {/* Área de notas genérica */}
            <div className="flex-1 p-4">
              <textarea
                value={mainNote.content}
                onChange={(e) => handleNoteChange("content", e.target.value)}
                className="w-full h-full p-0 resize-none focus:outline-none focus:ring-0 border border-gray-200 rounded p-2"
                placeholder="Escribe tus notas aquí..."
                style={{ color: "black" }}
              />
            </div>
          </div>
        );
    }
  };

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

            {/* Menú desplegable que aparece al hacer hover */}
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

          {/* Botón de volver y título */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onBack}
              className="p-2 rounded-md hover:bg-pink-50 transition-colors flex items-center"
            >
              <ArrowLeft size={20} color="#db2777" />
              <span className="ml-1 text-pink-600">Volver</span>
            </button>
            <span className="font-medium" style={{ color: "black" }}>
              {mainNote.title || "Nueva nota"}
            </span>
          </div>
        </div>

        {/* Sección central: Búsqueda */}
        <div className="relative w-1/3">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar..."
            className="block w-full pl-10 pr-3 py-2 border-2 border-pink-300 rounded-full focus:ring-pink-500 focus:border-pink-500 shadow-sm"
            style={{ color: "black" }}
          />
        </div>

        {/* Sección derecha: Botones de acción */}
        <div className="flex items-center gap-4">
          <button
            onClick={addStickyNote}
            className="px-3 py-1 text-sm rounded bg-yellow-50 text-yellow-600 hover:bg-yellow-100 transition-colors flex items-center"
          >
            <StickyNote size={16} className="mr-1" />
            <span>Nota adhesiva</span>
          </button>

          <button
            className="px-3 py-1 text-sm rounded bg-pink-600 hover:bg-pink-700 text-white transition-colors flex items-center"
            onClick={handleSave}
          >
            <Save size={16} className="mr-1" />
            <span style={{ color: "white" }}>Guardar</span>
          </button>

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
      <div className="flex-1 overflow-hidden p-4">
        <div className="h-full flex flex-col md:flex-row bg-white rounded-lg shadow-sm">
          {/* Área principal para tomar notas */}
          <div
            className="md:w-3/4 h-full border-r border-gray-200 flex flex-col relative"
            ref={noteAreaRef}
          >
            {/* Selector de tipo de plantilla */}
            <div className="bg-gray-50 p-2 border-b border-gray-200 flex items-center">
              <div
                className="text-sm font-medium mr-4"
                style={{ color: "black" }}
              >
                Formato:
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handlePageTypeChange("cornell")}
                  className={`px-3 py-1 text-sm rounded-md ${
                    pageType === "cornell"
                      ? "bg-pink-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  style={pageType !== "cornell" ? { color: "black" } : {}}
                >
                  Cornell
                </button>
                <button
                  onClick={() => handlePageTypeChange("feynman")}
                  className={`px-3 py-1 text-sm rounded-md ${
                    pageType === "feynman"
                      ? "bg-pink-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  style={pageType !== "feynman" ? { color: "black" } : {}}
                >
                  Feynman
                </button>
                <button
                  onClick={() => handlePageTypeChange("charting")}
                  className={`px-3 py-1 text-sm rounded-md ${
                    pageType === "charting"
                      ? "bg-pink-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  style={pageType !== "charting" ? { color: "black" } : {}}
                >
                  Charting
                </button>
                <button
                  onClick={() => handlePageTypeChange("mindmap")}
                  className={`px-3 py-1 text-sm rounded-md ${
                    pageType === "mindmap"
                      ? "bg-pink-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  style={pageType !== "mindmap" ? { color: "black" } : {}}
                >
                  Mapa Mental
                </button>
                <button
                  onClick={() => handlePageTypeChange("lined")}
                  className={`px-3 py-1 text-sm rounded-md ${
                    pageType === "lined"
                      ? "bg-pink-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  style={pageType !== "lined" ? { color: "black" } : {}}
                >
                  Líneas
                </button>
              </div>
            </div>

            {/* Área de notas */}
            <div className="flex-1 overflow-auto relative">
              {renderNotesArea()}

              {/* Notas adhesivas */}
              {stickyNotes.map((note) => (
                <div
                  key={note.id}
                  className={`absolute p-2 w-40 shadow-md ${note.color} cursor-move`}
                  style={{
                    top: note.position.y,
                    left: note.position.x,
                    zIndex: 10,
                  }}
                  onMouseDown={(e) => handleMouseDown(e, note.id)}
                >
                  <div className="flex justify-end mb-1">
                    <button
                      onClick={() => deleteStickyNote(note.id)}
                      className="text-gray-400 hover:text-red-500 text-xs"
                    >
                      ×
                    </button>
                  </div>
                  <textarea
                    value={note.text}
                    onChange={(e) => updateStickyNote(note.id, e.target.value)}
                    className="w-full h-24 bg-transparent resize-none focus:outline-none focus:ring-0 text-sm"
                    placeholder="Nota adhesiva..."
                    style={{ color: "black" }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Panel lateral */}
          <div className="md:w-1/4 h-full bg-gray-50 flex flex-col">
            {/* Sección de notas rápidas */}
            <div className="flex-1 overflow-auto p-4 border-b border-gray-200">
              <h2 style={titleStyle} className="text-sm font-semibold mb-4">
                TAREAS PENDIENTES
              </h2>

              <div className="mb-4">
                <div className="flex mb-2">
                  <input
                    type="text"
                    value={newQuickNote}
                    onChange={(e) => setNewQuickNote(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addQuickNote()}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
                    placeholder="Nueva tarea..."
                    style={{ color: "black" }}
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
                          note.completed ? "line-through text-gray-400" : ""
                        }`}
                        style={note.completed ? {} : { color: "black" }}
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
