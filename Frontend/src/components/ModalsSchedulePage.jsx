import React from 'react';
import '../styles/SchedulePage.css';

const ModalsSchedulePage = ({
    addModal,
    setAddModal,
    handleConfirmAddTime,
    deleteModal,
    setDeleteModal,
    confirmDeleteTime
}) => {

    const closeAddModal = () => setAddModal({ visible: false, day: null, index: null, time: "" });
    const closeDeleteModal = () => setDeleteModal({ visible: false, day: null, index: null });

    return (
        <>
            {/* Modal Agregar/Editar */}
            {addModal.visible && (
            <div className="modal-overlay" onClick={closeAddModal}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>{addModal.mode === "edit" ? "Editar Horario" : "Agregar Hora"}</h3>
                <input
                    type="time"
                    value={addModal.time}
                    onChange={(e) =>
                    setAddModal((prev) => ({ ...prev, time: e.target.value }))
                    }
                />
                <div className="modal-buttons">
                    <button className="confirm" onClick={handleConfirmAddTime}>
                    {addModal.mode === "edit" ? "Guardar Cambios" : "Agregar"}
                    </button>
                    <button className="cancel" onClick={closeAddModal}>
                    ✗
                    </button>
                </div>
                </div>
            </div>
            )}

            {/* Modal de confirmación para eliminar */}
            {deleteModal.visible && (
                <div className="modal-overlay" onClick={closeDeleteModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>¿Eliminar esta hora?</h2>
                        <div className="modal-buttons">
                            <button className="confirm" onClick={confirmDeleteTime}>✓</button>
                            <button className="cancel" onClick={closeDeleteModal}>✗</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ModalsSchedulePage;