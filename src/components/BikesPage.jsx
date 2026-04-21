import { useState } from 'react';

function BikesPage({
    bikes,
    bikeName,
    setBikeName,
    bikeManufacturer,
    setBikeManufacturer,
    bikeModel,
    setBikeModel,
    bikeYear,
    setBikeYear,
    bikeCategory,
    setBikeCategory,
    bikeNotes,
    setBikeNotes,
    bikeFrontTyreKm,
    setBikeFrontTyreKm,
    bikeRearTyreKm,
    setBikeRearTyreKm,
    bikeOilKm,
    setBikeOilKm,
    bikeBrakePadsKm,
    setBikeBrakePadsKm,
    bikeMessage,
    handleBikeSave,
    editingBikeId,
    onEditBike,
    onCancelEditBike,
}) {
    const [showForm, setShowForm] = useState(false);

    const handleAdd = () => {
        onCancelEditBike();
        setShowForm(true);
    };

    const handleEdit = (bike) => {
        onEditBike(bike);
        setShowForm(true);
    };

    const handleCancel = () => {
        onCancelEditBike();
        setShowForm(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const saved = await handleBikeSave(event);
        if (saved !== false) {
            setShowForm(false);
        }
    };

    return (
        <section className="profile-page">
            <div className="profile-page-header">
                <div>
                    <h2>Le mie moto</h2>
                    <p>Gestisci le tue moto per le giornate in pista.</p>
                </div>
                {!showForm && (
                    <button type="button" className="btn auth-button bike-add-btn" onClick={handleAdd}>
                        Aggiungi moto
                    </button>
                )}
            </div>

            <div className="events-list">
                {bikes.length === 0 && !showForm ? (
                    <p className="no-events">Nessuna moto salvata ancora.</p>
                ) : (
                    bikes.map((bike) => (
                        <div className="event-card bike-card" key={bike.id}>
                            <button
                                type="button"
                                className="edit-btn bike-edit-btn"
                                onClick={() => handleEdit(bike)}
                                title="Modifica moto"
                            >
                                ✎
                            </button>
                            <div className="event-title">{bike.name}</div>
                            <div className="event-details">
                                    <div className="event-detail">
                                        <strong>Marca:</strong> <span>{bike.manufacturer || '—'}</span>
                                    </div>
                                    <div className="event-detail">
                                        <strong>Modello:</strong> <span>{bike.model || '—'}</span>
                                    </div>
                                    <div className="event-detail">
                                        <strong>Anno:</strong> <span>{bike.year || '—'}</span>
                                    </div>
                                    <div className="event-detail">
                                        <strong>Categoria:</strong> <span>{bike.category || '—'}</span>
                                    </div>
                            </div>
                            <div className="event-details">
                                    <div className="event-detail">
                                        <strong>Gomma ant.:</strong> <span>{bike.front_tyre_km != null ? `${bike.front_tyre_km} km` : '—'}</span>
                                    </div>
                                    <div className="event-detail">
                                        <strong>Gomma post.:</strong> <span>{bike.rear_tyre_km != null ? `${bike.rear_tyre_km} km` : '—'}</span>
                                    </div>
                                    <div className="event-detail">
                                        <strong>Olio:</strong> <span>{bike.oil_km != null ? `${bike.oil_km} km` : '—'}</span>
                                    </div>
                                    <div className="event-detail">
                                        <strong>Pastiglie:</strong> <span>{bike.brake_pads_km != null ? `${bike.brake_pads_km} km` : '—'}</span>
                                    </div>
                            </div>
                            {bike.notes && <p className="bike-notes">{bike.notes}</p>}
                        </div>
                    ))
                )}
            </div>

            {showForm && (
                <section className="profile-section bike-form-section">
                    <h3>{editingBikeId ? 'Modifica moto' : 'Nuova moto'}</h3>
                    <form className="profile-form" onSubmit={handleSubmit}>
                        <div className="profile-field-group">
                            <label className="profile-field">
                                <span>Nome moto</span>
                                <input
                                    type="text"
                                    value={bikeName}
                                    onChange={(event) => setBikeName(event.target.value)}
                                    placeholder="Es. Ducati Panigale V4"
                                    required
                                />
                            </label>
                            <label className="profile-field">
                                <span>Marca</span>
                                <input
                                    type="text"
                                    value={bikeManufacturer}
                                    onChange={(event) => setBikeManufacturer(event.target.value)}
                                    placeholder="Es. Ducati"
                                />
                            </label>
                        </div>
                        <div className="profile-field-group">
                            <label className="profile-field">
                                <span>Modello</span>
                                <input
                                    type="text"
                                    value={bikeModel}
                                    onChange={(event) => setBikeModel(event.target.value)}
                                    placeholder="Es. Panigale V4"
                                />
                            </label>
                            <label className="profile-field">
                                <span>Anno</span>
                                <input
                                    type="number"
                                    min="1900"
                                    max="2100"
                                    value={bikeYear}
                                    onChange={(event) => setBikeYear(event.target.value)}
                                    placeholder="2024"
                                />
                            </label>
                        </div>
                        <label className="profile-field">
                            <span>Categoria</span>
                            <input
                                type="text"
                                value={bikeCategory}
                                onChange={(event) => setBikeCategory(event.target.value)}
                                placeholder="Sportiva, Naked, Enduro"
                            />
                        </label>
                        <label className="profile-field">
                            <span>Note</span>
                            <textarea
                                value={bikeNotes}
                                onChange={(event) => setBikeNotes(event.target.value)}
                                placeholder="Note sulla preparazione, gomme, etc."
                            />
                        </label>
                        <div className="profile-field-group">
                            <label className="profile-field">
                                <span>Ultimo cambio gomma ant. (km)</span>
                                <input
                                    type="number"
                                    min="0"
                                    value={bikeFrontTyreKm}
                                    onChange={(event) => setBikeFrontTyreKm(event.target.value)}
                                    placeholder="km"
                                />
                            </label>
                            <label className="profile-field">
                                <span>Ultimo cambio gomma post. (km)</span>
                                <input
                                    type="number"
                                    min="0"
                                    value={bikeRearTyreKm}
                                    onChange={(event) => setBikeRearTyreKm(event.target.value)}
                                    placeholder="km"
                                />
                            </label>
                        </div>
                        <div className="profile-field-group">
                            <label className="profile-field">
                                <span>Ultimo cambio olio (km)</span>
                                <input
                                    type="number"
                                    min="0"
                                    value={bikeOilKm}
                                    onChange={(event) => setBikeOilKm(event.target.value)}
                                    placeholder="km"
                                />
                            </label>
                            <label className="profile-field">
                                <span>Ultimo cambio pastiglie (km)</span>
                                <input
                                    type="number"
                                    min="0"
                                    value={bikeBrakePadsKm}
                                    onChange={(event) => setBikeBrakePadsKm(event.target.value)}
                                    placeholder="km"
                                />
                            </label>
                        </div>
                        {bikeMessage && <div className="auth-message">{bikeMessage}</div>}
                        <div className="profile-actions bike-form-actions">
                            <button type="button" className="btn auth-profile" onClick={handleCancel}>
                                Annulla
                            </button>
                            <button type="submit" className="btn auth-button">
                                {editingBikeId ? 'Aggiorna moto' : 'Salva moto'}
                            </button>
                        </div>
                    </form>
                </section>
            )}
        </section>
    );
}

export default BikesPage;
