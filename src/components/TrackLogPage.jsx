import { useState } from 'react';

function TrackLogPage({
    bikes,
    circuits,
    trackDate,
    setTrackDate,
    trackCircuitName,
    setTrackCircuitName,
    trackBikeId,
    setTrackBikeId,
    trackWeather,
    setTrackWeather,
    trackSessions,
    onTrackSessionChange,
    trackBestLapTime,
    setTrackBestLapTime,
    trackAverageLapTime,
    setTrackAverageLapTime,
    trackNotes,
    setTrackNotes,
    trackMessage,
    handleTrackDaySave,
    saveTrackDayDetails,
    saveTrackTurn,
    isEditing,
}) {
    const [currentStep, setCurrentStep] = useState(1);
    const [activeTurn, setActiveTurn] = useState(1);
    const totalTurns = trackSessions.length;
    const currentSession = trackSessions[activeTurn - 1] || {};
    const canContinueToTurns = trackDate && trackCircuitName && trackBikeId;

    const handleStepChange = async (step) => {
        if (step === 2) {
            if (!canContinueToTurns) return;
            const saved = await saveTrackDayDetails();
            if (!saved) return;
        }

        setCurrentStep(step);
    };

    const handleProceedToTurns = async () => {
        if (!canContinueToTurns) return;
        const saved = await saveTrackDayDetails();
        if (saved) {
            setCurrentStep(2);
        }
    };

    const handleNextTurn = async () => {
        const saved = await saveTrackTurn(activeTurn - 1, currentSession);
        if (!saved) return;

        if (activeTurn < totalTurns) {
            setActiveTurn(activeTurn + 1);
        }
    };

    const handlePrevTurn = async () => {
        if (activeTurn > 1) {
            const saved = await saveTrackTurn(activeTurn - 1, currentSession);
            if (!saved) return;
            setActiveTurn(activeTurn - 1);
        }
    };

    const handleCloneAndNext = async () => {
        const saved = await saveTrackTurn(activeTurn - 1, currentSession);
        if (!saved) return;

        if (activeTurn < totalTurns) {
            // Clone current session data to next session
            const nextIndex = activeTurn;
            Object.keys(currentSession).forEach(key => {
                if (key !== 'turn') { // Don't copy turn number
                    onTrackSessionChange(nextIndex, key, currentSession[key]);
                }
            });
            setActiveTurn(activeTurn + 1);
        }
    };

    const parseDecimalValue = (value) => {
        if (value == null) return null;
        const parsed = Number(String(value).trim().replace(',', '.'));
        return Number.isFinite(parsed) ? parsed : null;
    };

    const parseIntegerValue = (value) => {
        if (value == null) return null;
        const parsed = parseInt(String(value).trim(), 10);
        return Number.isFinite(parsed) ? parsed : null;
    };

    const adjustPressure = (field, delta) => {
        const current = parseDecimalValue(currentSession[field]);
        const next = current !== null ? Math.round((current + delta) * 10) / 10 : delta;
        onTrackSessionChange(activeTurn - 1, field, next.toFixed(1));
    };

    const adjustSuspension = (field, delta) => {
        const current = parseIntegerValue(currentSession[field]);
        const next = current !== null ? current + delta : delta;
        onTrackSessionChange(activeTurn - 1, field, String(next));
    };

    return (
        <section className="track-log-page">
            <div className="profile-page-header">
                <div>
                    <h2>{isEditing ? 'Modifica giornata' : 'Log pista'}</h2>
                    <p>{isEditing ? 'Modifica i dati della giornata in pista.' : 'Registra la tua moto e salva i dati delle giornate in pista.'}</p>
                </div>
            </div>

            <section className="profile-section">
                <h3>Giornata in pista</h3>
                <p>Inserisci prima i dati principali della giornata e poi completa i singoli turni.</p>
                <div className="track-log-stepper">
                    <button
                        type="button"
                        className={`track-log-step ${currentStep === 1 ? 'active' : ''}`}
                        onClick={() => handleStepChange(1)}
                    >
                        1. Dati giornata
                    </button>
                    <button
                        type="button"
                        className={`track-log-step ${currentStep === 2 ? 'active' : ''}`}
                        onClick={() => handleStepChange(2)}
                        disabled={!canContinueToTurns}
                    >
                        2. Turni
                    </button>
                </div>

                <form className="profile-form" onSubmit={handleTrackDaySave}>
                    {currentStep === 1 ? (
                        <>
                            <div className="profile-field-group">
                                <label className="profile-field">
                                    <span>Data</span>
                                    <input
                                        type="date"
                                        value={trackDate}
                                        onChange={(event) => setTrackDate(event.target.value)}
                                        required
                                    />
                                </label>
                                <label className="profile-field">
                                    <span>Circuito</span>
                                    <input
                                        list="circuit-list"
                                        type="text"
                                        value={trackCircuitName}
                                        onChange={(event) => setTrackCircuitName(event.target.value)}
                                        placeholder="Seleziona o digita un circuito"
                                        required
                                    />
                                    <datalist id="circuit-list">
                                        {circuits.map((circuit) => (
                                            <option key={circuit} value={circuit} />
                                        ))}
                                    </datalist>
                                </label>
                            </div>
                            <div className="profile-field-group">
                                <label className="profile-field">
                                    <span>Moto</span>
                                    <select value={trackBikeId} onChange={(event) => setTrackBikeId(event.target.value)} required>
                                        <option value="">Seleziona una moto</option>
                                        {bikes.map((bike) => (
                                            <option key={bike.id} value={bike.id}>
                                                {bike.name} {bike.year ? `(${bike.year})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <label className="profile-field">
                                    <span>Meteo</span>
                                    <input
                                        type="text"
                                        value={trackWeather}
                                        onChange={(event) => setTrackWeather(event.target.value)}
                                        placeholder="Sole, Nuvoloso, Pioggia"
                                    />
                                </label>
                            </div>
                            <div className="profile-actions">
                                <button
                                    type="button"
                                    className="btn auth-button"
                                    onClick={handleProceedToTurns}
                                    disabled={!canContinueToTurns}
                                >
                                    Prosegui ai turni
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="track-session-card">
                                <div className="track-session-header">
                                    <div className="track-turn-navigation">
                                        <button
                                            type="button"
                                            className="track-turn-nav-btn"
                                            onClick={handlePrevTurn}
                                            disabled={activeTurn === 1}
                                            title="Turno precedente"
                                        >
                                            ←
                                        </button>
                                        <span key={activeTurn} className="track-turn-label">Turno {activeTurn} / {totalTurns}</span>
                                        <button
                                            type="button"
                                            className="track-turn-nav-btn"
                                            onClick={handleNextTurn}
                                            disabled={activeTurn === totalTurns}
                                            title="Prossimo turno"
                                        >
                                            →
                                        </button>
                                    </div>
                                    <div className="track-turn-actions">
                                        {activeTurn < totalTurns && (
                                            <>
                                                <button
                                                    type="button"
                                                    className="btn auth-button"
                                                    onClick={handleNextTurn}
                                                >
                                                    Prossimo turno
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn auth-button"
                                                    onClick={handleCloneAndNext}
                                                >
                                                    Clona e prossimo
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div key={activeTurn} className="track-session-content">
                                <div className="track-category-block">
                                    <div className="track-category-title">Gomme</div>
                                    
                                    <div className="track-subcategory">
                                        <div className="track-subcategory-title">Anteriore</div>
                                        <div className="profile-field-group">
                                            <label className="profile-field">
                                                <span>Gomma</span>
                                                <input
                                                    type="text"
                                                    value={currentSession.tyre_front}
                                                    onChange={(event) => onTrackSessionChange(activeTurn - 1, 'tyre_front', event.target.value)}
                                                    placeholder="Anteriore"
                                                />
                                            </label>
                                            <label className="profile-field">
                                                <span>Pressione</span>
                                                <div className="input-with-controls">
                                                    <button
                                                        type="button"
                                                        className="stepper-button"
                                                        onClick={() => adjustPressure('pressure_front', -0.1)}
                                                    >
                                                        -
                                                    </button>
                                                    <input
                                                        type="text"
                                                        value={currentSession.pressure_front}
                                                        onChange={(event) => onTrackSessionChange(activeTurn - 1, 'pressure_front', event.target.value)}
                                                        placeholder="Anteriore"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="stepper-button"
                                                        onClick={() => adjustPressure('pressure_front', 0.1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                    
                                    <div className="track-subcategory">
                                        <div className="track-subcategory-title">Posteriore</div>
                                        <div className="profile-field-group">
                                            <label className="profile-field">
                                                <span>Gomma</span>
                                                <input
                                                    type="text"
                                                    value={currentSession.tyre_rear}
                                                    onChange={(event) => onTrackSessionChange(activeTurn - 1, 'tyre_rear', event.target.value)}
                                                    placeholder="Posteriore"
                                                />
                                            </label>
                                            <label className="profile-field">
                                                <span>Pressione</span>
                                                <div className="input-with-controls">
                                                    <button
                                                        type="button"
                                                        className="stepper-button"
                                                        onClick={() => adjustPressure('pressure_rear', -0.1)}
                                                    >
                                                        -
                                                    </button>
                                                    <input
                                                        type="text"
                                                        value={currentSession.pressure_rear}
                                                        onChange={(event) => onTrackSessionChange(activeTurn - 1, 'pressure_rear', event.target.value)}
                                                        placeholder="Posteriore"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="stepper-button"
                                                        onClick={() => adjustPressure('pressure_rear', 0.1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="track-category-block">
                                    <div className="track-category-title">Sospensioni</div>
                                    
                                    <div className="track-subcategory">
                                        <div className="track-subcategory-title">Forcella</div>
                                        <div className="profile-field-group">
                                            <label className="profile-field">
                                                <span>Compressione</span>
                                                <div className="input-with-controls">
                                                    <button
                                                        type="button"
                                                        className="stepper-button"
                                                        onClick={() => adjustSuspension('fork_compression', -1)}
                                                    >
                                                        -
                                                    </button>
                                                    <input
                                                        type="text"
                                                        value={currentSession.fork_compression}
                                                        onChange={(event) => onTrackSessionChange(activeTurn - 1, 'fork_compression', event.target.value)}
                                                        placeholder="Compressione"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="stepper-button"
                                                        onClick={() => adjustSuspension('fork_compression', 1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </label>
                                            <label className="profile-field">
                                                <span>Ritorno</span>
                                                <div className="input-with-controls">
                                                    <button
                                                        type="button"
                                                        className="stepper-button"
                                                        onClick={() => adjustSuspension('fork_rebound', -1)}
                                                    >
                                                        -
                                                    </button>
                                                    <input
                                                        type="text"
                                                        value={currentSession.fork_rebound}
                                                        onChange={(event) => onTrackSessionChange(activeTurn - 1, 'fork_rebound', event.target.value)}
                                                        placeholder="Ritorno"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="stepper-button"
                                                        onClick={() => adjustSuspension('fork_rebound', 1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </label>
                                            <label className="profile-field">
                                                <span>Precarico</span>
                                                <div className="input-with-controls">
                                                    <button
                                                        type="button"
                                                        className="stepper-button"
                                                        onClick={() => adjustSuspension('fork_preload', -1)}
                                                    >
                                                        -
                                                    </button>
                                                    <input
                                                        type="text"
                                                        value={currentSession.fork_preload}
                                                        onChange={(event) => onTrackSessionChange(activeTurn - 1, 'fork_preload', event.target.value)}
                                                        placeholder="Precarico"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="stepper-button"
                                                        onClick={() => adjustSuspension('fork_preload', 1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                    
                                    <div className="track-subcategory">
                                        <div className="track-subcategory-title">Mono</div>
                                        <div className="profile-field-group">
                                            <label className="profile-field">
                                                <span>Compressione</span>
                                                <div className="input-with-controls">
                                                    <button
                                                        type="button"
                                                        className="stepper-button"
                                                        onClick={() => adjustSuspension('mono_compression', -1)}
                                                    >
                                                        -
                                                    </button>
                                                    <input
                                                        type="text"
                                                        value={currentSession.mono_compression}
                                                        onChange={(event) => onTrackSessionChange(activeTurn - 1, 'mono_compression', event.target.value)}
                                                        placeholder="Compressione"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="stepper-button"
                                                        onClick={() => adjustSuspension('mono_compression', 1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </label>
                                            <label className="profile-field">
                                                <span>Ritorno</span>
                                                <div className="input-with-controls">
                                                    <button
                                                        type="button"
                                                        className="stepper-button"
                                                        onClick={() => adjustSuspension('mono_rebound', -1)}
                                                    >
                                                        -
                                                    </button>
                                                    <input
                                                        type="text"
                                                        value={currentSession.mono_rebound}
                                                        onChange={(event) => onTrackSessionChange(activeTurn - 1, 'mono_rebound', event.target.value)}
                                                        placeholder="Ritorno"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="stepper-button"
                                                        onClick={() => adjustSuspension('mono_rebound', 1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </label>
                                            <label className="profile-field">
                                                <span>Precarico</span>
                                                <div className="input-with-controls">
                                                    <button
                                                        type="button"
                                                        className="stepper-button"
                                                        onClick={() => adjustSuspension('mono_preload', -1)}
                                                    >
                                                        -
                                                    </button>
                                                    <input
                                                        type="text"
                                                        value={currentSession.mono_preload}
                                                        onChange={(event) => onTrackSessionChange(activeTurn - 1, 'mono_preload', event.target.value)}
                                                        placeholder="Precarico"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="stepper-button"
                                                        onClick={() => adjustSuspension('mono_preload', 1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="track-category-block">
                                    <div className="track-category-title">Setup</div>
                                    <div className="profile-field-group">
                                        <label className="profile-field">
                                            <span>Rapportatura</span>
                                            <input
                                                type="text"
                                                value={currentSession.gearing}
                                                onChange={(event) => onTrackSessionChange(activeTurn - 1, 'gearing', event.target.value)}
                                                placeholder="Rapportatura"
                                            />
                                        </label>
                                        <label className="profile-field">
                                            <span>Carico carburante</span>
                                            <input
                                                type="text"
                                                value={currentSession.fuel_load}
                                                onChange={(event) => onTrackSessionChange(activeTurn - 1, 'fuel_load', event.target.value)}
                                                placeholder="Litri"
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div className="track-category-block">
                                    <div className="track-category-title">Risultati</div>
                                    <div className="profile-field-group">
                                        <label className="profile-field">
                                            <span>Tempo turno</span>
                                            <input
                                                type="text"
                                                value={currentSession.lap_time}
                                                onChange={(event) => onTrackSessionChange(activeTurn - 1, 'lap_time', event.target.value)}
                                                placeholder="mm:ss:dd"
                                            />
                                        </label>
                                        <label className="profile-field">
                                            <span>Note turno</span>
                                            <textarea
                                                value={currentSession.notes}
                                                onChange={(event) => onTrackSessionChange(activeTurn - 1, 'notes', event.target.value)}
                                                placeholder="Note turno"
                                            />
                                        </label>
                                    </div>
                                </div>
                                </div>
                            </div>

                            <div className="profile-actions track-log-navigation">
                                <button
                                    type="button"
                                    className="btn auth-profile"
                                    onClick={handlePrevTurn}
                                    disabled={activeTurn === 1}
                                >
                                    Indietro
                                </button>
                                <button
                                    type="submit"
                                    className="btn auth-button"
                                >
                                    {isEditing ? 'Aggiorna giornata' : 'Salva giornata'}
                                </button>
                            </div>

                            {activeTurn === totalTurns && (
                                <div className="track-summary-block">
                                    <h4>Riepilogo giornata</h4>
                                    <div className="profile-field-group">
                                        <label className="profile-field">
                                            <span>Miglior giro</span>
                                            <input
                                                type="text"
                                                value={trackBestLapTime}
                                                onChange={(event) => setTrackBestLapTime(event.target.value)}
                                                placeholder="mm:ss:dd"
                                            />
                                        </label>
                                        <label className="profile-field">
                                            <span>Tempo medio</span>
                                            <input
                                                type="text"
                                                value={trackAverageLapTime}
                                                onChange={(event) => setTrackAverageLapTime(event.target.value)}
                                                placeholder="mm:ss:dd"
                                            />
                                        </label>
                                    </div>
                                    <label className="profile-field">
                                        <span>Note generali</span>
                                        <textarea
                                            value={trackNotes}
                                            onChange={(event) => setTrackNotes(event.target.value)}
                                            placeholder="Cambio assetto, sensazioni, punti da migliorare"
                                        />
                                    </label>
                                </div>
                            )}
                        </>
                    )}

                    {trackMessage && <div className="auth-message">{trackMessage}</div>}
                </form>
            </section>
        </section>
    );
}

export default TrackLogPage;
