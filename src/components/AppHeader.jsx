function AppHeader({
    profile,
    user,
    profileMenuOpen,
    setProfileMenuOpen,
    handleLogout,
    navigateTo,
    onNewTrackDay,
    profileAvatarRef,
    profileMenuRef,
    setAuthView,
}) {
    return (
        <header>
            <h1
                className="home-link"
                role="button"
                tabIndex={0}
                onClick={() => {
                    navigateTo('calendar');
                    setProfileMenuOpen(false);
                }}
                onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        navigateTo('calendar');
                        setProfileMenuOpen(false);
                    }
                }}
            >
                Trackly
            </h1>
            <p className="subtitle">Calendario Trackday Moto</p>
            <div className="account-bar">
                {!user ? (
                    <button
                        type="button"
                        className="auth-button"
                        onClick={() => {
                            setAuthView('login');
                            navigateTo('auth');
                        }}
                    >
                        Accedi
                    </button>
                ) : (
                    <>
                        <button
                            className="avatar-button"
                            type="button"
                            onClick={() => setProfileMenuOpen((prev) => !prev)}
                            aria-label="Apri menu account"
                            ref={profileAvatarRef}
                        >
                            {profile?.full_name
                                ? (profile.full_name || '').trim().split(' ').slice(0, 2).map(name => name.charAt(0).toUpperCase()).join('')
                                : user.email.split('@')[0].slice(0, 2).toUpperCase()}
                        </button>
                        <div className={profileMenuOpen ? 'profile-menu open' : 'profile-menu'} ref={profileMenuRef}>
                            <button
                                type="button"
                                className="profile-menu-item"
                                onClick={() => {
                                    navigateTo('profile');
                                    setProfileMenuOpen(false);
                                }}
                            >
                                Profilo
                            </button>
                            <button
                                type="button"
                                className="profile-menu-item"
                                onClick={() => {
                                    onNewTrackDay();
                                    setProfileMenuOpen(false);
                                }}
                            >
                                Nuova giornata
                            </button>
                            <button
                                type="button"
                                className="profile-menu-item"
                                onClick={() => {
                                    navigateTo('trackhistory');
                                    setProfileMenuOpen(false);
                                }}
                            >
                                Le mie giornate
                            </button>
                            <button
                                type="button"
                                className="profile-menu-item"
                                onClick={() => {
                                    setProfileMenuOpen(false);
                                    handleLogout();
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    </>
                )}
            </div>
        </header>
    );
}

export default AppHeader;
