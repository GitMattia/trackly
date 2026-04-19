export const monthNames = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
];

export const weekdayLabels = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

export function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function formatDateItalian(dateStr) {
    const [year, month, day] = dateStr.split('-');
    const date = new Date(year, Number(month) - 1, day);
    const days = ['Domenica', 'Lunedi', 'Martedi', 'Mercoledi', 'Giovedi', 'Venerdi', 'Sabato'];
    const dayName = days[date.getDay()];
    const monthName = monthNames[date.getMonth()];
    return `${dayName}, ${day} ${monthName} ${year}`;
}

export function parseLapTime(rawValue) {
    if (rawValue == null) {
        return null;
    }

    const value = String(rawValue).trim().replace(',', '.');
    if (value === '') {
        return null;
    }

    const numericValue = Number(value);
    if (!Number.isNaN(numericValue) && Number.isFinite(numericValue)) {
        return Math.round(numericValue * 100) / 100;
    }

    const parts = value.split(':').map((part) => part.trim());
    if (parts.length === 2) {
        const minutes = Number(parts[0]);
        const seconds = Number(parts[1]);
        if (Number.isFinite(minutes) && Number.isFinite(seconds)) {
            const total = minutes * 60 + seconds;
            return Math.round(total * 100) / 100;
        }
    }

    if (parts.length === 3) {
        const minutes = Number(parts[0]);
        const seconds = Number(parts[1]);
        const fractionPart = parts[2];
        if (Number.isFinite(minutes) && Number.isFinite(seconds) && fractionPart !== '') {
            const fraction = Number(fractionPart) / (fractionPart.length === 1 ? 10 : 100);
            if (Number.isFinite(fraction)) {
                const total = minutes * 60 + seconds + fraction;
                return Math.round(total * 100) / 100;
            }
        }
    }

    return null;
}

export function formatLapTime(value) {
    if (value == null || value === '') {
        return '—';
    }

    const totalSeconds = Number(value);
    if (!Number.isFinite(totalSeconds)) {
        return '—';
    }

    const roundedSeconds = Math.round(totalSeconds * 100) / 100;
    const wholeSeconds = Math.floor(roundedSeconds);
    const minutes = Math.floor(wholeSeconds / 60);
    const seconds = wholeSeconds % 60;
    let fraction = Math.round((roundedSeconds - wholeSeconds) * 100);
    if (fraction === 100) {
        fraction = 0;
    }

    return `${minutes}:${String(seconds).padStart(2, '0')}:${String(fraction).padStart(2, '0')}`;
}
