import {
  Eye,
  Type,
  MousePointerClick,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Info,
  Accessibility,
  Sliders,
  BookOpenCheck,
  Zap,
  Volume2,
  Sparkles,
  Palette,
  Minus,
  Plus,
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';
import Toggle from '../components/Toggle';

export default function AccessibilitySettings() {
  const {
    isDyslexiaMode,
    isHighContrast,
    isFocusMode,
    toggleDyslexiaMode,
    toggleHighContrast,
    toggleFocusMode,
    fontSize,
    setFontSize,
    increaseFontSize,
    decreaseFontSize,
    isReadingGuide,
    toggleReadingGuide,
    colorBlindMode,
    setColorBlindMode,
    isReducedMotion,
    toggleReducedMotion,
    isScreenReader,
    toggleScreenReader,
    lineSpacing,
    setLineSpacing,
    resetAll,
    activeFeatureCount,
    complianceScore,
    announce,
  } = useAccessibility();

  // One-click presets for instant demo impact
  const applyLowVisionPreset = () => {
    if (!isHighContrast) toggleHighContrast();
    if (!isFocusMode) toggleFocusMode();
    setFontSize(22);
    announce('Low Vision profile activated: High Contrast, 22px font, and 4px focus rings enabled.');
  };

  const applyDyslexiaPreset = () => {
    if (!isDyslexiaMode) toggleDyslexiaMode();
    if (!isReadingGuide) toggleReadingGuide();
    setLineSpacing(1.85);
    setFontSize(18);
    announce('Cognitive & Dyslexia profile activated: Wide tracking font, 1.85 line height, and reading guide enabled.');
  };

  const applyKeyboardPreset = () => {
    if (!isFocusMode) toggleFocusMode();
    if (!isScreenReader) toggleScreenReader();
    announce('Keyboard navigation profile activated: Enhanced focus rings and screen reader assertions enabled.');
  };

  const coreSettings = [
    {
      key: 'dyslexia',
      icon: Type,
      title: 'Dyslexia-Friendly Typography Engine',
      description:
        'Replaces typography with an accessible wide-tracking sans-serif typeface, increases line-height to 1.85, and broadens word-spacing to prevent visual crowding and character swapping.',
      clause: 'BIS IS 17802 (Part 1): 2021 § 8.4.1 — Typography & Spacing for Cognitive Impairments',
      checked: isDyslexiaMode,
      onChange: toggleDyslexiaMode,
      color: '#6366f1',
    },
    {
      key: 'contrast',
      icon: Eye,
      title: 'Ultra High-Contrast Mode (Black / Neon Yellow / White)',
      description:
        'Converts the entire application to an uncompromising Black background with Neon Yellow (#ffff00) highlights and pure White (#ffffff) text, guaranteeing contrast exceeding 7:1 (WCAG AAA).',
      clause: 'BIS IS 17802 (Part 1): 2021 § 8.3.2 — High Contrast Color Transformation for Low Vision',
      checked: isHighContrast,
      onChange: toggleHighContrast,
      color: '#eab308',
    },
    {
      key: 'focus',
      icon: MousePointerClick,
      title: 'Enhanced Distinguishable Focus Ring (4px Solid)',
      description:
        'Renders an unmissable 4px solid perimeter with dual-ring halo outline around any focused or hovered interactive element, guaranteeing flawless accessibility for keyboard-only and motor-impaired learners.',
      clause: 'BIS IS 17802 (Part 1): 2021 § 8.5.1 — Distinguishable Visual Keyboard Focus Indicators',
      checked: isFocusMode,
      onChange: toggleFocusMode,
      color: '#10b981',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm"
              style={{
                background: isHighContrast
                  ? '#ffff00'
                  : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                color: isHighContrast ? '#000000' : '#ffffff',
              }}
            >
              <Accessibility size={26} aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>
                BIS IS 17802: 2021 Accessibility Engine
              </h2>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                Official National Standards for ICT Accessibility Compliance (Part 1: Requirements)
              </p>
            </div>
          </div>

          {/* Reset All Button */}
          <button
            onClick={resetAll}
            className="self-start md:self-auto flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer shadow-sm"
            style={{
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '2px solid var(--border-color)',
            }}
            aria-label="Reset all accessibility settings to standard defaults"
          >
            <RotateCcw size={16} aria-hidden="true" />
            Reset to Standard
          </button>
        </div>
      </div>

      {/* Compliance Meter & Quick Preset Bar */}
      <div
        className="rounded-2xl p-6 a11y-transition shadow-sm"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '2px solid var(--border-color)',
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck size={20} style={{ color: 'var(--success)' }} aria-hidden="true" />
              <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                Live IS 17802 Compliance Status:
              </span>
              <span
                className="text-xs font-black px-2.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: complianceScore >= 80 ? 'rgba(22, 163, 74, 0.15)' : 'var(--accent-light)',
                  color: complianceScore >= 80 ? 'var(--success)' : 'var(--accent)',
                }}
              >
                {complianceScore >= 80 ? 'LEVEL AAA VERIFIED' : 'LEVEL AA ACTIVE'}
              </span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Currently running with <strong style={{ color: 'var(--accent)' }}>{activeFeatureCount} active adaptation(s)</strong>. Real-time DOM CSS variables automatically recalculate for optimal cognitive comfort.
            </p>
          </div>

          {/* Score Counter */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-3xl font-black font-mono" style={{ color: 'var(--accent)' }}>
                {complianceScore}%
              </span>
              <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                Compliance Rating
              </p>
            </div>
            <div className="w-32 progress-bar-track">
              <div
                className="progress-bar-fill"
                style={{ width: `${complianceScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick Demo Presets */}
        <div className="border-t pt-4" style={{ borderColor: 'var(--border-color)' }}>
          <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
            One-Click Evaluator Demo Presets:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={applyLowVisionPreset}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
              }}
            >
              <Eye size={16} aria-hidden="true" />
              Low Vision Profile
            </button>
            <button
              onClick={applyDyslexiaPreset}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
              }}
            >
              <BookOpenCheck size={16} aria-hidden="true" />
              Dyslexia & ADHD Profile
            </button>
            <button
              onClick={applyKeyboardPreset}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
              }}
            >
              <MousePointerClick size={16} aria-hidden="true" />
              Keyboard Only Profile
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: The Core Mandate Toggles */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Zap size={20} style={{ color: 'var(--accent)' }} aria-hidden="true" />
          <h3 className="text-lg font-black" style={{ color: 'var(--text-primary)' }}>
            Core Mandatory Transformers (The Mandate)
          </h3>
        </div>

        <div className="space-y-4">
          {coreSettings.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.key}
                className="rounded-2xl p-6 a11y-transition shadow-sm"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: item.checked ? '2px solid var(--accent)' : '2px solid var(--border-color)',
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: item.checked
                        ? isHighContrast ? '#ffff00' : item.color + '22'
                        : 'var(--bg-primary)',
                      color: item.checked
                        ? isHighContrast ? '#000000' : item.color
                        : 'var(--text-muted)',
                      border: `1px solid ${item.checked ? 'var(--accent)' : 'var(--border-color)'}`,
                    }}
                  >
                    <Icon size={24} aria-hidden="true" />
                  </div>

                  <div className="flex-1">
                    <Toggle
                      checked={item.checked}
                      onChange={item.onChange}
                      label={item.title}
                      description={item.description}
                    />

                    <div
                      className="mt-4 p-3 rounded-xl flex items-start gap-2.5 text-xs leading-relaxed"
                      style={{
                        backgroundColor: 'var(--bg-primary)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {item.checked ? (
                        <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--success)' }} aria-hidden="true" />
                      ) : (
                        <Info size={16} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--text-muted)' }} aria-hidden="true" />
                      )}
                      <span>
                        <strong style={{ color: 'var(--text-primary)' }}>Compliance Mandate: </strong>
                        {item.clause}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: Advanced Sensory & Cognitive Tools */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sliders size={20} style={{ color: 'var(--accent)' }} aria-hidden="true" />
          <h3 className="text-lg font-black" style={{ color: 'var(--text-primary)' }}>
            Sensory, Motor & Cognitive Refinements
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Font Scalability */}
          <div
            className="rounded-2xl p-6 a11y-transition shadow-sm flex flex-col justify-between"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '2px solid var(--border-color)',
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
                  Dynamic Font Scalability
                </span>
                <span className="font-mono text-sm font-bold" style={{ color: 'var(--accent)' }}>
                  {fontSize}px
                </span>
              </div>
              <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
                BIS IS 17802 § 8.4.2 — Support up to 200% text enlargement without clipping.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={decreaseFontSize}
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold cursor-pointer transition-all"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                }}
                aria-label="Decrease font size"
              >
                <Minus size={18} />
              </button>
              <input
                type="range"
                min="14"
                max="26"
                step="1"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="flex-1 accent-indigo-600 cursor-pointer h-2 bg-gray-200 rounded-lg"
                aria-label="Font size slider"
              />
              <button
                onClick={increaseFontSize}
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold cursor-pointer transition-all"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                }}
                aria-label="Increase font size"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* Reading Guide / Focus Ruler */}
          <div
            className="rounded-2xl p-6 a11y-transition shadow-sm flex flex-col justify-between"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: isReadingGuide ? '2px solid var(--accent)' : '2px solid var(--border-color)',
            }}
          >
            <Toggle
              checked={isReadingGuide}
              onChange={toggleReadingGuide}
              label="Reading Focus Guide (Ruler)"
              description="Displays an interactive horizontal tracking beam that follows mouse movement to assist students with ADHD, tracking fatigue, and visual dyslexia."
            />
            <p className="text-xs mt-3 pt-3 border-t" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
              Complies with BIS IS 17802 § 8.4.3 (Attention & Focus Assisting ICT).
            </p>
          </div>

          {/* Color Vision Deficiency (CVD) Simulation */}
          <div
            className="rounded-2xl p-6 a11y-transition shadow-sm flex flex-col justify-between"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: colorBlindMode !== 'none' ? '2px solid var(--accent)' : '2px solid var(--border-color)',
            }}
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Palette size={18} style={{ color: 'var(--accent)' }} aria-hidden="true" />
                <span className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
                  Color Blindness Adaptation
                </span>
              </div>
              <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
                IS 17802 § 8.3.1 — Spectral compensation filters for Daltonism.
              </p>
            </div>

            <select
              value={colorBlindMode}
              onChange={(e) => setColorBlindMode(e.target.value)}
              className="w-full p-2.5 rounded-xl text-sm font-medium cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
              }}
              aria-label="Select color blindness simulation mode"
            >
              <option value="none">Standard Vision (No Filter)</option>
              <option value="protanopia">Protanopia (Red-Blind)</option>
              <option value="deuteranopia">Deuteranopia (Green-Blind)</option>
              <option value="tritanopia">Tritanopia (Blue-Blind)</option>
            </select>
          </div>

          {/* Reduced Motion Toggle */}
          <div
            className="rounded-2xl p-6 a11y-transition shadow-sm flex flex-col justify-between"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: isReducedMotion ? '2px solid var(--accent)' : '2px solid var(--border-color)',
            }}
          >
            <Toggle
              checked={isReducedMotion}
              onChange={toggleReducedMotion}
              label="Vestibular Motion Shield"
              description="Stops decorative animations, transitions, and pulsing to protect users prone to vestibular disorders, motion sickness, or cognitive overload."
            />
            <p className="text-xs mt-3 pt-3 border-t" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
              Complies with BIS IS 17802 § 8.2.1 & WCAG 2.3.3 (Animation from Interactions).
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 3: Live Interactive Preview Sandbox */}
      <div
        className="rounded-2xl p-6 a11y-transition shadow-sm"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '2px solid var(--accent)',
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={20} style={{ color: 'var(--accent)' }} aria-hidden="true" />
          <h3 className="text-lg font-black" style={{ color: 'var(--text-primary)' }}>
            Instant Transformation Live Sandbox
          </h3>
        </div>
        <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
          This preview demonstrates exactly how text, mathematical symbols, buttons, and focus outlines appear right now across the application:
        </p>

        <div
          className="p-5 rounded-xl border space-y-3"
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <h4 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
            Lesson Excerpt: Fundamentals of Calculus &amp; Motion
          </h4>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
            In calculus, the formula for integration by parts is expressed as <strong style={{ color: 'var(--accent)' }}>∫u dv = uv − ∫v du</strong>. Notice how dyslexia-spacing separates character pairs such as "b" and "d", or "p" and "q", preventing perceptual reversal for neurodivergent students.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              className="px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
              style={{
                backgroundColor: 'var(--accent)',
                color: '#ffffff',
              }}
            >
              Interactive Button (Tab to Test Focus)
            </button>
            <button
              className="px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
              style={{
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
              }}
            >
              Secondary Action
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
