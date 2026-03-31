# Trackly - Calendario degli Eventi

Un sito web semplice e responsivo per visualizzare un calendario con gli eventi categorizzati.

## Caratteristiche

✨ **Calendario Interattivo**
- Vista mensile intuitiva
- Navigazione tra i mesi
- Evidenziazione della data odierna
- Indicatori visivi degli eventi

📅 **Gestione Eventi**
- Eventi categorizzati per Data, Circuito e Organizzatore
- Visualizzazione dettagliata degli eventi cliccando su una data
- Filtri per circuito e organizzatore

📱 **Design Responsivo**
- Adattamento perfetto a dispositivi desktop, tablet e mobile
- Interfaccia intuitiva e facile da usare
- Stile moderno e funzionale

## Come Usare

1. Apri il file `index.html` nel tuo browser
2. Clicca su un giorno nel calendario per visualizzare gli eventi
3. Usa i filtri per cercare eventi per circuito o organizzatore
4. Naviga tra i mesi usando i pulsanti "Mese Precedente" e "Mese Successivo"

## Struttura dei File

```
- index.html    → Struttura HTML della pagina
- styles.css    → Stili CSS responsivi
- app.js        → Logica JavaScript per il calendario
```

## Aggiungere Nuovi Eventi

Per aggiungere nuovi eventi, modifica l'array `events` nel file `app.js`:

```javascript
const events = [
    {
        date: 'YYYY-MM-DD',      // Data in formato ISO
        title: 'Nome Evento',     // Titolo dell'evento
        circuit: 'Nome Circuito', // Circuito dove si svolge
        organizer: 'Organizzatore' // Chi organizza l'evento
    }
];
```

## Colori e Personalizzazione

I colori principali sono definiti in `styles.css` nel blocco `:root`:
- `--primary-color`: Blu (#2563eb)
- `--secondary-color`: Blu scuro (#1e40af)
- `--accent-color`: Arancione (#f59e0b)

## Browser Supportati

✓ Chrome/Chromium
✓ Firefox
✓ Safari
✓ Edge

---

**Trackly** - Realizzato con HTML5, CSS3 e JavaScript Vanilla
