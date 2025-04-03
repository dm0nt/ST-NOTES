import React, { useState } from "react";
import {
  Search,
  User,
  BookOpen,
  Book,
  Settings,
  LogOut,
  PlusCircle,
  ArrowLeft,
} from "lucide-react";

// Definimos los props para recibir de la página principal
interface NotesAppProps {
  bookTitle: string;
  onBack: () => void;
}

const NotesApp = ({ bookTitle, onBack }: NotesAppProps) => {
  // Estado para las notas
  const [notes, setNotes] = useState([
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

  // Estado para controlar si el menú está desplegado
  const [menuDesplegado, setMenuDesplegado] = useState(false);
  // Estado para controlar sobre qué opción está el hover
  const [opcionHover, setOpcionHover] = useState<string | null>(null);
  // Estado para controlar la nota actualmente seleccionada (para la vista de formato)
  const [currentNote, setCurrentNote] = useState<{
    id: number;
    title: string;
    date: string;
    content: string;
  } | null>(null);
  // Estado para controlar si se está editando una nota
  const [isEditing, setIsEditing] = useState(false);

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

  // Función para abrir el editor de notas
  const openNoteEditor = (
    note: {
      id: number;
      title: string;
      date: string;
      content: string;
    } | null = null
  ) => {
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
  const saveNote = (note: {
    id: number;
    title: string;
    date: string;
    content: string;
  }) => {
    if (notes.some((n) => n.id === note.id)) {
      // Actualizar nota existente
      setNotes(notes.map((n) => (n.id === note.id ? note : n)));
    } else {
      // Agregar nueva nota
      setNotes([...notes, note]);
    }

    setIsEditing(false);
    setCurrentNote(null);
  };

  // Función para cancelar la edición y volver a la lista de notas
  const cancelEditing = () => {
    setIsEditing(false);
    setCurrentNote(null);
  };

  // Estilos inline para forzar el color negro
  const textStyle = { color: "black" };
  const titleStyle = { color: "black", fontWeight: "bold" };

  // Si está en modo edición, mostrar el editor de notas (anteriormente era Formato.tsx)
  if (isEditing) {
    return (
      <div
        className="min-h-screen bg-gray-50"
        style={{ backgroundColor: "#f9fafb", color: "#000000" }}
      >
        {/* Barra de navegación */}
        <div className="sticky top-0 bg-white shadow-sm p-4 flex items-center justify-between">
          {/* Sección izquierda: Menú desplegable y navegación */}
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
                onClick={cancelEditing}
                className="p-2 rounded-md hover:bg-pink-50 transition-colors flex items-center"
              >
                <ArrowLeft size={20} color="#db2777" />
                <span className="ml-1 text-pink-600">Volver</span>
              </button>
              <span className="font-medium" style={{ color: "black" }}>
                {currentNote?.title || "Nueva nota"}
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

          {/* Sección derecha: Guardar y perfil */}
          <div className="flex items-center gap-4">
            <button
              className="px-3 py-1 text-sm rounded bg-pink-600 hover:bg-pink-700 text-white transition-colors flex items-center"
              onClick={() => saveNote(currentNote)}
            >
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

        {/* Área principal de edición */}
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Título de la nota */}
            <input
              type="text"
              value={currentNote?.title}
              onChange={(e) =>
                setCurrentNote({ ...currentNote, title: e.target.value })
              }
              placeholder="Título de la nota"
              className="w-full text-2xl font-bold mb-4 border-b border-gray-200 pb-2 focus:outline-none focus:border-pink-300"
              style={{ color: "black" }}
            />

            {/* Contenido de la nota */}
            <textarea
              value={currentNote?.content}
              onChange={(e) =>
                setCurrentNote({ ...currentNote, content: e.target.value })
              }
              placeholder="Escribe el contenido de tu nota aquí..."
              className="w-full h-80 resize-none focus:outline-none p-2 bg-[linear-gradient(to_bottom,transparent_23px,#e5e7eb_1px,transparent_1px)] bg-[size:100%_24px] leading-6"
              style={{ color: "black" }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Mostrar la lista de notas si no está en modo edición
  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{ backgroundColor: "#f9fafb", color: "#000000" }}
    >
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

          {/* Botón de volver y título del libro */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onBack}
              className="p-2 rounded-md hover:bg-pink-50 transition-colors flex items-center"
            >
              <ArrowLeft size={20} color="#db2777" />
              <span className="ml-1 text-pink-600">Volver</span>
            </button>
            <h1 style={titleStyle} className="text-lg font-bold">
              {bookTitle}
            </h1>
          </div>
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
            style={{ color: "black" }}
          />
        </div>

        {/* Sección derecha: Perfil de usuario */}
        <div className="flex items-center gap-4">
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
      <div className="p-6">
        {/* Encabezado de la sección */}
        <div className="flex justify-between items-center mb-6">
          <h1 style={titleStyle} className="text-2xl font-bold italic">
            NOTAS
          </h1>
          <button
            className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors"
            onClick={() => openNoteEditor()}
          >
            <PlusCircle size={18} />
            <span style={{ color: "white" }}>Nueva Nota</span>
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
                  <h2 style={titleStyle} className="font-bold">
                    {note.title}
                  </h2>
                  <p style={textStyle} className="text-sm text-gray-600">
                    {note.date}
                  </p>
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
            <h2 style={titleStyle} className="text-lg font-semibold mb-4">
              Tabla de contenido
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              {tableOfContents.map((item) => (
                <li key={item.id} style={textStyle}>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesApp;
