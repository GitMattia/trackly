import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from './lib/supabaseClient.js';
import { fetchEvents } from './lib/events.js';
import AppHeader from './components/AppHeader.jsx';
import AuthPage from './components/AuthPage.jsx';
import ProfilePage from './components/ProfilePage.jsx';
import BikesPage from './components/BikesPage.jsx';
import TrackLogPage from './components/TrackLogPage.jsx';
import TrackHistoryPage from './components/TrackHistoryPage.jsx';
import TrackDayDetailsPage from './components/TrackDayDetailsPage.jsx';
import CalendarPage from './components/CalendarPage.jsx';
import { formatDate, formatDateItalian, formatLapTime, monthNames, parseLapTime } from './lib/utils.js';

const validPages = ['calendar', 'auth', 'profile', 'bikes', 'tracklog', 'trackhistory', 'trackdaydetails'];

function getPageFromHash() {
    const hash = window.location.hash.replace('#', '');
    return validPages.includes(hash) ? hash : 'calendar';
}

const organizerLinks = {
    Motorace: 'https://www.motoracepeople.com/about',
    'Gully Racing': 'https://www.gullyracing.it/calendario',
    Promoracing: 'https://www.promoracing.it/it/calendario/moto',
    Rossocorsa: 'https://www.rossocorsaonline.com/prove',
    'Prove Libere Moto': 'https://www.proveliberemoto.it/it/28-calendario',
    'Portami In Pista': 'https://www.portamiinpista.it/Blog/trackdays',
};

