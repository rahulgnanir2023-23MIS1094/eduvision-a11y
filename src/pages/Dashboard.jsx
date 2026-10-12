import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Clock,
  Play,
  TrendingUp,
  Award,
  Users,
  Search,
  Sparkles,
  ArrowRight,
  Flame,
  HelpCircle,
} from 'lucide-react';
import { courses, userProfile } from '../data/mockData';
import { useAccessibility } from '../context/AccessibilityContext';
import StudyTimer from '../components/StudyTimer';
import OfflineBadge from '../components/OfflineBadge';

function StatCard({ icon: Icon, label, value, color, helper }) {
  return (
    <div
      className="rounded-2xl p-5 a11y-transition shadow-sm flex flex-col justify-between"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
      }}
    >
      <div className="flex items-center gap-4 mb-3">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: color + '18', color }}
        >
          <Icon size={24} aria-hidden="true" />
        </div>
        <div>
          <p className="text-2xl font-black font-mono" style={{ color: 'var(--text-primary)' }}>
            {value}
          </p>
          <p className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
            {label}
          </p>
        </div>
      </div>
      {helper && (
        <p className="text-xs font-medium pt-2 border-t" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
          {helper}
        </p>
      )}
    </div>
  );
}

function CourseCard({ course, onResume, onQuiz }) {
  const { isHighContrast } = useAccessibility();

  return (
    <article
      className="rounded-2xl overflow-hidden a11y-transition shadow-sm flex flex-col justify-between"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
      }}
      aria-label={`${course.title} — ${course.progress}% complete, taught by ${course.instructor}`}
    >
      {/* Accent strip */}
      <div
        className="h-2 w-full"
        style={{ backgroundColor: isHighContrast ? 'var(--accent)' : course.color }}
        aria-hidden="true"
      />

      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Header row */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-bold"
              style={{
                backgroundColor: 'var(--badge-bg)',
                color: 'var(--badge-text)',
              }}
            >
              {course.category}
            </span>
            <OfflineBadge />
            <span className="text-xs font-mono font-semibold" style={{ color: 'var(--text-muted)' }}>
              {course.duration}
            </span>
          </div>

          {/* Title */}
          <h3
            className="text-lg font-bold mb-1 leading-snug"
            style={{ color: 'var(--text-primary)' }}
          >
            {course.title}
          </h3>

          {/* Instructor */}
          <p className="text-xs mb-3 font-medium flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
            <Users size={14} aria-hidden="true" />
            {course.instructor}
          </p>

          {/* Description */}
          <p
            className="text-xs leading-relaxed mb-5 line-clamp-2"
            style={{ color: 'var(--text-muted)' }}
          >
            {course.description}
          </p>
        </div>

        <div>
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5 text-xs font-semibold">
              <span style={{ color: 'var(--text-secondary)' }}>
                {course.completedLessons} of {course.totalLessons} Lessons
              </span>
              <span className="font-mono font-bold" style={{ color: 'var(--accent)' }}>
                {course.progress}%
              </span>
            </div>
            <div
              className="progress-bar-track"
              role="progressbar"
              aria-valuenow={course.progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${course.title} progress: ${course.progress}%`}
            >
              <div
                className="progress-bar-fill"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>

          {/* Next Lesson Callout */}
          <div
            className="p-3 rounded-xl mb-4 flex items-center gap-2.5 text-xs"
            style={{
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
            }}
          >
            <Play size={14} style={{ color: 'var(--accent)' }} aria-hidden="true" />
            <span className="font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
              Next: {course.nextLesson}
            </span>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onResume(course.id)}
              className="py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              style={{
                backgroundColor: 'var(--accent)',
                color: '#ffffff',
              }}
              aria-label={`Resume learning ${course.title}`}
            >
              <Play size={14} aria-hidden="true" />
              Resume
            </button>
            <button
              onClick={() => onQuiz(course.id)}
              className="py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              style={{
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
              }}
              aria-label={`Take quiz for ${course.title}`}
            >
              <HelpCircle size={14} aria-hidden="true" />
              Quiz
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { isHighContrast } = useAccessibility();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Mathematics', 'Science', 'Humanities', 'Technology', 'Social Studies'];

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All' || course.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleResume = (courseId) => {
    navigate(`/lesson/${courseId}`);
  };

  const handleQuiz = (courseId) => {
    navigate(`/quiz/${courseId}`);
  };

  const overallProgress = Math.round(
    courses.reduce((sum, c) => sum + c.progress, 0) / courses.length
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Top Welcome / Hero Banner */}
      <div
        className="rounded-3xl p-6 md:p-8 a11y-transition shadow-sm relative overflow-hidden"
        style={{
          background: isHighContrast
            ? '#000000'
            : 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
          border: isHighContrast ? '2px solid #ffffff' : 'none',
          color: '#ffffff',
        }}
      >
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/10 backdrop-blur-sm border border-white/20">
            <Flame size={14} className="text-amber-400" aria-hidden="true" />
            <span>7-Day Study Streak Active</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">
            Welcome to EduVision, {userProfile.name}!
          </h2>
          <p className="text-sm text-indigo-100 leading-relaxed">
            Your customized assistive learning environment is fully calibrated under BIS IS 17802. Ready to jump back into calculus?
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => handleResume(1)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-md bg-white text-indigo-900 hover:bg-indigo-50"
              aria-label="Resume Integration by Parts lesson"
            >
              <Play size={14} aria-hidden="true" />
              Resume: Integration by Parts
            </button>
            <button
              onClick={() => navigate('/accessibility')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer bg-white/10 hover:bg-white/20 text-white border border-white/20"
            >
              <Sparkles size={14} aria-hidden="true" />
              Adjust Accessibility Profile
            </button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        aria-label="Student Learning Statistics"
      >
        <StatCard
          icon={BookOpen}
          label="Enrolled Courses"
          value={userProfile.enrolledCourses}
          color={isHighContrast ? '#ffff00' : '#4f46e5'}
          helper="Across 5 learning faculties"
        />
        <StatCard
          icon={Award}
          label="Courses Completed"
          value={userProfile.completedCourses}
          color={isHighContrast ? '#ffff00' : '#16a34a'}
          helper="Certified under NEP a11y"
        />
        <StatCard
          icon={TrendingUp}
          label="Average Progress"
          value={`${overallProgress}%`}
          color={isHighContrast ? '#ffff00' : '#f59e0b'}
          helper="↑ 8% from last week"
        />
        <StatCard
          icon={Clock}
          label="Active Study Hours"
          value="47.2"
          color={isHighContrast ? '#ffff00' : '#ec4899'}
          helper="TTS & Audio assisted"
        />
      </div>

      {/* Main Grid: Courses + Study Timer */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left 2 Cols: Courses */}
        <div className="xl:col-span-2 space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text-muted)' }}
                aria-hidden="true"
              />
              <input
                type="text"
                placeholder="Search by course title, professor, or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium border transition-colors a11y-transition"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
                aria-label="Search courses"
              />
            </div>
          </div>

          {/* Categories Pill Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Course categories">
            {categories.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
                className="px-4 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex-shrink-0"
                style={{
                  backgroundColor: selectedCategory === cat ? 'var(--accent)' : 'var(--bg-card)',
                  color: selectedCategory === cat ? '#ffffff' : 'var(--text-secondary)',
                  border: `1px solid ${selectedCategory === cat ? 'var(--accent)' : 'var(--border-color)'}`,
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onResume={handleResume}
                onQuiz={handleQuiz}
              />
            ))}
            {filteredCourses.length === 0 && (
              <div
                className="col-span-2 p-8 text-center rounded-2xl border"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <p className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
                  No courses found matching "{searchQuery}".
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Study Timer & Rapid Links */}
        <div className="space-y-6">
          <StudyTimer />

          {/* Quick Assessment Widget */}
          <div
            className="rounded-2xl p-6 a11y-transition shadow-sm space-y-4"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div className="flex items-center gap-2">
              <HelpCircle size={18} style={{ color: 'var(--accent)' }} aria-hidden="true" />
              <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                Recommended Assessment
              </h3>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Test your mastery of <strong>Integration by Parts</strong> with accessible timed questions and immediate visual feedback.
            </p>
            <button
              onClick={() => navigate('/quiz/1')}
              className="w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
              style={{
                backgroundColor: 'var(--accent)',
                color: '#ffffff',
              }}
            >
              Start Calculus Quiz
              <ArrowRight size={14} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
