import React, { useEffect, useMemo, useRef, useState } from 'react';

export interface PredictiveSuggestion {
  id: string;
  label: string;
  hint?: string;
}

interface PredictiveInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onPickSuggestion?: (suggestion: PredictiveSuggestion) => void;
  suggestions: PredictiveSuggestion[];
  placeholder?: string;
  className?: string;
  inputClassName?: string;
}

export const PredictiveInput: React.FC<PredictiveInputProps> = ({
  value,
  onChange,
  onSubmit,
  onPickSuggestion,
  suggestions,
  placeholder,
  className = '',
  inputClassName = '',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const blurTimeoutRef = useRef<number | null>(null);

  const filteredSuggestions = useMemo(() => {
    const query = value.trim().toLowerCase();
    if (!query) return suggestions.slice(0, 6);

    const startsWith = suggestions.filter((item) => item.label.toLowerCase().startsWith(query));
    const includes = suggestions.filter(
      (item) => !item.label.toLowerCase().startsWith(query) && item.label.toLowerCase().includes(query)
    );

    return [...startsWith, ...includes].slice(0, 6);
  }, [suggestions, value]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [value]);

  const handlePick = (suggestion: PredictiveSuggestion) => {
    onChange(suggestion.label);
    onPickSuggestion?.(suggestion);
    setIsFocused(false);
  };

  return (
    <div className={`relative ${className}`}>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={inputClassName}
        onFocus={() => {
          if (blurTimeoutRef.current) {
            window.clearTimeout(blurTimeoutRef.current);
          }
          setIsFocused(true);
        }}
        onBlur={() => {
          blurTimeoutRef.current = window.setTimeout(() => setIsFocused(false), 120);
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            setActiveIndex((prev) => Math.min(prev + 1, filteredSuggestions.length - 1));
          }

          if (event.key === 'ArrowUp') {
            event.preventDefault();
            setActiveIndex((prev) => Math.max(prev - 1, 0));
          }

          if (event.key === 'Enter') {
            event.preventDefault();
            if (activeIndex >= 0 && filteredSuggestions[activeIndex]) {
              handlePick(filteredSuggestions[activeIndex]);
              return;
            }
            onSubmit();
          }
        }}
      />

      {isFocused && filteredSuggestions.length > 0 && (
        <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white border border-ink/10 rounded-2xl shadow-[0_20px_40px_-30px_rgba(31,26,23,0.55)] z-20 overflow-hidden">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              type="button"
              key={suggestion.id}
              onMouseDown={() => handlePick(suggestion)}
              className={`w-full text-left px-4 py-3 border-b border-ink/5 last:border-b-0 transition-colors ${
                index === activeIndex ? 'bg-ink text-sand-50' : 'hover:bg-ink/5 text-ink/80'
              }`}
            >
              <p className="font-semibold text-sm">{suggestion.label}</p>
              {suggestion.hint && (
                <p className={`text-xs ${index === activeIndex ? 'text-sand-100/70' : 'text-ink/50'}`}>
                  {suggestion.hint}
                </p>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
