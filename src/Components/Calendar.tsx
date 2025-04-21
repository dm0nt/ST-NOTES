// src/Components/Calendar.tsx
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [bookActivities, setBookActivities] = useState<{
    [key: string]: number;
  }>({});

  // Cargar actividades de libros desde localStorage
  useEffect(() => {
    // Simular actividades para demostración
    // En una implementación real, buscaríamos los días en que se crearon notas
    const allBooks = localStorage.getItem("st-notes-books");
    if (!allBooks) return;

    // Generar un objeto con fechas y contador de actividades
    const activities: { [key: string]: number } = {};
    const today = new Date();

    // Añadir algunas actividades para el mes actual
    for (let i = 1; i <= 5; i++) {
      const day = Math.floor(Math.random() * 28) + 1;
      const date = new Date(today.getFullYear(), today.getMonth(), day);
      const dateStr = date.toISOString().split("T")[0];
      activities[dateStr] = Math.floor(Math.random() * 3) + 1;
    }

    setBookActivities(activities);
  }, []);

  // Obtener días del mes actual
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Obtener el día de la semana del primer día del mes (0-6)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Ir al mes anterior
  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  // Ir al mes siguiente
  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  // Obtener nombre del mes
  const getMonthName = (month: number) => {
    const monthNames = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    return monthNames[month];
  };

  // Comprobar si una fecha tiene actividad
  const hasActivity = (year: number, month: number, day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    return bookActivities[dateStr] || 0;
  };

  // Renderizar días de la semana
  const daysOfWeek = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];

  // Configurar parámetros del calendario
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);

  // Generar celdas del calendario
  const days = [];

  // Celdas vacías para los días anteriores al primer día del mes
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
  }

  // Celdas para los días del mes
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday =
      new Date().getDate() === day &&
      new Date().getMonth() === month &&
      new Date().getFullYear() === year;

    const isSelected =
      selectedDate &&
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === month &&
      selectedDate.getFullYear() === year;

    const activityLevel = hasActivity(year, month, day);

    days.push(
      <div
        key={day}
        className={`
          flex items-center justify-center h-8 w-8 rounded-full cursor-pointer relative
          ${isToday ? "border border-pink-400" : ""}
          ${isSelected ? "bg-pink-100" : "hover:bg-pink-50"}
        `}
        onClick={() => setSelectedDate(new Date(year, month, day))}
      >
        {day}
        {activityLevel > 0 && (
          <div
            className={`absolute bottom-1 h-1 w-1 rounded-full
              ${
                activityLevel === 1
                  ? "bg-green-400"
                  : activityLevel === 2
                  ? "bg-yellow-400"
                  : "bg-pink-400"
              }
            `}
          ></div>
        )}
      </div>
    );
  }

  return (
    <div className="calendar">
      {/* Encabezado con mes y año, y botones de navegación */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="p-1 rounded hover:bg-gray-100">
          <ChevronLeft size={16} />
        </button>

        <h3 className="text-sm font-medium">
          {getMonthName(month)} {year}
        </h3>

        <button onClick={nextMonth} className="p-1 rounded hover:bg-gray-100">
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Días del mes */}
      <div className="grid grid-cols-7 gap-1 text-sm">{days}</div>
    </div>
  );
};

export default Calendar;
