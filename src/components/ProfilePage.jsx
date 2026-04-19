function ProfilePage({
    profile,
    profileFirstName,
    profileLastName,
    profileNickname,
    profileCountry,
    profilePhone,
    profileMessage,
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
    bikeMessage,
    handleProfileSave,
    handleBikeSave,
}) {
    return (
        <section className="profile-page">
            <div className="profile-page-header">
                <div>
                    <h2>Il tuo profilo</h2>
                    <p>Modifica i tuoi dati personali.</p>
                </div>
            </div>
            <form className="profile-form" onSubmit={handleProfileSave}>
                <div className="profile-field-group">
                    <label className="profile-field">
                        <span>Nome</span>
                        <input
                            type="text"
                            value={profileFirstName}
                            onChange={(event) => setProfileFirstName(event.target.value)}
                            placeholder="Nome"
                        />
                    </label>
                    <label className="profile-field">
                        <span>Cognome</span>
                        <input
                            type="text"
                            value={profileLastName}
                            onChange={(event) => setProfileLastName(event.target.value)}
                            placeholder="Cognome"
                        />
                    </label>
                </div>
                <label className="profile-field">
                    <span>Email</span>
                    <input type="email" value={profile?.email ?? ''} disabled />
                </label>
                <label className="profile-field">
                    <span>Nickname</span>
                    <input
                        type="text"
                        value={profileNickname}
                        onChange={(event) => setProfileNickname(event.target.value)}
                        placeholder="Come ti piace essere chiamato"
                    />
                </label>
                <label className="profile-field">
                    <span>Paese</span>
                    <input
                        type="text"
                        value={profileCountry}
                        onChange={(event) => setProfileCountry(event.target.value)}
                        placeholder="Stato / Regione"
                    />
                </label>
                <label className="profile-field">
                    <span>Telefono</span>
                    <input
                        type="tel"
                        value={profilePhone}
                        onChange={(event) => setProfilePhone(event.target.value)}
                        placeholder="+39 333 123 4567"
                    />
                </label>
                {profileMessage && <div className="auth-message">{profileMessage}</div>}
                <div className="profile-actions">
                    <button type="submit" className="btn auth-button">
                        Salva profilo
                    </button>
                </div>
            </form>

            <section className="profile-section">
                <h3>Le tue moto</h3>
                <p>Aggiungi le informazioni base della tua moto per usarla nei tuoi track day.</p>
                <form className="profile-form" onSubmit={handleBikeSave}>
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
                    {bikeMessage && <div className="auth-message">{bikeMessage}</div>}
                    <div className="profile-actions">
                        <button type="submit" className="btn auth-button">
                            Salva moto
                        </button>
                    </div>
                </form>

                <div className="bike-list">
                    {bikes.length === 0 ? (
                        <p className="no-events">Nessuna moto salvata ancora.</p>
                    ) : (
                        bikes.map((bike) => (
                            <div className="event-card" key={bike.id}>
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
                                {bike.notes && <p>{bike.notes}</p>}
                            </div>
                        ))
                    )}
                </div>
            </section>
        </section>
    );
}

export default ProfilePage;