function App() {
    const initialDate = new Date();
    initialDate.setDate(1);

    function createEmptyTrackSessions() {
        return Array.from({ length: 6 }, (_, index) => ({
            turn: index + 1,
            tyre_front: '',
            tyre_rear: '',
            pressure_front: '',
            pressure_rear: '',
            fork_compression: '',
            fork_rebound: '',
            fork_preload: '',
            mono_compression: '',
            mono_rebound: '',
            mono_preload: '',
            gearing: '',
            fuel_load: '',
            lap_time: '',
            notes: '',
        }));
    }

    const [user, setUser] = useState(null);
    const [authView, setAuthView] = useState('login');
    const [authEmail, setAuthEmail] = useState('');
    const [authPassword, setAuthPassword] = useState('');
    const [authFirstName, setAuthFirstName] = useState('');
    const [authLastName, setAuthLastName] = useState('');
    const [authError, setAuthError] = useState('');
    const [authMessage, setAuthMessage] = useState('');
    const [authResetSuccess, setAuthResetSuccess] = useState(false);
    const [authLoading, setAuthLoading] = useState(false);
    const [authConfirmPassword, setAuthConfirmPassword] = useState('');

    const [profile, setProfile] = useState(null);
    const [profileFirstName, setProfileFirstName] = useState('');
    const [profileLastName, setProfileLastName] = useState('');
    const [profileNickname, setProfileNickname] = useState('');
    const [profileCountry, setProfileCountry] = useState('');
    const [profilePhone, setProfilePhone] = useState('');
    const [profileMessage, setProfileMessage] = useState('');
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [activePage, setActivePage] = useState(getPageFromHash);

    const [bikes, setBikes] = useState([]);
    const [bikeName, setBikeName] = useState('');
    const [bikeManufacturer, setBikeManufacturer] = useState('');
    const [bikeModel, setBikeModel] = useState('');
    const [bikeYear, setBikeYear] = useState('');
    const [bikeCategory, setBikeCategory] = useState('');
    const [bikeNotes, setBikeNotes] = useState('');
    const [bikeFrontTyreKm, setBikeFrontTyreKm] = useState('');
    const [bikeRearTyreKm, setBikeRearTyreKm] = useState('');
    const [bikeOilKm, setBikeOilKm] = useState('');
    const [bikeBrakePadsKm, setBikeBrakePadsKm] = useState('');
    const [bikeMessage, setBikeMessage] = useState('');
    const [editingBikeId, setEditingBikeId] = useState(null);

    const [trackDays, setTrackDays] = useState([]);
    const [selectedTrackDay, setSelectedTrackDay] = useState(null);
    const [editingTrackDay, setEditingTrackDay] = useState(null);
    const [trackDate, setTrackDate] = useState(formatDate(new Date()));
    const [trackCircuitName, setTrackCircuitName] = useState('');
    const [trackBikeId, setTrackBikeId] = useState('');
    const [trackWeather, setTrackWeather] = useState('');
    const [trackBestLapTime, setTrackBestLapTime] = useState('');
    const [trackAverageLapTime, setTrackAverageLapTime] = useState('');
    const [trackNotes, setTrackNotes] = useState('');
    const [trackSessions, setTrackSessions] = useState(createEmptyTrackSessions());
    const [trackMessage, setTrackMessage] = useState('');
    const [currentTrackDayId, setCurrentTrackDayId] = useState(null);

    const [currentDate, setCurrentDate] = useState(initialDate);
    const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
    const [selectedFilters, setSelectedFilters] = useState({
        circuits: [],
        organizers: [],
    });
    const [openMenu, setOpenMenu] = useState(null);
    const [events, setEvents] = useState([]);

    const circuitMenuRef = useRef(null);
    const organizerMenuRef = useRef(null);
    const profileAvatarRef = useRef(null);
    const sessionLoadedRef = useRef(false);

    const navigateTo = useCallback((page) => {
        setActivePage(page);
        window.history.pushState({ page }, '', `#${page}`);
    }, []);

    useEffect(() => {
        // Set initial hash if not present
        if (!window.location.hash) {
            window.history.replaceState({ page: activePage }, '', `#${activePage}`);
        }

        function handlePopState(event) {
            const page = event.state?.page || getPageFromHash();
            setActivePage(page);
        }

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);
    const profileMenuRef = useRef(null);
    const calendarWrapperRef = useRef(null);

    const circuits = useMemo(() => {
        return [...new Set(events.map((event) => event.circuit))].sort((a, b) => a.localeCompare(b, 'it'));
    }, [events]);

    const organizers = useMemo(() => {
        return [...new Set(events.map((event) => event.organizer))].sort((a, b) => a.localeCompare(b, 'it'));
    }, [events]);

    const filteredEvents = useMemo(() => {
        return events.filter((event) => {
            const circuitMatch = selectedFilters.circuits.length === 0 || selectedFilters.circuits.includes(event.circuit);
            const organizerMatch = selectedFilters.organizers.length === 0 || selectedFilters.organizers.includes(event.organizer);
            return circuitMatch && organizerMatch;
        });
    }, [events, selectedFilters]);

    useEffect(() => {
        function handleDocumentClick(event) {
            if (
                circuitMenuRef.current?.contains(event.target) ||
                organizerMenuRef.current?.contains(event.target) ||
                profileMenuRef.current?.contains(event.target) ||
                profileAvatarRef.current?.contains(event.target)
            ) {
                return;
            }

            setOpenMenu(null);
            setProfileMenuOpen(false);
        }

        document.addEventListener('click', handleDocumentClick);
        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, []);

    useEffect(() => {
        async function loadEvents() {
            try {
                const { data, error } = await fetchEvents();
                if (error || !data) {
                    console.error('Impossibile caricare gli eventi da Supabase.', error);
                    setEvents([]);
                    return;
                }

                setEvents(data);
            } catch (error) {
                console.error('Errore caricamento eventi Supabase', error);
                setEvents([]);
            }
        }

        loadEvents();
    }, []);

    function triggerCalendarActionAnimation() {
        if (!calendarWrapperRef.current) {
            return;
        }

        calendarWrapperRef.current.classList.remove('action-boost');
        void calendarWrapperRef.current.offsetWidth;
        calendarWrapperRef.current.classList.add('action-boost');
    }

    async function handleLogin(event) {
        event.preventDefault();
        setAuthError('');
        setAuthMessage('');
        setAuthLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email: authEmail,
            password: authPassword,
        });

        setAuthLoading(false);

        if (error) {
            setAuthError(error.message);
            return;
        }

        setAuthEmail('');
        setAuthPassword('');
    }

    async function handlePasswordReset(event) {
        event.preventDefault();
        setAuthError('');
        setAuthMessage('');
        setAuthResetSuccess(false);
        setAuthLoading(true);

        const redirectTo = new URL(import.meta.env.BASE_URL || '/', window.location.origin).toString();
        const { error } = await supabase.auth.resetPasswordForEmail(authEmail, {
            redirectTo,
        });

        setAuthLoading(false);

        if (error) {
            setAuthError(error.message);
            return;
        }

        setAuthMessage('Se l\'indirizzo esiste, riceverai una mail per reimpostare la password.');
    }

    async function handleCompletePasswordReset(event) {
        event.preventDefault();
        setAuthError('');
        setAuthMessage('');
        setAuthResetSuccess(false);

        if (authPassword !== authConfirmPassword) {
            setAuthError('Le password non corrispondono.');
            return;
        }

        setAuthLoading(true);
        const { error } = await supabase.auth.updateUser({ password: authPassword });
        setAuthLoading(false);

        if (error) {
            setAuthError(error.message);
            return;
        }

        setAuthPassword('');
        setAuthConfirmPassword('');
        setAuthMessage('Password aggiornata con successo. Puoi ora effettuare il login con la nuova password.');
        setAuthResetSuccess(true);
    }

    async function handleSignup(event) {
        event.preventDefault();
        setAuthError('');
        setAuthMessage('');
        setAuthLoading(true);

        const { data, error } = await supabase.auth.signUp({
            email: authEmail,
            password: authPassword,
        });

        setAuthLoading(false);

        if (error) {
            setAuthError(error.message);
            return;
        }

        if (data.user) {
            const fullName = [authFirstName, authLastName].filter(Boolean).join(' ').trim() || null;
            await supabase.from('profiles').upsert({
                id: data.user.id,
                email: data.user.email,
                full_name: fullName,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            });
        }

        setAuthEmail('');
        setAuthPassword('');
        setAuthFirstName('');
        setAuthLastName('');
        setAuthView('login');
        setAuthMessage('Registrazione completata! Accedi per iniziare a usare Trackly.');
    }

    async function handleLogout() {
        await supabase.auth.signOut();
        setUser(null);
        setAuthView('login');
        setAuthEmail('');
        setAuthPassword('');
        setAuthConfirmPassword('');
        setAuthError('');
        setAuthMessage('');
        setAuthResetSuccess(false);
        setBikes([]);
        setTrackDays([]);
        setTrackSessions(createEmptyTrackSessions());
        navigateTo('calendar');
    }

    async function handleBikeSave(event) {
        event.preventDefault();
        setBikeMessage('');

        if (!bikeName.trim()) {
            setBikeMessage('Inserisci almeno il nome della moto.');
            return false;
        }

        const bikePayload = {
            user_id: user.id,
            name: bikeName.trim(),
            manufacturer: bikeManufacturer.trim() || null,
            model: bikeModel.trim() || null,
            year: bikeYear ? Number(bikeYear) : null,
            category: bikeCategory.trim() || null,
            notes: bikeNotes.trim() || null,
            front_tyre_km: bikeFrontTyreKm ? Number(bikeFrontTyreKm) : null,
            rear_tyre_km: bikeRearTyreKm ? Number(bikeRearTyreKm) : null,
            oil_km: bikeOilKm ? Number(bikeOilKm) : null,
            brake_pads_km: bikeBrakePadsKm ? Number(bikeBrakePadsKm) : null,
        };

        let error;
        if (editingBikeId) {
            ({ error } = await supabase.from('user_bikes').update(bikePayload).eq('id', editingBikeId));
        } else {
            ({ error } = await supabase.from('user_bikes').insert([bikePayload]));
        }

        if (error) {
            setBikeMessage(error.message);
            return false;
        }

        setBikeMessage(editingBikeId ? 'Moto aggiornata correttamente.' : 'Moto salvata correttamente.');
        clearBikeForm();
        const { data } = await supabase
            .from('user_bikes')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
        setBikes(data || []);
    }

    function clearBikeForm() {
        setEditingBikeId(null);
        setBikeName('');
        setBikeManufacturer('');
        setBikeModel('');
        setBikeYear('');
        setBikeCategory('');
        setBikeNotes('');
        setBikeFrontTyreKm('');
        setBikeRearTyreKm('');
        setBikeOilKm('');
        setBikeBrakePadsKm('');
        setBikeMessage('');
    }

    function handleEditBike(bike) {
        setEditingBikeId(bike.id);
        setBikeName(bike.name || '');
        setBikeManufacturer(bike.manufacturer || '');
        setBikeModel(bike.model || '');
        setBikeYear(bike.year ? String(bike.year) : '');
        setBikeCategory(bike.category || '');
        setBikeNotes(bike.notes || '');
        setBikeFrontTyreKm(bike.front_tyre_km ? String(bike.front_tyre_km) : '');
        setBikeRearTyreKm(bike.rear_tyre_km ? String(bike.rear_tyre_km) : '');
        setBikeOilKm(bike.oil_km ? String(bike.oil_km) : '');
        setBikeBrakePadsKm(bike.brake_pads_km ? String(bike.brake_pads_km) : '');
        setBikeMessage('');
    }

    function handleTrackSessionChange(index, field, value) {
        setTrackSessions((prevSessions) =>
            prevSessions.map((session, sessionIndex) =>
                sessionIndex === index ? { ...session, [field]: value } : session
            )
        );
    }

    async function saveTrackDayDetails() {
        if (!trackDate || !trackCircuitName.trim() || !trackBikeId) {
            setTrackMessage('Data, circuito e moto sono campi obbligatori.');
            return null;
        }

        // Check for duplicate date (exclude current track day when editing)
        const { data: existing } = await supabase
            .from('track_days')
            .select('id')
            .eq('user_id', user.id)
            .eq('date', trackDate)
            .limit(1);

        const isDuplicate = existing?.some((row) => row.id !== currentTrackDayId);
        if (isDuplicate) {
            setTrackMessage('Esiste già una giornata registrata per questa data.');
            return null;
        }

        const selectedBike = bikes.find((bike) => bike.id === trackBikeId);
        const dayPayload = {
            user_id: user.id,
            date: trackDate,
            circuit_name: trackCircuitName.trim(),
            bike_id: trackBikeId,
            bike_name: selectedBike?.name || '',
            weather: trackWeather.trim() || null,
            best_lap_time: parseLapTime(trackBestLapTime),
            average_lap_time: parseLapTime(trackAverageLapTime),
            notes: trackNotes.trim() || null,
        };

        if (currentTrackDayId) {
            const { error } = await supabase.from('track_days').update(dayPayload).eq('id', currentTrackDayId);
            if (error) {
                setTrackMessage(error.message);
                return null;
            }
            return currentTrackDayId;
        }

        const { data: insertedDays, error: dayError } = await supabase
            .from('track_days')
            .insert([dayPayload])
            .select('id');

        if (dayError || !insertedDays || insertedDays.length === 0) {
            setTrackMessage(dayError?.message || 'Errore salvataggio giornata.');
            return null;
        }

        const newTrackDayId = insertedDays[0].id;
        setCurrentTrackDayId(newTrackDayId);
        return newTrackDayId;
    }

    function turnHasData(session) {
        return (
            !!session.tyre_front ||
            !!session.tyre_rear ||
            !!session.pressure_front ||
            !!session.pressure_rear ||
            !!session.fork_compression ||
            !!session.fork_rebound ||
            !!session.fork_preload ||
            !!session.mono_compression ||
            !!session.mono_rebound ||
            !!session.mono_preload ||
            !!session.gearing ||
            !!session.fuel_load ||
            !!session.lap_time ||
            !!session.notes
        );
    }

    async function saveTrackTurn(index, session) {
        if (!session) return null;
        if (!turnHasData(session)) {
            return true;
        }

        const trackDayId = currentTrackDayId || (await saveTrackDayDetails());
        if (!trackDayId) return null;

        const turnPayload = {
            track_day_id: trackDayId,
            turn_number: session.turn,
            tyre_front: session.tyre_front || null,
            tyre_rear: session.tyre_rear || null,
            pressure_front: session.pressure_front || null,
            pressure_rear: session.pressure_rear || null,
            fork_compression: session.fork_compression || null,
            fork_rebound: session.fork_rebound || null,
            fork_preload: session.fork_preload || null,
            mono_compression: session.mono_compression || null,
            mono_rebound: session.mono_rebound || null,
            mono_preload: session.mono_preload || null,
            gearing: session.gearing || null,
            fuel_load: session.fuel_load || null,
            lap_time: parseLapTime(session.lap_time),
            notes: session.notes || null,
        };

        const { error } = await supabase
            .from('track_day_turns')
            .upsert([turnPayload], { onConflict: 'track_day_id,turn_number' });

        if (error) {
            setTrackMessage(error.message);
            return null;
        }

        return true;
    }

    async function handleTrackDaySave(event) {
        event.preventDefault();
        setTrackMessage('');

        const trackDayId = await saveTrackDayDetails();
        if (!trackDayId) {
            return;
        }

        const turnsToInsert = trackSessions
            .filter((session) => turnHasData(session))
            .map((session) => ({
                track_day_id: trackDayId,
                turn_number: session.turn,
                tyre_front: session.tyre_front || null,
                tyre_rear: session.tyre_rear || null,
                pressure_front: session.pressure_front || null,
                pressure_rear: session.pressure_rear || null,
                fork_compression: session.fork_compression || null,
                fork_rebound: session.fork_rebound || null,
                fork_preload: session.fork_preload || null,
                mono_compression: session.mono_compression || null,
                mono_rebound: session.mono_rebound || null,
                mono_preload: session.mono_preload || null,
                gearing: session.gearing || null,
                fuel_load: session.fuel_load || null,
                lap_time: parseLapTime(session.lap_time),
                notes: session.notes || null,
            }));

        const { error: turnError } = await supabase
            .from('track_day_turns')
            .upsert(turnsToInsert, { onConflict: 'track_day_id,turn_number' });

        if (turnError) {
            setTrackMessage(turnError.message);
            return;
        }

        setTrackMessage(editingTrackDay ? 'Giornata in pista aggiornata con successo.' : 'Giornata in pista registrata con successo.');
        setCurrentTrackDayId(null);
        setEditingTrackDay(null);
        setTrackDate(formatDate(new Date()));
        setTrackCircuitName('');
        setTrackBikeId('');
        setTrackWeather('');
        setTrackBestLapTime('');
        setTrackAverageLapTime('');
        setTrackNotes('');
        setTrackSessions(createEmptyTrackSessions());

        await loadTrackDays();
        navigateTo('trackhistory');
    }

    useEffect(() => {
        async function getSession() {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
        }

        getSession().then(() => { sessionLoadedRef.current = true; });

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            const newUser = session?.user ?? null;
            setUser(newUser);
            if (newUser && event === 'SIGNED_IN' && !sessionLoadedRef.current) {
                navigateTo('calendar');
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        async function handleAuthRedirect() {
            const url = new URL(window.location.href);
            const searchParams = url.searchParams;
            const hash = url.hash.startsWith('#') ? url.hash.slice(1) : url.hash;
            const hashParams = new URLSearchParams(hash.startsWith('?') ? hash.slice(1) : hash);

            const errorDescription =
                searchParams.get('error_description') ||
                hashParams.get('error_description') ||
                searchParams.get('error') ||
                hashParams.get('error');

            if (errorDescription) {
                setAuthView('login');
                setAuthError(decodeURIComponent(errorDescription.replace(/\+/g, ' ')));
            }

            const type = searchParams.get('type') || hashParams.get('type');
            if (type === 'recovery') {
                setAuthView('resetPassword');

                const { data, error } = await supabase.auth.getSessionFromUrl();
                if (error) {
                    setAuthError(error.message);
                    return;
                }

                if (data?.session?.user) {
                    setUser(data.session.user);
                }
            }
        }

        handleAuthRedirect();
    }, []);

    useEffect(() => {
        if (!user) {
            setProfile(null);
            if (sessionLoadedRef.current) {
                navigateTo('calendar');
            }
            setProfileMenuOpen(false);
            setBikes([]);
            setTrackDays([]);
            return;
        }

        async function loadProfile() {
            const { data, error } = await supabase
                .from('profiles')
                .select('email, full_name, nickname, country, phone')
                .eq('id', user.id)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('Profile fetch error', error);
                return;
            }

            const profileData = data || { email: user.email };
            if (!profileData.email) {
                profileData.email = user.email;
            }
            setProfile(profileData);

            const nameParts = (profileData.full_name ?? '').trim().split(/\s+/);
            setProfileFirstName(nameParts[0] ?? '');
            setProfileLastName(nameParts.slice(1).join(' ') ?? '');
            setProfileNickname(profileData.nickname || '');
            setProfileCountry(profileData.country || '');
            setProfilePhone(profileData.phone || '');
            setProfileMenuOpen(false);
        }

        async function loadUserBikes() {
            const { data, error } = await supabase
                .from('user_bikes')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Bike fetch error', error);
                setBikes([]);
                return;
            }

            setBikes(data || []);
        }

        async function loadUserData() {
            if (!user) return;
            await loadProfile();
            await loadUserBikes();
            await loadTrackDays();
        }

        loadUserData();
    }, [user]);

    async function loadTrackDays() {
        if (!user) return;

        const { data, error } = await supabase
            .from('track_days')
            .select('*, track_day_turns(*)')
            .eq('user_id', user.id)
            .order('date', { ascending: false });

        if (error) {
            console.error('Track day fetch error', error);
            setTrackDays([]);
            return;
        }

        setTrackDays(data || []);
    }

    async function handleDeleteTrackDay(dayId) {
        const { error } = await supabase
            .from('track_days')
            .delete()
            .eq('id', dayId);

        if (error) {
            console.error('Errore eliminazione giornata', error);
            return;
        }

        await loadTrackDays();
    }

    function populateTrackFieldsFromDay(day) {
        setTrackDate(day.date);
        setTrackCircuitName(day.circuit_name);
        setTrackBikeId(day.bike_id);
        setTrackWeather(day.weather || '');
        setTrackBestLapTime(day.best_lap_time ? formatLapTime(day.best_lap_time) : '');
        setTrackAverageLapTime(day.average_lap_time ? formatLapTime(day.average_lap_time) : '');
        setTrackNotes(day.notes || '');
        setCurrentTrackDayId(day.id);

        // Populate turns
        const turns = day.track_day_turns || [];
        const populatedSessions = createEmptyTrackSessions().map((session, index) => {
            const turn = turns.find(t => t.turn_number === session.turn);
            if (turn) {
                return {
                    ...session,
                    tyre_front: turn.tyre_front || '',
                    tyre_rear: turn.tyre_rear || '',
                    pressure_front: turn.pressure_front || '',
                    pressure_rear: turn.pressure_rear || '',
                    fork_compression: turn.fork_compression || '',
                    fork_rebound: turn.fork_rebound || '',
                    fork_preload: turn.fork_preload || '',
                    mono_compression: turn.mono_compression || '',
                    mono_rebound: turn.mono_rebound || '',
                    mono_preload: turn.mono_preload || '',
                    gearing: turn.gearing || '',
                    fuel_load: turn.fuel_load || '',
                    lap_time: turn.lap_time ? formatLapTime(turn.lap_time) : '',
                    notes: turn.notes || '',
                };
            }
            return session;
        });
        setTrackSessions(populatedSessions);
    }

    async function handleProfileSave(event) {
        event.preventDefault();
        setProfileMessage('');

        const fullName = [profileFirstName, profileLastName].filter(Boolean).join(' ').trim() || null;
        const updates = {
            id: user.id,
            email: user.email,
            full_name: fullName,
            nickname: profileNickname || null,
            country: profileCountry || null,
            phone: profilePhone || null,
            updated_at: new Date().toISOString(),
        };

        const { error } = await supabase.from('profiles').upsert(updates);

        if (error) {
            setProfileMessage(error.message);
            return;
        }

        setProfile(updates);
        setProfileMessage('Profilo aggiornato con successo.');
    }

    function changeMonth(direction) {
        setCurrentDate((prevDate) => {
            const nextDate = new Date(prevDate);
            nextDate.setDate(1);
            nextDate.setMonth(nextDate.getMonth() + direction);
            return nextDate;
        });
        triggerCalendarActionAnimation();
    }

    function toggleFilterValue(filterKey, value) {
        setSelectedFilters((prevFilters) => {
            const nextValues = prevFilters[filterKey].includes(value)
                ? prevFilters[filterKey].filter((item) => item !== value)
                : [...prevFilters[filterKey], value];

            return {
                ...prevFilters,
                [filterKey]: nextValues,
            };
        });
        triggerCalendarActionAnimation();
    }

    function clearFilter(filterKey) {
        setSelectedFilters((prevFilters) => ({
            ...prevFilters,
            [filterKey]: [],
        }));
        triggerCalendarActionAnimation();
    }

    function getEventsForDate(dateStr) {
        return filteredEvents.filter((event) => event.date === dateStr);
    }

    const today = formatDate(new Date());
    const currentMonthLabel = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

    const calendarDays = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const prevLastDay = new Date(year, month, 0);

        const firstDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
        const lastDateOfMonth = lastDay.getDate();
        const lastDateOfPrevMonth = prevLastDay.getDate();

        const days = [];

        for (let index = firstDayOfWeek - 1; index >= 0; index -= 1) {
            days.push({
                key: `prev-${index}`,
                type: 'other-month',
                label: lastDateOfPrevMonth - index,
            });
        }

        for (let day = 1; day <= lastDateOfMonth; day += 1) {
            const date = new Date(year, month, day);
            const dateStr = formatDate(date);
            const dayEvents = getEventsForDate(dateStr);
            const uniqueCircuits = [...new Set(dayEvents.map((event) => event.circuit))];

            days.push({
                key: dateStr,
                type: 'current-month',
                label: day,
                dateStr,
                isToday: dateStr === today,
                isSelected: selectedDate === dateStr,
                titleText: dayEvents.length > 0
                    ? dayEvents.map((event) => `${event.title} - ${event.circuit}`).join(' | ')
                    : '',
                circuits: uniqueCircuits,
                eventCount: dayEvents.length,
            });
        }

        const remainingDays = 42 - (firstDayOfWeek + lastDateOfMonth);
        for (let day = 1; day <= remainingDays; day += 1) {
            days.push({
                key: `next-${day}`,
                type: 'other-month',
                label: day,
            });
        }

        return days;
    }, [currentDate, filteredEvents, selectedDate, today]);

    const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];
    const eventsTitle = selectedDate ? `Eventi - ${formatDateItalian(selectedDate)}` : 'Eventi';

    function handleNewTrackDay() {
        setTrackMessage('');
        setCurrentTrackDayId(null);
        setEditingTrackDay(null);
        setTrackDate(formatDate(new Date()));
        setTrackCircuitName('');
        setTrackBikeId('');
        setTrackWeather('');
        setTrackBestLapTime('');
        setTrackAverageLapTime('');
        setTrackNotes('');
        setTrackSessions(createEmptyTrackSessions());
        navigateTo('tracklog');
    }

    return (
        <div className="container">
            <AppHeader
                profile={profile}
                user={user}
                activePage={activePage}
                profileMenuOpen={profileMenuOpen}
                setProfileMenuOpen={setProfileMenuOpen}
                handleLogout={handleLogout}
                navigateTo={navigateTo}
                onNewTrackDay={handleNewTrackDay}
                profileAvatarRef={profileAvatarRef}
                profileMenuRef={profileMenuRef}
                setAuthView={setAuthView}
            />
            {!user && activePage === 'auth' ? (
                <section className="auth-page-wrapper">
                    <AuthPage
                        authView={authView}
                        setAuthView={setAuthView}
                        authEmail={authEmail}
                        setAuthEmail={setAuthEmail}
                        authPassword={authPassword}
                        setAuthPassword={setAuthPassword}
                        authConfirmPassword={authConfirmPassword}
                        setAuthConfirmPassword={setAuthConfirmPassword}
                        authFirstName={authFirstName}
                        setAuthFirstName={setAuthFirstName}
                        authLastName={authLastName}
                        setAuthLastName={setAuthLastName}
                        authError={authError}
                        authMessage={authMessage}
                        authLoading={authLoading}
                        authResetSuccess={authResetSuccess}
                        handleLogin={handleLogin}
                        handleSignup={handleSignup}
                        handlePasswordReset={handlePasswordReset}
                        handleCompletePasswordReset={handleCompletePasswordReset}
                    />
                </section>
            ) : user && activePage === 'profile' ? (
                <ProfilePage
                    profile={profile}
                    profileFirstName={profileFirstName}
                    setProfileFirstName={setProfileFirstName}
                    profileLastName={profileLastName}
                    setProfileLastName={setProfileLastName}
                    profileNickname={profileNickname}
                    setProfileNickname={setProfileNickname}
                    profileCountry={profileCountry}
                    setProfileCountry={setProfileCountry}
                    profilePhone={profilePhone}
                    setProfilePhone={setProfilePhone}
                    profileMessage={profileMessage}
                    handleProfileSave={handleProfileSave}
                />
            ) : user && activePage === 'bikes' ? (
                <BikesPage
                    bikes={bikes}
                    bikeName={bikeName}
                    setBikeName={setBikeName}
                    bikeManufacturer={bikeManufacturer}
                    setBikeManufacturer={setBikeManufacturer}
                    bikeModel={bikeModel}
                    setBikeModel={setBikeModel}
                    bikeYear={bikeYear}
                    setBikeYear={setBikeYear}
                    bikeCategory={bikeCategory}
                    setBikeCategory={setBikeCategory}
                    bikeNotes={bikeNotes}
                    setBikeNotes={setBikeNotes}
                    bikeFrontTyreKm={bikeFrontTyreKm}
                    setBikeFrontTyreKm={setBikeFrontTyreKm}
                    bikeRearTyreKm={bikeRearTyreKm}
                    setBikeRearTyreKm={setBikeRearTyreKm}
                    bikeOilKm={bikeOilKm}
                    setBikeOilKm={setBikeOilKm}
                    bikeBrakePadsKm={bikeBrakePadsKm}
                    setBikeBrakePadsKm={setBikeBrakePadsKm}
                    bikeMessage={bikeMessage}
                    handleBikeSave={handleBikeSave}
                    editingBikeId={editingBikeId}
                    onEditBike={handleEditBike}
                    onCancelEditBike={clearBikeForm}
                />
            ) : user && activePage === 'tracklog' ? (
                <TrackLogPage
                    bikes={bikes}
                    circuits={circuits}
                    trackDate={trackDate}
                    setTrackDate={setTrackDate}
                    trackCircuitName={trackCircuitName}
                    setTrackCircuitName={setTrackCircuitName}
                    trackBikeId={trackBikeId}
                    setTrackBikeId={setTrackBikeId}
                    trackWeather={trackWeather}
                    setTrackWeather={setTrackWeather}
                    trackSessions={trackSessions}
                    onTrackSessionChange={handleTrackSessionChange}
                    trackBestLapTime={trackBestLapTime}
                    setTrackBestLapTime={setTrackBestLapTime}
                    trackAverageLapTime={trackAverageLapTime}
                    setTrackAverageLapTime={setTrackAverageLapTime}
                    trackNotes={trackNotes}
                    setTrackNotes={setTrackNotes}
                    trackMessage={trackMessage}
                    isEditing={!!editingTrackDay}
                    handleTrackDaySave={handleTrackDaySave}
                    saveTrackDayDetails={saveTrackDayDetails}
                    saveTrackTurn={saveTrackTurn}
                />
            ) : user && activePage === 'trackhistory' ? (
                <TrackHistoryPage
                    trackDays={trackDays}
                    onSelectTrackDay={(day) => {
                        setEditingTrackDay(day);
                        populateTrackFieldsFromDay(day);
                        navigateTo('tracklog');
                    }}
                    onDeleteTrackDay={handleDeleteTrackDay}
                />
            ) : user && activePage === 'trackdaydetails' ? (
                <TrackDayDetailsPage
                    trackDay={selectedTrackDay}
                    onBack={() => navigateTo('trackhistory')}
                />
            ) : (
                <CalendarPage
                    circuits={circuits}
                    organizers={organizers}
                    selectedFilters={selectedFilters}
                    openMenu={openMenu}
                    setOpenMenu={setOpenMenu}
                    toggleFilterValue={toggleFilterValue}
                    clearFilter={clearFilter}
                    currentMonthLabel={currentMonthLabel}
                    changeMonth={changeMonth}
                    calendarDays={calendarDays}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    selectedDateEvents={selectedDateEvents}
                    eventsTitle={eventsTitle}
                    organizerLinks={organizerLinks}
                    circuitMenuRef={circuitMenuRef}
                    organizerMenuRef={organizerMenuRef}
                />
            )}
            <footer>
                <p>&copy; 2026 Trackly - Calendario Eventi</p>
            </footer>
        </div>
    );
}

export default App;
