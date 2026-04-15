function AppHeader({
    profile,
    user,
    profileMenuOpen,
    setProfileMenuOpen,
    handleLogout,
    setActivePage,
    profileAvatarRef,
    profileMenuRef,
}) {
    return (
        <header>
            <h1
                className="home-link"
                role="button"
                tabIndex={0}
                onClick={() => {
                    setActivePage('calendar');
                    setProfileMenuOpen(false);
                }}
                onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        setActivePage('calendar');
                        setProfileMenuOpen(false);
                    }
                }}
            >
                Trackly
            </h1>
            <p className="subtitle">Calendario Trackday Moto</p>
            <div className="account-bar">
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
                            setActivePage('profile');
                            setProfileMenuOpen(false);
                        }}
                    >
                        Profilo
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
            </div>
        </header>
    );
}

export default AppHeader;
