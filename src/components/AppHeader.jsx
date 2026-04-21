import { useState } from 'react';

function AppHeader({
    profile,
    user,
    activePage,
    profileMenuOpen,
    setProfileMenuOpen,
    handleLogout,
    navigateTo,
    onNewTrackDay,
    profileAvatarRef,
    profileMenuRef,
    setAuthView,
}) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const initials = profile?.full_name
        ? (profile.full_name || '').trim().split(' ').slice(0, 2).map(name => name.charAt(0).toUpperCase()).join('')
        : user?.email?.split('@')[0].slice(0, 2).toUpperCase() || '';

    const handleNav = (action) => {
        action();
        setProfileMenuOpen(false);
        setMobileMenuOpen(false);
    };

    return (
        <>
        <header>
            <h1
                className="home-link"
                role="button"
                tabIndex={0}
                onClick={() => {
                    navigateTo('calendar');
                    setProfileMenuOpen(false);
                    setMobileMenuOpen(false);
                }}
                onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        navigateTo('calendar');
                        setProfileMenuOpen(false);
                        setMobileMenuOpen(false);
                    }
                }}
            >
                Trackly
            </h1>
            <p className="subtitle">Calendario Trackday Moto</p>

            {user ? (
                <nav className="main-nav">
                    <div className="nav-links">
                        <button
                            type="button"
                            className={`nav-item${activePage === 'calendar' ? ' nav-item-active' : ''}`}
                            onClick={() => handleNav(() => navigateTo('calendar'))}
                        >
                            <span className="nav-icon">📅</span>
                            <span className="nav-label">Calendario</span>
                        </button>
                        <button
                            type="button"
                            className={`nav-item${activePage === 'trackhistory' || activePage === 'trackdaydetails' ? ' nav-item-active' : ''}`}
                            onClick={() => handleNav(() => navigateTo('trackhistory'))}
                        >
                            <span className="nav-icon">📋</span>
                            <span className="nav-label">Giornate</span>
                        </button>
                        <button
                            type="button"
                            className={`nav-item${activePage === 'bikes' ? ' nav-item-active' : ''}`}
                            onClick={() => handleNav(() => navigateTo('bikes'))}
                        >
                            <span className="nav-icon">🏍️</span>
                            <span className="nav-label">Moto</span>
                        </button>
                        <button
                            type="button"
                            className="nav-item nav-item-cta"
                            onClick={() => handleNav(() => onNewTrackDay())}
                        >
                            <span className="nav-icon">＋</span>
                            <span className="nav-label">Nuova giornata</span>
                        </button>
                    </div>
                    <div className="nav-account nav-account-desktop">
                        <button
                            className="avatar-button"
                            type="button"
                            onClick={() => setProfileMenuOpen((prev) => !prev)}
                            aria-label="Apri menu account"
                            ref={profileAvatarRef}
                        >
                            {initials}
                        </button>
                    </div>
                    <button
                        type="button"
                        className="hamburger-btn"
                        onClick={() => setMobileMenuOpen((prev) => !prev)}
                        aria-label="Apri menu"
                    >
                        <span className={`hamburger-icon${mobileMenuOpen ? ' hamburger-open' : ''}`}>
                            <span />
                            <span />
                            <span />
                        </span>
                    </button>
                </nav>
            ) : (
                <div className="account-bar">
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
                </div>
            )}
        </header>
        {user && (
            <div className={`mobile-menu${mobileMenuOpen ? ' mobile-menu-open' : ''}`}>
                <button
                    type="button"
                    className={`mobile-menu-item${activePage === 'calendar' ? ' mobile-menu-item-active' : ''}`}
                    onClick={() => handleNav(() => navigateTo('calendar'))}
                >
                    <span className="nav-icon">📅</span> Calendario
                </button>
                <button
                    type="button"
                    className={`mobile-menu-item${activePage === 'trackhistory' || activePage === 'trackdaydetails' ? ' mobile-menu-item-active' : ''}`}
                    onClick={() => handleNav(() => navigateTo('trackhistory'))}
                >
                    <span className="nav-icon">📋</span> Le mie giornate
                </button>
                <button
                    type="button"
                    className={`mobile-menu-item${activePage === 'bikes' ? ' mobile-menu-item-active' : ''}`}
                    onClick={() => handleNav(() => navigateTo('bikes'))}
                >
                    <span className="nav-icon">🏍️</span> Le mie moto
                </button>
                <button
                    type="button"
                    className="mobile-menu-item mobile-menu-item-cta"
                    onClick={() => handleNav(() => onNewTrackDay())}
                >
                    <span className="nav-icon">＋</span> Nuova giornata
                </button>
                <hr className="mobile-menu-divider" />
                <button
                    type="button"
                    className={`mobile-menu-item${activePage === 'profile' ? ' mobile-menu-item-active' : ''}`}
                    onClick={() => handleNav(() => navigateTo('profile'))}
                >
                    Profilo
                </button>
                <button
                    type="button"
                    className="mobile-menu-item mobile-menu-item-logout"
                    onClick={() => handleNav(() => handleLogout())}
                >
                    Logout
                </button>
            </div>
        )}
        {user && (
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
                    className="profile-menu-item profile-menu-logout"
                    onClick={() => {
                        setProfileMenuOpen(false);
                        handleLogout();
                    }}
                >
                    Logout
                </button>
            </div>
        )}
        </>
    );
}

export default AppHeader;
