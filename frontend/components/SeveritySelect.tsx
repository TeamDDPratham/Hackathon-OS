import React, { useState, useRef, useEffect } from 'react';
import { ChevronsUpDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Option {
  value: string;
  label: string;
}

interface SeveritySelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
}

export function SeveritySelect({ value, onChange, options }: SeveritySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative font-sans text-sm" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-40 bg-[#151b2b] border border-[#1f2940] hover:border-[#2e3c59] text-slate-200 rounded-xl px-3 py-2 transition-colors focus:outline-none focus:border-cyan-500 shadow-sm"
      >
        <span className="font-semibold">{selectedOption.label}</span>
        <ChevronsUpDown className="w-4 h-4 text-cyan-500 ml-2" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 w-full bg-[#151b2b] border border-[#1f2940] rounded-xl shadow-xl z-50 overflow-hidden"
          >
            <ul className="flex flex-col py-1">
              {options.map((option) => (
                <li key={option.value}>
                  <button
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm font-semibold transition-colors ${
                      value === option.value
                        ? 'text-cyan-400 bg-[#1f2940]/50'
                        : 'text-slate-300 hover:bg-[#1f2940]/30 hover:text-white'
                    }`}
                  >
                    {option.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

