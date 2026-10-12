import { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

/**
 * OfflineBadge — Truthful indicator that content is cached and available offline
 * 
 * Only renders when a Service Worker is active and controlling the client,
 * confirming the app shell and mock data assets are precached.
 */
export default function OfflineBadge({ className = '' }) {
  const [isCached, setIsCached] = useState(() => {
    return typeof navigator !== 'undefined' && 'serviceWorker' in navigator && Boolean(navigator.serviceWorker.controller);
  });
  const { isHighContrast } = useAccessibility();

  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator && !isCached) {
      navigator.serviceWorker.ready
        .then((reg) => {
          if (reg?.active) setIsCached(true);
        })
        .catch(() => {});
    }
  }, [isCached]);

  if (!isCached) return null;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold select-none ${className}`}
      style={{
        backgroundColor: isHighContrast ? '#000000' : '#ecfdf5',
        color: isHighContrast ? '#00ff66' : '#059669',
        border: isHighContrast ? '1px solid #00ff66' : '1px solid #a7f3d0',
      }}
      title="Cached by EduVision Service Worker for offline use"
      aria-label="Available offline"
    >
      <CheckCircle size={12} className="flex-shrink-0" aria-hidden="true" />
      <span>Available offline</span>
    </span>
  );
}
