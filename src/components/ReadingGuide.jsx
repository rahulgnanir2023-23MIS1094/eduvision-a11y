import { useState, useEffect } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';

export default function ReadingGuide() {
  const { isReadingGuide, isHighContrast } = useAccessibility();
  const [position, setPosition] = useState({ y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isReadingGuide) {
      setVisible(false);
      return;
    }

    const handleMouseMove = (e) => {
      setPosition({ y: e.clientY });
      setVisible(true);
    };

    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isReadingGuide]);

  if (!isReadingGuide || !visible) return null;

  const guideColor = isHighContrast ? '#ffff00' : '#6366f1';

  return (
    <>
      {/* Top overlay */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: `${Math.max(0, position.y - 20)}px`,
          background: 'rgba(0, 0, 0, 0.15)',
          pointerEvents: 'none',
          zIndex: 9998,
          transition: 'height 0.05s linear',
        }}
        aria-hidden="true"
      />
      {/* Guide line */}
      <div
        style={{
          position: 'fixed',
          top: `${position.y - 20}px`,
          left: 0,
          right: 0,
          height: '40px',
          borderTop: `2px solid ${guideColor}`,
          borderBottom: `2px solid ${guideColor}`,
          background: isHighContrast ? 'rgba(255, 255, 0, 0.08)' : 'rgba(99, 102, 241, 0.06)',
          pointerEvents: 'none',
          zIndex: 9998,
          transition: 'top 0.05s linear',
        }}
        aria-hidden="true"
      />
      {/* Bottom overlay */}
      <div
        style={{
          position: 'fixed',
          top: `${position.y + 20}px`,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.15)',
          pointerEvents: 'none',
          zIndex: 9998,
          transition: 'top 0.05s linear',
        }}
        aria-hidden="true"
      />
    </>
  );
}
