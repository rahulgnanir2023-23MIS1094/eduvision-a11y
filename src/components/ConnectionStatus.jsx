import { useState, useEffect, useCallback } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

/**
 * ConnectionStatus — Accessible online/offline indicator
 * 
 * BIS IS 17802 compliance:
 * - Never uses colour alone to convey status (text label always present)
 * - Announces changes via aria-live (through AccessibilityContext.announce)
 * - Works in high-contrast mode
 * - Respects reduced-motion (no animation when prefers-reduced-motion)
 */
export default function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const { isHighContrast, announce, isReducedMotion } = useAccessibility();

  const handleOnline = useCallback(() => {
    setIsOnline(true);
    announce('Connection restored — you are back online');
  }, [announce]);

  const handleOffline = useCallback(() => {
    setIsOnline(false);
    announce('You are offline — lessons and settings still work');
  }, [announce]);

  useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleOnline, handleOffline]);

  return (
    <div
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold select-none a11y-transition"
      style={{
        backgroundColor: isHighContrast
          ? '#000000'
          : isOnline
            ? 'var(--accent-light)'
            : '#fef3c7',
        color: isHighContrast
          ? isOnline ? '#00ff66' : '#ffff00'
          : isOnline ? '#15803d' : '#b45309',
        border: isHighContrast
          ? '2px solid #ffffff'
          : `1px solid ${isOnline ? '#86efac' : '#fcd34d'}`,
        transition: isReducedMotion ? 'none' : 'background-color 0.2s ease, color 0.2s ease',
      }}
      role="status"
      aria-live="polite"
      aria-label={isOnline ? 'Online' : 'Offline, lessons and settings still work'}
    >
      {isOnline ? (
        <>
          <Wifi size={14} className="flex-shrink-0" aria-hidden="true" />
          <span>Online</span>
        </>
      ) : (
        <>
          <WifiOff size={14} className="flex-shrink-0" aria-hidden="true" />
          <span>Offline, lessons and settings still work</span>
        </>
      )}
    </div>
  );
}


