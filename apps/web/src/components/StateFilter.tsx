import { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown, X } from 'lucide-react';
import { SUDAN_STATES } from '../lib/sudanStates';

interface Props {
  value: string;
  onChange: (state: string) => void;
}

export default function StateFilter({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = SUDAN_STATES.find(s => s.value === value);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
          value
            ? 'border-primary-500 bg-primary-50 text-primary-700'
            : 'border-gray-200 bg-white text-gray-600 hover:border-primary-300'
        }`}
      >
        <MapPin size={16} className={value ? 'text-primary-500' : 'text-gray-400'} />
        <span>{selected ? `${selected.emoji} ${selected.value}` : 'كل الولايات'}</span>
        {value ? (
          <span
            onClick={(e) => { e.stopPropagation(); onChange(''); }}
            className="mr-1 text-primary-400 hover:text-red-500 transition-colors"
          >
            <X size={14} />
          </span>
        ) : (
          <ChevronDown size={14} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        )}
      </button>

      {open && (
        <div className="absolute top-full mt-2 right-0 z-50 bg-white rounded-2xl shadow-xl border border-gray-100 w-56 max-h-80 overflow-y-auto">
          {/* All states option */}
          <button
            onClick={() => { onChange(''); setOpen(false); }}
            className={`w-full text-right px-4 py-3 text-sm hover:bg-gray-50 flex items-center gap-2 transition-colors border-b border-gray-100 ${!value ? 'text-primary-600 font-semibold bg-primary-50' : 'text-gray-700'}`}
          >
            <MapPin size={15} className="text-gray-400" />
            كل ولايات السودان
          </button>

          {SUDAN_STATES.map(state => (
            <button
              key={state.value}
              onClick={() => { onChange(state.value); setOpen(false); }}
              className={`w-full text-right px-4 py-2.5 text-sm hover:bg-primary-50 flex items-center gap-2 transition-colors ${value === state.value ? 'text-primary-600 font-semibold bg-primary-50' : 'text-gray-700'}`}
            >
              <span className="text-base">{state.emoji}</span>
              {state.value}
              {value === state.value && <span className="mr-auto w-2 h-2 bg-primary-500 rounded-full" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
