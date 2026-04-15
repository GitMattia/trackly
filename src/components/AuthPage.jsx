function AuthPage({
    authView,
    setAuthView,
    authEmail,
    setAuthEmail,
    authPassword,
    setAuthPassword,
    authConfirmPassword,
    setAuthConfirmPassword,
    authFirstName,
    setAuthFirstName,
    authLastName,
    setAuthLastName,
    authError,
    authMessage,
    authLoading,
    authResetSuccess,
    handleLogin,
    handleSignup,
    handlePasswordReset,
    handleCompletePasswordReset,
}) {
    const isResetRequestView = authView === 'reset';
    const isRecoveryView = authView === 'resetPassword';
    const authRecoverySuccess = isRecoveryView && authResetSuccess;

    return (
        <div className="container auth-page">
            <div className="auth-card">
                <h1>Trackly</h1>
                <p className="auth-subtitle">
                    {isResetRequestView
                        ? 'Inserisci l\'email per ricevere il link di reset.'
                        : isRecoveryView
                        ? 'Imposta la nuova password per il tuo account.'
                        : 'Accedi o registrati per salvare le tue giornate in pista'}
                </p>
                {!isResetRequestView && !isRecoveryView && (
                    <div className="auth-toggle">
                        <button
                            type="button"
                            className={authView === 'login' ? 'active' : ''}
                            onClick={() => {
                                setAuthView('login');
                                setAuthError('');
                                setAuthMessage('');
                            }}
                        >
                            Accedi
                        </button>
                        <button
                            type="button"
                            className={authView === 'signup' ? 'active' : ''}
                            onClick={() => {
                                setAuthView('signup');
                                setAuthError('');
                                setAuthMessage('');
                            }}
                        >
                            Registrati
                        </button>
                    </div>
                )}
                <form
                    className="auth-form"
                    onSubmit={
                        isResetRequestView
                            ? handlePasswordReset
                            : isRecoveryView
                            ? handleCompletePasswordReset
                            : authView === 'login'
                            ? handleLogin
                            : handleSignup
                    }
                >
                    {authView === 'signup' && (
                        <>
                            <label className="auth-field">
                                <span>Nome</span>
                                <input
                                    type="text"
                                    value={authFirstName}
                                    onChange={(event) => setAuthFirstName(event.target.value)}
                                    placeholder="Nome"
                                    required
                                />
                            </label>
                            <label className="auth-field">
                                <span>Cognome</span>
                                <input
                                    type="text"
                                    value={authLastName}
                                    onChange={(event) => setAuthLastName(event.target.value)}
                                    placeholder="Cognome"
                                    required
                                />
                            </label>
                        </>
                    )}
                    {!isRecoveryView && (
                        <label className="auth-field">
                            <span>Email</span>
                            <input
                                type="email"
                                value={authEmail}
                                onChange={(event) => setAuthEmail(event.target.value)}
                                placeholder="esempio@mail.com"
                                required
                            />
                        </label>
                    )}
                    {authView !== 'reset' && !authRecoverySuccess && (
                        <label className="auth-field">
                            <span>{isRecoveryView ? 'Nuova password' : 'Password'}</span>
                            <input
                                type="password"
                                value={authPassword}
                                onChange={(event) => setAuthPassword(event.target.value)}
                                placeholder="Password"
                                required
                            />
                        </label>
                    )}
                    {isRecoveryView && !authRecoverySuccess && (
                        <label className="auth-field">
                            <span>Conferma password</span>
                            <input
                                type="password"
                                value={authConfirmPassword}
                                onChange={(event) => setAuthConfirmPassword(event.target.value)}
                                placeholder="Conferma password"
                                required
                            />
                        </label>
                    )}
                    {authError && <div className="auth-error">{authError}</div>}
                    {authMessage && <div className="auth-message">{authMessage}</div>}
                    {!authRecoverySuccess && (
                        <button type="submit" className="btn auth-button" disabled={authLoading}>
                            {authLoading
                                ? 'Caricamento...'
                                : isResetRequestView
                                ? 'Invia link'
                                : isRecoveryView
                                ? 'Aggiorna password'
                                : authView === 'login'
                                ? 'Accedi'
                                : 'Registrati'}
                        </button>
                    )}
                    <div className="auth-footer">
                        {authView === 'login' && (
                            <button
                                type="button"
                                className="auth-link"
                                onClick={() => {
                                    setAuthView('reset');
                                    setAuthError('');
                                    setAuthMessage('');
                                }}
                            >
                                Password dimenticata?
                            </button>
                        )}
                        {(isResetRequestView || isRecoveryView) && (
                            <button
                                type="button"
                                className="auth-link"
                                onClick={() => {
                                    setAuthView('login');
                                    setAuthError('');
                                    setAuthMessage('');
                                }}
                            >
                                Torna al login
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AuthPage;
