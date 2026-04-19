import { formatDateItalian, formatLapTime } from '../lib/utils.js';
import { useState } from 'react';

function TrackHistoryPage({ trackDays, onSelectTrackDay, onDeleteTrackDay }) {
    const [previewDay, setPreviewDay] = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    // Helper function to calculate best lap time and average lap time from turns
    function calculateLapStats(turns) {
        if (!turns || turns.length === 0) {
            return { best: null, average: null };
        }

        const lapTimes = turns
            .map(turn => turn.lap_time)
            .filter(time => time != null && time > 0);

        if (lapTimes.length === 0) {
            return { best: null, average: null };
        }

        const best = Math.min(...lapTimes);
        const average = lapTimes.reduce((sum, time) => sum + time, 0) / lapTimes.length;

        return { best, average };
    }

    const handlePreview = (day) => setPreviewDay(previewDay?.id === day.id ? null : day);
    const handleEdit = (day) => onSelectTrackDay(day);

    return (
        <section className="track-history-page">
            <div className="profile-page-header">
                <div>
                    <h2>Storico giornate in pista</h2>
                    <p>Clicca su una giornata per vedere l'anteprima, o usa il bottone modifica per editarla.</p>
                </div>
            </div>

            <section className="events-section">
                {trackDays.length === 0 ? (
                    <p className="no-events">Nessun log pista registrato.</p>
                ) : (
                    <div className="trackday-list">
                        {trackDays.map((day) => {
                            const { best, average } = calculateLapStats(day.track_day_turns);
                            const isExpanded = previewDay?.id === day.id;
                            return (
                                <div key={day.id} className={`trackday-item${isExpanded ? ' trackday-item-expanded' : ''}`}>
                                    <div
                                        role="button"
                                        tabIndex={0}
                                        className="event-card event-card-summary"
                                        onClick={() => handlePreview(day)}
                                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handlePreview(day); }}
                                    >
                                        <div className="event-card-header">
                                            <div className="event-date">{formatDateItalian(day.date)}</div>
                                            <div className="trackday-actions">
                                                <button className="edit-btn" onClick={(e) => { e.stopPropagation(); handleEdit(day); }}>✎</button>
                                                <button className="delete-btn" onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(day.id); }}>✕</button>
                                            </div>
                                        </div>
                                        <div className="event-title">{day.circuit_name}</div>
                                        <div className="event-details">
                                            <div className="event-detail">
                                                <strong>Moto:</strong> <span>{day.bike_name}</span>
                                            </div>
                                            <div className="event-detail">
                                                <strong>Meteo:</strong> <span>{day.weather || '—'}</span>
                                            </div>
                                        </div>
                                        <div className="event-details">
                                            <div className="event-detail">
                                                <strong>Miglior giro:</strong> <span>{formatLapTime(best)}</span>
                                            </div>
                                            <div className="event-detail">
                                                <strong>Tempo medio:</strong> <span>{formatLapTime(average)}</span>
                                            </div>
                                            <div className="event-detail">
                                                <strong>Turni:</strong> <span>{day.track_day_turns?.length || 0}</span>
                                            </div>
                                        </div>
                                        {day.notes && <p>{day.notes}</p>}
                                    </div>

                                    {isExpanded && (
                                        <div className="inline-preview">
                                            <div className="inline-preview-header">
                                                <h3>Dettaglio giornata</h3>
                                            </div>
                                            <div className="inline-preview-info">
                                                <div className="inline-preview-field">
                                                    <span className="field-label">Data</span>
                                                    <span className="field-value">{formatDateItalian(day.date)}</span>
                                                </div>
                                                <div className="inline-preview-field">
                                                    <span className="field-label">Circuito</span>
                                                    <span className="field-value">{day.circuit_name}</span>
                                                </div>
                                                <div className="inline-preview-field">
                                                    <span className="field-label">Moto</span>
                                                    <span className="field-value">{day.bike_name}</span>
                                                </div>
                                                <div className="inline-preview-field">
                                                    <span className="field-label">Meteo</span>
                                                    <span className="field-value">{day.weather || '—'}</span>
                                                </div>
                                                <div className="inline-preview-field inline-preview-field-full">
                                                    <span className="field-label">Note</span>
                                                    <span className="field-value">{day.notes || '—'}</span>
                                                </div>
                                            </div>

                                            <h4 className="inline-preview-turns-title">Turni</h4>
                                            {day.track_day_turns?.length > 0 ? (
                                                <div className="inline-turns-list">
                                                    {day.track_day_turns.map((turn, index) => (
                                                        <div key={index} className="inline-turn-card">
                                                            <h5 className="inline-turn-title">Turno {turn.turn || index + 1}</h5>
                                                            <div className="inline-turn-grid">
                                                                <div className="inline-turn-field">
                                                                    <span className="field-label">Gomma Ant.</span>
                                                                    <span className="field-value">{turn.tyre_front || '—'}</span>
                                                                </div>
                                                                <div className="inline-turn-field">
                                                                    <span className="field-label">Gomma Post.</span>
                                                                    <span className="field-value">{turn.tyre_rear || '—'}</span>
                                                                </div>
                                                                <div className="inline-turn-field">
                                                                    <span className="field-label">Press. Ant.</span>
                                                                    <span className="field-value">{turn.pressure_front || '—'}</span>
                                                                </div>
                                                                <div className="inline-turn-field">
                                                                    <span className="field-label">Press. Post.</span>
                                                                    <span className="field-value">{turn.pressure_rear || '—'}</span>
                                                                </div>
                                                                <div className="inline-turn-field">
                                                                    <span className="field-label">Forcella Compr.</span>
                                                                    <span className="field-value">{turn.fork_compression || '—'}</span>
                                                                </div>
                                                                <div className="inline-turn-field">
                                                                    <span className="field-label">Forcella Rit.</span>
                                                                    <span className="field-value">{turn.fork_rebound || '—'}</span>
                                                                </div>
                                                                <div className="inline-turn-field">
                                                                    <span className="field-label">Forcella Prec.</span>
                                                                    <span className="field-value">{turn.fork_preload || '—'}</span>
                                                                </div>
                                                                <div className="inline-turn-field">
                                                                    <span className="field-label">Mono Compr.</span>
                                                                    <span className="field-value">{turn.mono_compression || '—'}</span>
                                                                </div>
                                                                <div className="inline-turn-field">
                                                                    <span className="field-label">Mono Rit.</span>
                                                                    <span className="field-value">{turn.mono_rebound || '—'}</span>
                                                                </div>
                                                                <div className="inline-turn-field">
                                                                    <span className="field-label">Mono Prec.</span>
                                                                    <span className="field-value">{turn.mono_preload || '—'}</span>
                                                                </div>
                                                                <div className="inline-turn-field">
                                                                    <span className="field-label">Cambio</span>
                                                                    <span className="field-value">{turn.gearing || '—'}</span>
                                                                </div>
                                                                <div className="inline-turn-field">
                                                                    <span className="field-label">Carburante</span>
                                                                    <span className="field-value">{turn.fuel_load || '—'}</span>
                                                                </div>
                                                                <div className="inline-turn-field">
                                                                    <span className="field-label">Tempo Giro</span>
                                                                    <span className="field-value field-value-highlight">{formatLapTime(turn.lap_time) || '—'}</span>
                                                                </div>
                                                            </div>
                                                            {turn.notes && (
                                                                <div className="inline-turn-notes">
                                                                    <span className="field-label">Note</span>
                                                                    <span className="field-value">{turn.notes}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="no-turns-msg">Nessun turno registrato.</p>
                                            )}
                                        </div>
                                    )}

                                    {confirmDeleteId === day.id && (
                                        <div className="confirm-delete-overlay">
                                            <p>Eliminare questa giornata e tutti i turni associati?</p>
                                            <div className="confirm-delete-actions">
                                                <button
                                                    className="confirm-delete-yes"
                                                    onClick={() => {
                                                        onDeleteTrackDay(day.id);
                                                        setConfirmDeleteId(null);
                                                        if (previewDay?.id === day.id) setPreviewDay(null);
                                                    }}
                                                >
                                                    Elimina
                                                </button>
                                                <button
                                                    className="confirm-delete-no"
                                                    onClick={() => setConfirmDeleteId(null)}
                                                >
                                                    Annulla
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </section>
    );
}

export default TrackHistoryPage;
