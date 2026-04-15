function MultiSelect({
    label,
    defaultLabel,
    values,
    selectedValues,
    isOpen,
    onToggle,
    onChange,
    onClear,
    menuRef,
    controlsId,
}) {
    return (
        <div className={`multi-select${isOpen ? ' open' : ''}`} ref={menuRef}>
            <button
                type="button"
                className="multi-select-trigger"
                aria-expanded={isOpen}
                aria-controls={controlsId}
                onClick={onToggle}
            >
                {selectedValues.length === 0
                    ? defaultLabel
                    : selectedValues.length === 1
                    ? selectedValues[0]
                    : `${selectedValues.length} selezionati`}
            </button>
            <div className="multi-select-panel" id={controlsId} role="group" aria-label={label}>
                <button type="button" className="multi-select-clear" onClick={onClear}>
                    Azzera selezione
                </button>
                {values.map((value, index) => {
                    const optionId = `${controlsId}-${index}`;
                    return (
                        <label className="multi-select-option" htmlFor={optionId} key={value}>
                            <input
                                type="checkbox"
                                id={optionId}
                                checked={selectedValues.includes(value)}
                                onChange={() => onChange(value)}
                            />
                            <span>{value}</span>
                        </label>
                    );
                })}
            </div>
        </div>
    );
}

export default MultiSelect;
