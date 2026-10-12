import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Accessibility,
  Type,
  Eye,
  MousePointerClick,
  BookOpenCheck,
  Minus,
  Plus,
  X,
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

export default function AccessibilityFAB() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const {
    isDyslexiaMode, toggleDyslexiaMode,
    isHighContrast, toggleHighContrast,
    isFocusMode, toggleFocusMode,
    isReadingGuide, toggleReadingGuide,
    fontSize, increaseFontSize, decreaseFontSize,
    activeFeatureCount,
  } = useAccessibility();

  const quickToggles = [
    { label: 'Dyslexia Mode', icon: Type, active: isDyslexiaMode, onToggle: toggleDyslexiaMode },
    { label: 'High Contrast', icon: Eye, active: isHighContrast, onToggle: toggleHighContrast },
    { label: 'Focus Mode', icon: MousePointerClick, active: isFocusMode, onToggle: toggleFocusMode },
    { label: 'Reading Guide', icon: BookOpenCheck, active: isReadingGuide, onToggle: toggleReadingGuide },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50" role="region" aria-label="Quick accessibility controls">
      {/* Quick access panel */}
      {isOpen && (
        <div
          className="absolute bottom-16 right-0 w-72 rounded-2xl p-4 shadow-2xl a11y-transition mb-2"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              Quick Accessibility
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded cursor-pointer"
              style={{ color: 'var(--text-muted)' }}
              aria-label="Close quick access"
            >
              <X size={16} />
            </button>
          </div>

          {/* Font size controls */}
          <div
            className="flex items-center justify-between p-2.5 rounded-lg mb-2"
            style={{ backgroundColor: 'var(--bg-primary)' }}
          >
            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              Font Size: {fontSize}px
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={decreaseFontSize}
                className="w-7 h-7 rounded flex items-center justify-center cursor-pointer"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                }}
                aria-label="Decrease font size"
              >
                <Minus size={14} />
              </button>
              <button
                onClick={increaseFontSize}
                className="w-7 h-7 rounded flex items-center justify-center cursor-pointer"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                }}
                aria-label="Increase font size"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Quick toggles */}
          <div className="space-y-1">
            {quickToggles.map(({ label, icon: Icon, active, onToggle }) => (
              <button
                key={label}
                onClick={onToggle}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer"
                style={{
                  backgroundColor: active ? 'var(--accent-light)' : 'transparent',
                  color: active ? 'var(--accent)' : 'var(--text-secondary)',
                  border: active ? '1px solid var(--accent)' : '1px solid transparent',
                }}
                aria-pressed={active}
              >
                <Icon size={14} aria-hidden="true" />
                {label}
                <span
                  className="ml-auto text-xs px-1.5 py-0.5 rounded-full font-bold"
                  style={{
                    backgroundColor: active ? 'var(--accent)' : 'var(--bg-primary)',
                    color: active ? '#ffffff' : 'var(--text-muted)',
                  }}
                >
                  {active ? 'ON' : 'OFF'}
                </span>
              </button>
            ))}
          </div>

          {/* Full settings link */}
          <button
            onClick={() => { navigate('/accessibility'); setIsOpen(false); }}
            className="w-full mt-3 py-2 rounded-lg text-xs font-semibold text-center cursor-pointer"
            style={{
              backgroundColor: 'var(--accent)',
              color: '#ffffff',
            }}
          >
            Open Full BIS IS 17802 Settings
          </button>
        </div>
      )}

      {/* FAB button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 cursor-pointer"
        style={{
          background: isHighContrast
            ? '#ffff00'
            : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          color: isHighContrast ? '#000000' : '#ffffff',
          border: isHighContrast ? '2px solid #ffffff' : 'none',
        }}
        aria-label={`Accessibility quick settings. ${activeFeatureCount} features active.`}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <>
            <Accessibility size={24} />
            {activeFeatureCount > 0 && (
              <span
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
                style={{
                  backgroundColor: 'var(--danger)',
                  color: '#ffffff',
                }}
                aria-hidden="true"
              >
                {activeFeatureCount}
              </span>
            )}
          </>
        )}
      </button>
    </div>
  );
}
