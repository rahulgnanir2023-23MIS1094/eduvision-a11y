import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronLeft,
  Maximize,
  Clock,
  BookOpen,
  AudioLines,
  RotateCcw,
  FastForward,
  Rewind,
  Search,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import { courses, lessonTranscript } from '../data/mockData';
import { useAccessibility } from '../context/AccessibilityContext';

function AudioWave({ isPlaying }) {
  return (
    <span
      className={`audio-wave inline-flex items-end h-5 ${!isPlaying ? 'audio-wave-paused' : ''}`}
      aria-hidden="true"
    >
      <span /><span /><span /><span /><span />
    </span>
  );
}

export default function Lesson() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { isHighContrast, announce } = useAccessibility();

  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTranscriptIndex, setActiveTranscriptIndex] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);
  const [transcriptSearch, setTranscriptSearch] = useState('');
  const [isTTSActive, setIsTTSActive] = useState(false);
  const [ttsRate, setTtsRate] = useState(1);
  const [showCognitiveSummary, setShowCognitiveSummary] = useState(true);

  const transcriptRef = useRef(null);
  const timerRef = useRef(null);

  const course = courses.find((c) => c.id === Number(courseId)) || courses[0];

  // Video interval sync
  useEffect(() => {
    if (isPlaying) {
      const intervalDuration = 4000 / playbackSpeed;
      timerRef.current = setInterval(() => {
        setActiveTranscriptIndex((prev) => {
          if (prev >= lessonTranscript.length - 1) {
            setIsPlaying(false);
            announce('Lesson playback completed.');
            return 0;
          }
          return prev + 1;
        });
      }, intervalDuration);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, playbackSpeed, announce]);

  // Auto-scroll transcript
  useEffect(() => {
    if (autoScroll && transcriptRef.current) {
      const activeElement = transcriptRef.current.querySelector('[data-active="true"]');
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [activeTranscriptIndex, autoScroll]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSeek = (index) => {
    setActiveTranscriptIndex(index);
    announce(`Jumped to timestamp ${lessonTranscript[index].timestamp}`);
  };

  const handleSkipForward = () => {
    setActiveTranscriptIndex((prev) => Math.min(lessonTranscript.length - 1, prev + 1));
    announce('Skipped forward to next section');
  };

  const handleSkipBackward = () => {
    setActiveTranscriptIndex((prev) => Math.max(0, prev - 1));
    announce('Rewound to previous section');
  };

  const toggleTTS = useCallback(() => {
    if (isTTSActive) {
      window.speechSynthesis?.cancel();
      setIsTTSActive(false);
      announce('Speech synthesis stopped');
      return;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const currentText = lessonTranscript[activeTranscriptIndex]?.text || '';
      const utterance = new SpeechSynthesisUtterance(currentText);
      utterance.rate = ttsRate;
      utterance.pitch = 1;
      utterance.onend = () => setIsTTSActive(false);
      utterance.onerror = () => setIsTTSActive(false);
      window.speechSynthesis.speak(utterance);
      setIsTTSActive(true);
      announce(`Reading timestamp ${lessonTranscript[activeTranscriptIndex]?.timestamp} aloud`);
    } else {
      alert('SpeechSynthesis API not available in this browser.');
    }
  }, [isTTSActive, activeTranscriptIndex, ttsRate, announce]);

  const filteredTranscript = useMemo(() => {
    return lessonTranscript.filter((item) =>
      item.text.toLowerCase().includes(transcriptSearch.toLowerCase())
    );
  }, [transcriptSearch]);

  const currentProgressPercent = Math.round(
    ((activeTranscriptIndex + 1) / lessonTranscript.length) * 100
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center justify-between">
        <ol className="flex items-center gap-2 text-xs font-semibold" role="list">
          <li>
            <Link
              to="/"
              className="flex items-center gap-1 transition-colors"
              style={{ color: 'var(--accent)' }}
            >
              <ChevronLeft size={16} aria-hidden="true" />
              Dashboard
            </Link>
          </li>
          <li style={{ color: 'var(--text-muted)' }} aria-hidden="true">/</li>
          <li style={{ color: 'var(--text-secondary)' }}>{course.title}</li>
          <li style={{ color: 'var(--text-muted)' }} aria-hidden="true">/</li>
          <li style={{ color: 'var(--text-primary)' }}>{course.nextLesson}</li>
        </ol>

        <button
          onClick={() => navigate(`/quiz/${course.id}`)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-sm"
          style={{
            backgroundColor: 'var(--bg-card)',
            color: 'var(--accent)',
            border: '1px solid var(--border-color)',
          }}
          aria-label="Take quiz for this lesson"
        >
          <HelpCircle size={14} aria-hidden="true" />
          Take Lesson Quiz
        </button>
      </nav>

      {/* Lesson Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="px-2.5 py-0.5 rounded-full text-xs font-bold"
              style={{
                backgroundColor: 'var(--badge-bg)',
                color: 'var(--badge-text)',
              }}
            >
              {course.category}
            </span>
            <span className="text-xs font-mono font-semibold" style={{ color: 'var(--text-muted)' }}>
              Lesson Duration: {course.duration}
            </span>
          </div>
          <h2 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>
            {course.nextLesson}
          </h2>
          <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
            Course: {course.title} • Instructor: {course.instructor}
          </p>
        </div>

        {/* Multi-modal Speech Support Pill */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTTS}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-sm ${
              isTTSActive ? 'tts-pulse' : ''
            }`}
            style={{
              backgroundColor: isTTSActive ? 'var(--accent)' : 'var(--bg-card)',
              color: isTTSActive ? '#ffffff' : 'var(--text-primary)',
              border: `2px solid ${isTTSActive ? 'var(--accent)' : 'var(--border-color)'}`,
            }}
            aria-label={isTTSActive ? 'Stop text-to-speech reading' : 'Read current lesson segment aloud'}
            aria-pressed={isTTSActive}
          >
            {isTTSActive ? <VolumeX size={16} aria-hidden="true" /> : <AudioLines size={16} aria-hidden="true" />}
            {isTTSActive ? 'Stop Reading' : 'Read Aloud (TTS)'}
            <AudioWave isPlaying={isTTSActive} />
          </button>

          {/* Speed Selector for TTS */}
          <select
            value={ttsRate}
            onChange={(e) => setTtsRate(Number(e.target.value))}
            className="p-2 rounded-xl text-xs font-bold cursor-pointer"
            style={{
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
            }}
            aria-label="Text-to-speech voice playback speed"
          >
            <option value="0.75">0.75x Speed</option>
            <option value="1">1.0x Normal</option>
            <option value="1.25">1.25x Fast</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Video + Smart Transcript */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Simulated Video Player & Cognitive Summary */}
        <div className="lg:col-span-2 space-y-4">
          {/* Simulated Video Player */}
          <div
            className="video-player a11y-transition shadow-lg"
            role="region"
            aria-label={`Interactive video player for ${course.nextLesson}`}
          >
            {/* Top Info Bar */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none select-none">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-black/50 text-white backdrop-blur-md border border-white/20">
                Segment {activeTranscriptIndex + 1} of {lessonTranscript.length}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-600/60 text-white backdrop-blur-md">
                1080p HD
              </span>
            </div>

            {/* Center Big Play/Pause Button */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="video-play-btn cursor-pointer z-20"
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
            >
              {isPlaying ? (
                <Pause size={32} color="#ffffff" aria-hidden="true" />
              ) : (
                <Play size={32} color="#ffffff" className="ml-1" aria-hidden="true" />
              )}
            </button>

            {/* Closed Captions Subtitle Pill (Cleanly Positioned above controls) */}
            <div className="absolute bottom-16 left-6 right-6 z-15 flex justify-center pointer-events-none">
              <div className="max-w-xl text-center px-4 py-2 rounded-xl bg-black/75 backdrop-blur-md border border-white/15 shadow-lg">
                <p className="text-white text-xs md:text-sm font-semibold leading-relaxed tracking-wide">
                  "{lessonTranscript[activeTranscriptIndex]?.text}"
                </p>
              </div>
            </div>

            {/* Video Control Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 z-20">
              {/* Scrub bar */}
              <div
                className="w-full h-2 rounded-full bg-white/20 mb-3 cursor-pointer overflow-hidden"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const ratio = clickX / rect.width;
                  const newIndex = Math.min(
                    lessonTranscript.length - 1,
                    Math.floor(ratio * lessonTranscript.length)
                  );
                  handleSeek(newIndex);
                }}
                role="slider"
                aria-label="Video timeline seek slider"
                aria-valuenow={currentProgressPercent}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${currentProgressPercent}%`,
                    backgroundColor: isHighContrast ? '#ffff00' : '#6366f1',
                  }}
                />
              </div>

              {/* Controls layout */}
              <div className="flex items-center justify-between text-white text-xs">
                {/* Left controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1 hover:text-indigo-300 transition-colors cursor-pointer"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                  </button>

                  <button
                    onClick={handleSkipBackward}
                    className="p-1 hover:text-indigo-300 transition-colors cursor-pointer"
                    aria-label="Rewind to previous transcript segment"
                  >
                    <Rewind size={18} />
                  </button>

                  <button
                    onClick={handleSkipForward}
                    className="p-1 hover:text-indigo-300 transition-colors cursor-pointer"
                    aria-label="Skip to next transcript segment"
                  >
                    <FastForward size={18} />
                  </button>

                  <span className="font-mono font-semibold">
                    {lessonTranscript[activeTranscriptIndex]?.timestamp} / 06:45
                  </span>
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-3">
                  {/* Speed toggle */}
                  <button
                    onClick={() => {
                      const speeds = [0.75, 1, 1.25, 1.5];
                      const next = speeds[(speeds.indexOf(playbackSpeed) + 1) % speeds.length];
                      setPlaybackSpeed(next);
                      announce(`Playback speed set to ${next}x`);
                    }}
                    className="font-mono font-bold px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                    aria-label={`Current playback speed ${playbackSpeed}x. Click to change.`}
                  >
                    {playbackSpeed}x
                  </button>

                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1 hover:text-indigo-300 transition-colors cursor-pointer"
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>

                  <button
                    onClick={() => announce('Simulated full screen toggled')}
                    className="p-1 hover:text-indigo-300 transition-colors cursor-pointer"
                    aria-label="Full screen"
                  >
                    <Maximize size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Cognitive Simplification Drawer */}
          <div
            className="rounded-2xl p-5 a11y-transition shadow-sm"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles size={18} style={{ color: 'var(--accent)' }} aria-hidden="true" />
                <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  Cognitive Summary &amp; Key Concepts
                </h3>
              </div>
              <button
                onClick={() => setShowCognitiveSummary(!showCognitiveSummary)}
                className="text-xs font-bold cursor-pointer transition-colors"
                style={{ color: 'var(--accent)' }}
                aria-expanded={showCognitiveSummary}
              >
                {showCognitiveSummary ? 'Hide Concept Notes' : 'Show Concept Notes'}
              </button>
            </div>

            {showCognitiveSummary && (
              <div className="pt-2 text-xs leading-relaxed space-y-2 border-t" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                <p>
                  <strong style={{ color: 'var(--text-primary)' }}>Core Equation:</strong> ∫ u dv = uv − ∫ v du
                </p>
                <p>
                  <strong style={{ color: 'var(--text-primary)' }}>LIATE Priority Rule:</strong> Always choose <em>u</em> in this order: Logarithmic → Inverse Trig → Algebraic → Trigonometric → Exponential.
                </p>
                <p>
                  <strong style={{ color: 'var(--text-primary)' }}>Simplification Cue:</strong> Differentiating <em>u</em> should yield an easier expression than the original integral!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Smart Synchronized Transcript */}
        <div className="space-y-4">
          <div
            className="rounded-2xl overflow-hidden a11y-transition shadow-sm flex flex-col h-[560px]"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
            }}
          >
            {/* Transcript Title & Controls */}
            <div className="p-4 border-b space-y-3" style={{ borderColor: 'var(--border-color)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen size={16} style={{ color: 'var(--accent)' }} aria-hidden="true" />
                  <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                    Synchronized Transcript
                  </h3>
                </div>
                <button
                  onClick={() => setAutoScroll(!autoScroll)}
                  className="text-xs font-semibold px-2 py-0.5 rounded cursor-pointer transition-all"
                  style={{
                    backgroundColor: autoScroll ? 'var(--accent-light)' : 'var(--bg-primary)',
                    color: autoScroll ? 'var(--accent)' : 'var(--text-muted)',
                    border: '1px solid var(--border-color)',
                  }}
                  aria-pressed={autoScroll}
                  aria-label="Toggle auto-scroll synchronization"
                >
                  Auto-Scroll: {autoScroll ? 'ON' : 'OFF'}
                </button>
              </div>

              {/* Transcript Search */}
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-muted)' }}
                  aria-hidden="true"
                />
                <input
                  type="text"
                  placeholder="Search transcript..."
                  value={transcriptSearch}
                  onChange={(e) => setTranscriptSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs font-medium border"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                  aria-label="Filter transcript by keyword"
                />
              </div>
            </div>

            {/* Transcript Scroll Area */}
            <div
              ref={transcriptRef}
              className="flex-1 overflow-y-auto p-3 space-y-2"
              role="feed"
              aria-label="Interactive timestamped transcript"
            >
              {filteredTranscript.map((entry, idx) => {
                const originalIndex = lessonTranscript.findIndex((item) => item.timestamp === entry.timestamp);
                const isActive = originalIndex === activeTranscriptIndex;

                return (
                  <button
                    key={idx}
                    data-active={isActive}
                    onClick={() => handleSeek(originalIndex)}
                    className="w-full text-left p-3 rounded-xl transition-all cursor-pointer block"
                    style={{
                      backgroundColor: isActive ? 'var(--accent-light)' : 'transparent',
                      borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
                    }}
                    aria-label={`Timestamp ${entry.timestamp}. ${entry.text}`}
                    aria-current={isActive ? 'step' : undefined}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className="text-xs font-mono font-bold"
                        style={{ color: isActive ? 'var(--accent)' : 'var(--text-muted)' }}
                      >
                        {entry.timestamp}
                      </span>
                      {isActive && (
                        <span
                          className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded"
                          style={{ backgroundColor: 'var(--accent)', color: '#ffffff' }}
                        >
                          Playing
                        </span>
                      )}
                    </div>
                    <p
                      className="text-xs leading-relaxed"
                      style={{
                        color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                        fontWeight: isActive ? '600' : '400',
                      }}
                    >
                      {entry.text}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
