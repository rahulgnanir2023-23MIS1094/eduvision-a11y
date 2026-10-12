import { createContext, useContext, useState, useCallback, useEffect, useRef, useMemo } from 'react';

const AccessibilityContext = createContext(null);

const STORAGE_KEY = 'eduvision-a11y-settings';

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Ignore parse errors
  }
  return null;
}

function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Ignore quota errors
  }
}

const defaults = {
  isDyslexiaMode: false,
  isHighContrast: false,
  isFocusMode: false,
  fontSize: 16,
  isReadingGuide: false,
  colorBlindMode: 'none', // 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia'
  isReducedMotion: false,
  isScreenReader: false,
  lineSpacing: 1.6,
};

function getInitialParams() {
  if (typeof window === 'undefined') return {};
  try {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    const res = {};
    if (mode === 'high-contrast') res.isHighContrast = true;
    if (mode === 'dyslexia') res.isDyslexiaMode = true;
    if (mode === 'focus') res.isFocusMode = true;
    if (mode === 'low-vision') {
      res.isHighContrast = true;
      res.isFocusMode = true;
      res.fontSize = 20;
    }
    return res;
  } catch {
    return {};
  }
}

export function AccessibilityProvider({ children }) {
  const saved = loadSettings();
  const urlOverrides = getInitialParams();

  const [isDyslexiaMode, setIsDyslexiaMode] = useState(urlOverrides.isDyslexiaMode ?? saved?.isDyslexiaMode ?? defaults.isDyslexiaMode);
  const [isHighContrast, setIsHighContrast] = useState(urlOverrides.isHighContrast ?? saved?.isHighContrast ?? defaults.isHighContrast);
  const [isFocusMode, setIsFocusMode] = useState(urlOverrides.isFocusMode ?? saved?.isFocusMode ?? defaults.isFocusMode);
  const [fontSize, setFontSizeState] = useState(urlOverrides.fontSize ?? saved?.fontSize ?? defaults.fontSize);
  const [isReadingGuide, setIsReadingGuide] = useState(saved?.isReadingGuide ?? defaults.isReadingGuide);
  const [colorBlindMode, setColorBlindModeState] = useState(saved?.colorBlindMode ?? defaults.colorBlindMode);
  const [isReducedMotion, setIsReducedMotion] = useState(saved?.isReducedMotion ?? defaults.isReducedMotion);
  const [isScreenReader, setIsScreenReader] = useState(saved?.isScreenReader ?? defaults.isScreenReader);
  const [lineSpacing, setLineSpacingState] = useState(saved?.lineSpacing ?? defaults.lineSpacing);

  // Screen reader live announcements
  const [announcement, setAnnouncement] = useState('');
  const announcementTimeoutRef = useRef(null);

  // Persist all settings to localStorage
  useEffect(() => {
    saveSettings({
      isDyslexiaMode,
      isHighContrast,
      isFocusMode,
      fontSize,
      isReadingGuide,
      colorBlindMode,
      isReducedMotion,
      isScreenReader,
      lineSpacing,
    });
  }, [isDyslexiaMode, isHighContrast, isFocusMode, fontSize, isReadingGuide, colorBlindMode, isReducedMotion, isScreenReader, lineSpacing]);

  // Apply accessibility classes and CSS custom properties to <html>
  useEffect(() => {
    const html = document.documentElement;

    html.classList.toggle('dyslexia-mode', isDyslexiaMode);
    html.classList.toggle('high-contrast', isHighContrast);
    html.classList.toggle('focus-mode', isFocusMode);
    html.classList.toggle('reading-guide-active', isReadingGuide);
    html.classList.toggle('reduced-motion', isReducedMotion);
    html.classList.toggle('screen-reader-enhanced', isScreenReader);

    // Color blind filters
    html.classList.toggle('cb-protanopia', colorBlindMode === 'protanopia');
    html.classList.toggle('cb-deuteranopia', colorBlindMode === 'deuteranopia');
    html.classList.toggle('cb-tritanopia', colorBlindMode === 'tritanopia');

    // Font size
    html.style.fontSize = `${fontSize}px`;

    // Line spacing
    html.style.setProperty('--line-height', isDyslexiaMode ? '1.8' : String(lineSpacing));

    // Reduced motion
    if (isReducedMotion) {
      html.style.setProperty('--transition-speed', '0s');
    } else {
      html.style.removeProperty('--transition-speed');
    }
  }, [isDyslexiaMode, isHighContrast, isFocusMode, fontSize, isReadingGuide, colorBlindMode, isReducedMotion, isScreenReader, lineSpacing]);

  // Announce function for screen reader
  const announce = useCallback((message) => {
    clearTimeout(announcementTimeoutRef.current);
    setAnnouncement('');
    // Brief delay so screen reader registers the change
    requestAnimationFrame(() => {
      setAnnouncement(message);
    });
    announcementTimeoutRef.current = setTimeout(() => setAnnouncement(''), 5000);
  }, []);

  // Toggles with announcements
  const toggleDyslexiaMode = useCallback(() => {
    setIsDyslexiaMode(prev => {
      const next = !prev;
      announce(next ? 'Dyslexia-friendly mode enabled' : 'Dyslexia-friendly mode disabled');
      return next;
    });
  }, [announce]);

  const toggleHighContrast = useCallback(() => {
    setIsHighContrast(prev => {
      const next = !prev;
      announce(next ? 'High contrast mode enabled' : 'High contrast mode disabled');
      return next;
    });
  }, [announce]);

  const toggleFocusMode = useCallback(() => {
    setIsFocusMode(prev => {
      const next = !prev;
      announce(next ? 'Enhanced focus indicators enabled' : 'Enhanced focus indicators disabled');
      return next;
    });
  }, [announce]);

  const toggleReadingGuide = useCallback(() => {
    setIsReadingGuide(prev => {
      const next = !prev;
      announce(next ? 'Reading guide enabled' : 'Reading guide disabled');
      return next;
    });
  }, [announce]);

  const toggleReducedMotion = useCallback(() => {
    setIsReducedMotion(prev => {
      const next = !prev;
      announce(next ? 'Reduced motion enabled' : 'Reduced motion disabled');
      return next;
    });
  }, [announce]);

  const toggleScreenReader = useCallback(() => {
    setIsScreenReader(prev => {
      const next = !prev;
      announce(next ? 'Enhanced screen reader mode enabled' : 'Enhanced screen reader mode disabled');
      return next;
    });
  }, [announce]);

  const setFontSize = useCallback((size) => {
    const clamped = Math.min(32, Math.max(12, size));
    setFontSizeState(clamped);
    announce(`Font size set to ${clamped} pixels`);
  }, [announce]);

  const increaseFontSize = useCallback(() => {
    setFontSizeState(prev => {
      const next = Math.min(32, prev + 2);
      announce(`Font size increased to ${next} pixels`);
      return next;
    });
  }, [announce]);

  const decreaseFontSize = useCallback(() => {
    setFontSizeState(prev => {
      const next = Math.max(12, prev - 2);
      announce(`Font size decreased to ${next} pixels`);
      return next;
    });
  }, [announce]);

  const setColorBlindMode = useCallback((mode) => {
    setColorBlindModeState(mode);
    announce(mode === 'none' ? 'Color blind simulation disabled' : `${mode} simulation enabled`);
  }, [announce]);

  const setLineSpacing = useCallback((spacing) => {
    const clamped = Math.min(3, Math.max(1, spacing));
    setLineSpacingState(clamped);
    announce(`Line spacing set to ${clamped}`);
  }, [announce]);

  const resetAll = useCallback(() => {
    setIsDyslexiaMode(defaults.isDyslexiaMode);
    setIsHighContrast(defaults.isHighContrast);
    setIsFocusMode(defaults.isFocusMode);
    setFontSizeState(defaults.fontSize);
    setIsReadingGuide(defaults.isReadingGuide);
    setColorBlindModeState(defaults.colorBlindMode);
    setIsReducedMotion(defaults.isReducedMotion);
    setIsScreenReader(defaults.isScreenReader);
    setLineSpacingState(defaults.lineSpacing);
    announce('All accessibility settings reset to defaults');
  }, [announce]);

  // Calculate how many features are active
  const activeFeatureCount = useMemo(() => {
    return [
      isDyslexiaMode,
      isHighContrast,
      isFocusMode,
      fontSize !== 16,
      isReadingGuide,
      colorBlindMode !== 'none',
      isReducedMotion,
      isScreenReader,
      lineSpacing !== 1.6,
    ].filter(Boolean).length;
  }, [isDyslexiaMode, isHighContrast, isFocusMode, fontSize, isReadingGuide, colorBlindMode, isReducedMotion, isScreenReader, lineSpacing]);

  // BIS Compliance Score (0-100)
  const complianceScore = useMemo(() => {
    let score = 30; // Base score for having an accessible structure
    if (isDyslexiaMode) score += 12;
    if (isHighContrast) score += 15;
    if (isFocusMode) score += 13;
    if (fontSize >= 18) score += 8;
    if (isReadingGuide) score += 5;
    if (isReducedMotion) score += 7;
    if (isScreenReader) score += 5;
    if (lineSpacing >= 1.5) score += 5;
    return Math.min(100, score);
  }, [isDyslexiaMode, isHighContrast, isFocusMode, fontSize, isReadingGuide, isReducedMotion, isScreenReader, lineSpacing]);

  const value = useMemo(() => ({
    // Original
    isDyslexiaMode, toggleDyslexiaMode,
    isHighContrast, toggleHighContrast,
    isFocusMode, toggleFocusMode,
    // New
    fontSize, setFontSize, increaseFontSize, decreaseFontSize,
    isReadingGuide, toggleReadingGuide,
    colorBlindMode, setColorBlindMode,
    isReducedMotion, toggleReducedMotion,
    isScreenReader, toggleScreenReader,
    lineSpacing, setLineSpacing,
    // Utilities
    resetAll,
    activeFeatureCount,
    complianceScore,
    announce,
    announcement,
  }), [
    isDyslexiaMode, toggleDyslexiaMode,
    isHighContrast, toggleHighContrast,
    isFocusMode, toggleFocusMode,
    fontSize, setFontSize, increaseFontSize, decreaseFontSize,
    isReadingGuide, toggleReadingGuide,
    colorBlindMode, setColorBlindMode,
    isReducedMotion, toggleReducedMotion,
    isScreenReader, toggleScreenReader,
    lineSpacing, setLineSpacing,
    resetAll, activeFeatureCount, complianceScore, announce, announcement,
  ]);

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
      {/* Screen reader live region */}
      <div
        role="status"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0,0,0,0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        {announcement}
      </div>
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
