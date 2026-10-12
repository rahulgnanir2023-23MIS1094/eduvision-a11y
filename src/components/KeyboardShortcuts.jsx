import { useState, useEffect } from 'react';
import { Keyboard, X } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

const shortcuts = [
  { keys: ['Alt', 'D'], action: 'Toggle Dyslexia Mode' },
  { keys: ['Alt', 'H'], action: 'Toggle High Contrast' },
  { keys: ['Alt', 'F'], action: 'Toggle Focus Indicators' },
  { keys: ['Alt', 'R'], action: 'Toggle Reading Guide' },
  { keys: ['Alt', 'M'], action: 'Toggle Reduced Motion' },
  { keys: ['Alt', '+'], action: 'Increase Font Size' },
  { keys: ['Alt', '-'], action: 'Decrease Font Size' },
  { keys: ['?'], action: 'Show Keyboard Shortcuts' },
  { keys: ['Esc'], action: 'Close Dialog' },
];

export default function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    toggleDyslexiaMode,
    toggleHighContrast,
    toggleFocusMode,
    toggleReadingGuide,
    toggleReducedMotion,
    increaseFontSize,
    decreaseFontSize,
  } = useAccessibility();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger shortcuts when typing in inputs
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (e.key === '?' && !e.altKey && !e.ctrlKey) {
        e.preventDefault();
        setIsOpen(prev => !prev);
        return;
      }

      if (e.key === 'Escape') {
        setIsOpen(false);
        return;
      }

      if (e.altKey) {
        switch (e.key.toLowerCase()) {
          case 'd':
            e.preventDefault();
            toggleDyslexiaMode();
            break;
          case 'h':
            e.preventDefault();
            toggleHighContrast();
            break;
          case 'f':
            e.preventDefault();
            toggleFocusMode();
            break;
          case 'r':
            e.preventDefault();
            toggleReadingGuide();
            break;
          case 'm':
            e.preventDefault();
            toggleReducedMotion();
            break;
          case '=':
          case '+':
            e.preventDefault();
            increaseFontSize();
            break;
          case '-':
            e.preventDefault();
            decreaseFontSize();
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleDyslexiaMode, toggleHighContrast, toggleFocusMode, toggleReadingGuide, toggleReducedMotion, increaseFontSize, decreaseFontSize]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
      onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" aria-hidden="true" />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg rounded-2xl p-6 shadow-2xl a11y-transition"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Keyboard size={20} style={{ color: 'var(--accent)' }} aria-hidden="true" />
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              Keyboard Shortcuts
            </h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg transition-colors cursor-pointer"
            style={{ color: 'var(--text-muted)' }}
            aria-label="Close shortcuts dialog"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-2">
          {shortcuts.map(({ keys, action }) => (
            <div
              key={action}
              className="flex items-center justify-between py-2 px-3 rounded-lg"
              style={{ backgroundColor: 'var(--bg-primary)' }}
            >
              <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                {action}
              </span>
              <div className="flex items-center gap-1">
                {keys.map((key, i) => (
                  <span key={i}>
                    <kbd
                      className="px-2 py-1 rounded text-xs font-mono font-bold"
                      style={{
                        backgroundColor: 'var(--bg-card)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-color)',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                      }}
                    >
                      {key}
                    </kbd>
                    {i < keys.length - 1 && (
                      <span className="mx-1 text-xs" style={{ color: 'var(--text-muted)' }}>+</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-xs text-center" style={{ color: 'var(--text-muted)' }}>
          Press <kbd className="px-1.5 py-0.5 rounded text-xs font-mono" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>?</kbd> to toggle this panel
        </p>
      </div>
    </div>
  );
}
