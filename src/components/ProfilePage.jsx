function ProfilePage({
    profile,
    profileFirstName,
    profileLastName,
    profileNickname,
    profileCountry,
    profilePhone,
    profileMessage,
    setProfileFirstName,
    setProfileLastName,
    setProfileNickname,
    setProfileCountry,
    setProfilePhone,
    handleProfileSave,
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
        </section>
    );
}

export default ProfilePage;
