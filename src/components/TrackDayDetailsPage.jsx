import { formatDateItalian, formatLapTime } from '../lib/utils.js';

function TrackDayDetailsPage({ trackDay, onBack }) {
    if (!trackDay) {
        return (
            <section className="trackday-detail-page">
                <div className="profile-page-header">
                    <div>
                        <h2>Dettaglio giornata</h2>
                        <p>Seleziona una giornata dallo storico per visualizzare i dettagli.</p>
                    </div>
                </div>
                <section className="profile-section">
                    <p className="no-events">Nessuna giornata selezionata.</p>
                    <button type="button" className="btn auth-button" onClick={onBack}>
                        Torna alle mie giornate
                    </button>
                </section>
            </section>
        );
    }

    const sortedTurns = (trackDay.track_day_turns || []).slice().sort((a, b) => a.turn_number - b.turn_number);

    return (
        <section className="trackday-detail-page">
            <div className="profile-page-header">
                <div>
                    <h2>Dettaglio giornata</h2>
                    <p>Visualizza tutti i turni salvati e il riepilogo completo della giornata.</p>
                </div>
                <button type="button" className="btn auth-button" onClick={onBack}>
                    Torna alle mie giornate
                </button>
            </div>

            <section className="profile-section">
                <div className="event-card">
                    <div className="event-date">{formatDateItalian(trackDay.date)}</div>
                    <div className="event-title">{trackDay.circuit_name}</div>
                    <div className="event-details">
                        <div className="event-detail">
                            <strong>Moto:</strong> <span>{trackDay.bike_name}</span>
                        </div>
                        <div className="event-detail">
                            <strong>Meteo:</strong> <span>{trackDay.weather || '—'}</span>
                        </div>
                    </div>
                    <div className="event-details">
                        <div className="event-detail">
                            <strong>Miglior giro:</strong> <span>{trackDay.best_lap_time ?? '—'}</span>
                        </div>
                        <div className="event-detail">
                            <strong>Tempo medio:</strong> <span>{trackDay.average_lap_time ?? '—'}</span>
                        </div>
                        <div className="event-detail">
                            <strong>Turni salvati:</strong> <span>{sortedTurns.length}</span>
                        </div>
                    </div>
                    {trackDay.notes && <p>{trackDay.notes}</p>}
                </div>

                {sortedTurns.length > 0 ? (
                    <div className="track-history-turns">
                        {sortedTurns.map((turn) => (
                            <div className="track-history-turn" key={turn.id}>
                                <h4>Turno {turn.turn_number}</h4>
                                <div className="event-details">
                                    <div className="event-detail">
                                        <strong>Gomma anteriore:</strong>
                                        <span>{turn.tyre_front || '—'} / {turn.pressure_front || '—'}</span>
                                    </div>
                                    <div className="event-detail">
                                        <strong>Gomma posteriore:</strong>
                                        <span>{turn.tyre_rear || '—'} / {turn.pressure_rear || '—'}</span>
                                    </div>
                                </div>
                                <div className="event-details">
                                    <div className="event-detail">
                                        <strong>Forcella</strong>
                                        <span>Compressione: {turn.fork_compression || '—'} / Rebound: {turn.fork_rebound || '—'} / Preload: {turn.fork_preload || '—'}</span>
                                    </div>
                                    <div className="event-detail">
                                        <strong>Monoammortizzatore</strong>
                                        <span>Compressione: {turn.mono_compression || '—'} / Rebound: {turn.mono_rebound || '—'} / Preload: {turn.mono_preload || '—'}</span>
                                    </div>
                                </div>
                                <div className="event-details">
                                    <div className="event-detail">
                                        <strong>Rapporto:</strong> <span>{turn.gearing || '—'}</span>
                                    </div>
                                    <div className="event-detail">
                                        <strong>Carburante:</strong> <span>{turn.fuel_load || '—'}</span>
                                    </div>
                                </div>
                                <div className="event-details">
                                    <div className="event-detail">
                                        <strong>Tempo giro:</strong> <span>{formatLapTime(turn.lap_time)}</span>
                                    </div>
                                </div>
                                {turn.notes && <p>{turn.notes}</p>}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-events">Nessun turno salvato per questa giornata.</p>
                )}
            </section>
        </section>
    );
}

export default TrackDayDetailsPage;
