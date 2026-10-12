import { useNavigate } from 'react-router-dom';
import { Clock, Users, Play, TrendingUp } from 'lucide-react';
import { courses } from '../data/mockData';
import { useAccessibility } from '../context/AccessibilityContext';

export default function Courses() {
  const navigate = useNavigate();
  const { isHighContrast } = useAccessibility();

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h2
          className="text-2xl font-bold mb-1"
          style={{ color: 'var(--text-primary)' }}
        >
          My Courses
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          View all your enrolled courses and continue learning.
        </p>
      </div>

      {/* Courses list */}
      <div className="space-y-4">
        {courses.map(course => (
          <article
            key={course.id}
            className="rounded-xl overflow-hidden a11y-transition flex flex-col sm:flex-row"
            style={{
              backgroundColor: 'var(--bg-card)',
              boxShadow: 'var(--card-shadow)',
              border: '1px solid var(--border-color)',
            }}
            aria-label={`${course.title} — ${course.progress}% complete`}
          >
            {/* Left color accent */}
            <div
              className="w-full sm:w-2 flex-shrink-0"
              style={{ backgroundColor: isHighContrast ? 'var(--accent)' : course.color }}
              aria-hidden="true"
            />

            <div className="flex-1 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Course info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: 'var(--badge-bg)',
                      color: 'var(--badge-text)',
                    }}
                  >
                    {course.category}
                  </span>
                </div>
                <h3
                  className="text-lg font-bold mb-0.5"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {course.title}
                </h3>
                <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                  <Users size={14} className="inline mr-1 -mt-0.5" aria-hidden="true" />
                  {course.instructor}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {course.description}
                </p>
              </div>

              {/* Progress + action */}
              <div className="sm:w-52 flex-shrink-0 space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                      <TrendingUp size={12} aria-hidden="true" />
                      {course.completedLessons}/{course.totalLessons} lessons
                    </span>
                    <span className="text-xs font-bold" style={{ color: 'var(--accent)' }}>
                      {course.progress}%
                    </span>
                  </div>
                  <div
                    className="progress-bar-track"
                    role="progressbar"
                    aria-valuenow={course.progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${course.title} progress`}
                  >
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                    <Clock size={12} aria-hidden="true" />
                    {course.duration}
                  </span>
                </div>
                <button
                  onClick={() => navigate(`/lesson/${course.id}`)}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer"
                  style={{
                    backgroundColor: 'var(--accent)',
                    color: '#ffffff',
                  }}
                  onMouseEnter={e => { e.target.style.backgroundColor = 'var(--accent-hover)'; }}
                  onMouseLeave={e => { e.target.style.backgroundColor = 'var(--accent)'; }}
                  aria-label={`Resume ${course.title}`}
                >
                  <Play size={14} aria-hidden="true" />
                  Resume
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

