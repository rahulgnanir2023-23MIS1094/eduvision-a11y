import { useState, useEffect, useRef, useCallback } from 'react';
import { Timer, Play, Pause, RotateCcw, Coffee } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

const STUDY_DURATION = 25 * 60; // 25 minutes
const BREAK_DURATION = 5 * 60; // 5 minutes

export default function StudyTimer() {
  const { isHighContrast, announce } = useAccessibility();
  const [seconds, setSeconds] = useState(STUDY_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const intervalRef = useRef(null);

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const progress = isBreak
    ? ((BREAK_DURATION - seconds) / BREAK_DURATION) * 100
    : ((STUDY_DURATION - seconds) / STUDY_DURATION) * 100;

  useEffect(() => {
    if (isRunning && seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => prev - 1);
      }, 1000);
    } else if (seconds === 0) {
      clearInterval(intervalRef.current);
      if (isBreak) {
        setIsBreak(false);
        setSeconds(STUDY_DURATION);
        announce('Break over! Starting new study session.');
      } else {
        setSessionsCompleted(prev => prev + 1);
        setIsBreak(true);
        setSeconds(BREAK_DURATION);
        announce('Study session complete! Take a 5-minute break.');
      }
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, seconds, isBreak, announce]);

  const toggleTimer = useCallback(() => {
    setIsRunning(prev => !prev);
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setIsBreak(false);
    setSeconds(STUDY_DURATION);
    announce('Study timer reset.');
  }, [announce]);

  return (
    <div
      className="rounded-xl p-5 a11y-transition"
      style={{
        backgroundColor: 'var(--bg-card)',
        boxShadow: 'var(--card-shadow)',
        border: '1px solid var(--border-color)',
      }}
      role="timer"
      aria-label={`Study timer: ${formatTime(seconds)} remaining`}
    >
      <div className="flex items-center gap-2 mb-4">
        {isBreak ? (
          <Coffee size={18} style={{ color: 'var(--success)' }} aria-hidden="true" />
        ) : (
          <Timer size={18} style={{ color: 'var(--accent)' }} aria-hidden="true" />
        )}
        <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
          {isBreak ? 'Break Time' : 'Pomodoro Study Timer'}
        </h3>
        <span
          className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium"
          style={{
            backgroundColor: isBreak ? 'rgba(34,197,94,0.15)' : 'var(--accent-light)',
            color: isBreak ? 'var(--success)' : 'var(--accent)',
          }}
        >
          Session {sessionsCompleted + 1}
        </span>
      </div>

      {/* Timer display */}
      <div className="text-center mb-4">
        <div
          className="text-4xl font-mono font-bold tracking-wider"
          style={{ color: 'var(--text-primary)' }}
          aria-live="off"
        >
          {formatTime(seconds)}
        </div>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
          {isBreak ? 'Relax and rest your eyes' : 'Stay focused on your studies'}
        </p>
      </div>

      {/* Progress bar */}
      <div className="progress-bar-track mb-4">
        <div
          className="progress-bar-fill"
          style={{
            width: `${progress}%`,
            backgroundColor: isBreak ? 'var(--success)' : 'var(--progress-fill)',
          }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={toggleTimer}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200"
          style={{
            backgroundColor: isRunning ? 'var(--warning)' : 'var(--accent)',
            color: isRunning && !isHighContrast ? '#000000' : '#ffffff',
          }}
          aria-label={isRunning ? 'Pause timer' : 'Start timer'}
        >
          {isRunning ? <Pause size={16} /> : <Play size={16} />}
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={resetTimer}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer"
          style={{
            backgroundColor: 'var(--bg-primary)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-color)',
          }}
          aria-label="Reset timer"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      {/* Sessions counter */}
      {sessionsCompleted > 0 && (
        <p className="text-center text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
          🎉 {sessionsCompleted} session{sessionsCompleted > 1 ? 's' : ''} completed today
        </p>
      )}
    </div>
  );
}
