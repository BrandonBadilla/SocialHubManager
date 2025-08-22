import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SchedulePage.css';
import ModalsSchedulePage from '../components/ModalsSchedulePage';

const SchedulePage = () => {
    const navigate = useNavigate();
    const [schedule, setSchedule] = useState({
        L: Array(6).fill(""),
        K: Array(6).fill(""),
        M: Array(6).fill(""),
        J: Array(6).fill(""),
        V: Array(6).fill(""),
        S: Array(6).fill(""),
        D: Array(6).fill(""),
    });

    // Estados de modales
    const [addModal, setAddModal] = useState({ visible: false, day: null, index: null, time: "" });
    const [deleteModal, setDeleteModal] = useState({ visible: false, day: null, index: null });

    const convertToAMPM = (time) => {
        const [hours, minutes] = time.split(":").map(Number);
        const ampm = hours >= 12 ? "PM" : "AM";
        const adjustedHours = hours % 12 || 12;
        return `${adjustedHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
    };

    const openAddModal = (day, index) => setAddModal({ visible: true, day, index, time: "" });

    const handleConfirmAddTime = () => {
        if (addModal.time) {
            const formattedTime = convertToAMPM(addModal.time);
            setSchedule((prev) => {
                const updatedDay = [...prev[addModal.day]];
                updatedDay[addModal.index] = formattedTime;

                // Ordenar de más temprano a más tarde
                const timesOnly = updatedDay
                    .filter((t) => t !== "")
                    .map((t) => {
                        const [hourMin, ampm] = t.split(" ");
                        let [h, m] = hourMin.split(":").map(Number);
                        if (ampm === "PM" && h !== 12) h += 12;
                        if (ampm === "AM" && h === 12) h = 0;
                        return { original: t, hours: h, minutes: m };
                    });
                timesOnly.sort((a, b) => a.hours - b.hours || a.minutes - b.minutes);
                const sortedDay = Array(6).fill("");
                timesOnly.forEach((t, i) => sortedDay[i] = t.original);
                return { ...prev, [addModal.day]: sortedDay };
            });
        }
        setAddModal({ visible: false, day: null, index: null, time: "" });
    };

    const handleDeleteClick = (day, index) => setDeleteModal({ visible: true, day, index });

    const confirmDeleteTime = () => {
        setSchedule((prev) => {
            const updatedDay = [...prev[deleteModal.day]];
            updatedDay[deleteModal.index] = "";
            return { ...prev, [deleteModal.day]: updatedDay };
        });
        setDeleteModal({ visible: false, day: null, index: null });
    };

    return (
        <div className="schedule-container">
            <h1>Horarios de publicación</h1>
            <table className="schedule-table">
                <thead>
                    <tr>
                        {["L", "K", "M", "J", "V", "S", "D"].map((day) => (
                            <th key={day}>{day}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: 6 }).map((_, rowIndex) => (
                        <tr key={rowIndex}>
                            {["L", "K", "M", "J", "V", "S", "D"].map((day) => (
                                <td key={day}>
                                    {schedule[day][rowIndex] ? (
                                        <span
                                            className="time-item"
                                            onClick={() => handleDeleteClick(day, rowIndex)}
                                        >
                                            {schedule[day][rowIndex]}
                                        </span>
                                    ) : (
                                        <button
                                            className="add-button"
                                            onClick={() => openAddModal(day, rowIndex)}
                                        >
                                            +
                                        </button>
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            <p className="hint">Haz clic en una hora para eliminarla o en "+" para agregar nuevas.</p>
            <button className="back-btn" onClick={() => navigate(-1)}>← Volver</button>

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