import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SchedulePage.css";
import ModalsSchedulePage from "../components/ModalsSchedulePage";

const SchedulePage = () => {
  const [schedule, setSchedule] = useState([]);
  const navigate = useNavigate();

  // Modal para agregar o editar horario
  const [addModal, setAddModal] = useState({
    visible: false,
    day: null,
    time: "",
    mode: "add", // "add" o "edit"
    scheduleId: null,
  });

  // Modal para eliminar horario
  const [deleteModal, setDeleteModal] = useState({
    visible: false,
    scheduleId: null,
  });

  // Conversión de hora a minutos para ordenar
  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      console.error("El userId no está disponible.");
      navigate("/");
      return;
    }

    const fetchSchedules = async () => {
      try {
        const response = await fetch(`/api/schedules/${userId}`);
        if (!response.ok) throw new Error("Error al obtener los horarios");
        const data = await response.json();

        // Ordenar por día y hora
        const sortedData = Array.isArray(data)
          ? data.sort((a, b) => {
              if (a.day_of_week === b.day_of_week) {
                return timeToMinutes(a.time) - timeToMinutes(b.time);
              }
              return 0;
            })
          : [];

        setSchedule(sortedData);
      } catch (error) {
        console.error("Error al obtener horarios:", error);
      }
    };

    fetchSchedules();
  }, [navigate]);

  // Abrir modal para agregar
  const openAddModal = (day) => {
    setAddModal({
      visible: true,
      day,
      time: "",
      mode: "add",
      scheduleId: null,
    });
  };

  // Abrir modal para editar
  const openEditModal = (scheduleItem) => {
    setAddModal({
      visible: true,
      day: scheduleItem.day_of_week,
      time: scheduleItem.time,
      mode: "edit",
      scheduleId: scheduleItem.id,
    });
  };

  // Confirmar agregar o editar horario
  const handleConfirmAddTime = async () => {
    if (!addModal.time) return;

    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      console.error("El userId no está disponible.");
      navigate("/");
      return;
    }

    try {
      let response;
      if (addModal.mode === "edit") {
        // EDITAR (PUT)
        response = await fetch(`/api/schedules/${addModal.scheduleId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            dayOfWeek: addModal.day,
            time: addModal.time,
          }),
        });
      } else {
        // AGREGAR (POST)
        response = await fetch("/api/schedules", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            dayOfWeek: addModal.day,
            time: addModal.time,
          }),
        });
      }

      if (response.ok) {
        const updatedSchedule = await response.json();
        setSchedule((prev) => {
          let updated;
          if (addModal.mode === "edit") {
            updated = prev.map((item) =>
              item.id === addModal.scheduleId ? updatedSchedule : item
            );
          } else {
            updated = [...prev, updatedSchedule];
          }

          return updated.sort((a, b) => {
            if (a.day_of_week === b.day_of_week) {
              return timeToMinutes(a.time) - timeToMinutes(b.time);
            }
            return 0;
          });
        });

        setAddModal({ visible: false, day: null, time: "", mode: "add", scheduleId: null });
      } else {
        console.error("Error al guardar horario.");
      }
    } catch (error) {
      console.error("Error al guardar horario:", error);
    }
  };

  // Abrir modal para eliminar
  const openDeleteModal = (scheduleId) => {
    setDeleteModal({ visible: true, scheduleId });
  };

  // Confirmar eliminación
  const confirmDeleteTime = async () => {
    try {
      const response = await fetch(`/api/schedules/${deleteModal.scheduleId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSchedule((prev) =>
          prev.filter((item) => item.id !== deleteModal.scheduleId)
        );
      } else {
        console.error("Error al eliminar horario.");
      }
    } catch (error) {
      console.error("Error al eliminar horario:", error);
    }
    setDeleteModal({ visible: false, scheduleId: null });
  };

  const daysOfWeek = ["L", "K", "M", "J", "V", "S", "D"];
  const maxRows = Math.max(
    ...daysOfWeek.map(
      (day) => schedule.filter((item) => item.day_of_week === day).length
    )
  );

  return (
    <div className="schedule-container">
      <h1>Horarios de publicación</h1>
      <table className="schedule-table">
        <thead>
          <tr>
            <th>Lunes</th>
            <th>Martes</th>
            <th>Miércoles</th>
            <th>Jueves</th>
            <th>Viernes</th>
            <th>Sábado</th>
            <th>Domingo</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: maxRows + 1 }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {daysOfWeek.map((day, colIndex) => {
                const daySchedules = schedule.filter(
                  (item) => item.day_of_week === day
                );

                if (rowIndex < daySchedules.length) {
                  const scheduleItem = daySchedules[rowIndex];
                  return (
                    <td key={colIndex}>
                      <span
                        className="time-item"
                        onClick={() => openEditModal(scheduleItem)}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          openDeleteModal(scheduleItem.id);
                        }}
                        title="Clic para editar • Clic derecho para eliminar"
                      >
                        {scheduleItem.time}
                      </span>
                    </td>
                  );
                }

                if (rowIndex === daySchedules.length) {
                  return (
                    <td key={colIndex}>
                      <button
                        className="add-button"
                        onClick={() => openAddModal(day)}
                      >
                        +
                      </button>
                    </td>
                  );
                }

                return <td key={colIndex}></td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <p className="hint">
        Haz clic en una hora para editarla o clic derecho para eliminarla.
      </p>

      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Volver
      </button>

      {/* Modales */}
      <ModalsSchedulePage
        addModal={addModal}
        setAddModal={setAddModal}
        handleConfirmAddTime={handleConfirmAddTime}
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
        confirmDeleteTime={confirmDeleteTime}
      />
    </div>
  );
};

export default SchedulePage;
