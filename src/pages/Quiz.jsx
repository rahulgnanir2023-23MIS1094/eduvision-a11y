import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  ArrowRight,
  RotateCcw,
  HelpCircle,
} from 'lucide-react';
import { quizzes } from '../data/quizData';
import { useAccessibility } from '../context/AccessibilityContext';

export default function Quiz() {
  const { quizId } = useParams();
  const { isHighContrast, announce } = useAccessibility();

  const quiz = quizzes.find(q => q.id === Number(quizId)) || quizzes[0];
  const questions = quiz.questions;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit * 60);
  const [timerActive, setTimerActive] = useState(true);

  const currentQuestion = questions[currentIndex];
  const isAnswered = answers[currentQuestion.id] !== undefined;
  const totalAnswered = Object.keys(answers).length;

  // Timer
  useEffect(() => {
    if (!timerActive || isSubmitted || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setTimerActive(false);
          setIsSubmitted(true);
          announce('Time is up! Quiz auto-submitted.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, isSubmitted, timeLeft, announce]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const selectAnswer = useCallback((questionId, optionId) => {
    if (isSubmitted) return;
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
    announce(`Selected option ${optionId.toUpperCase()}`);
  }, [isSubmitted, announce]);

  const goToQuestion = useCallback((index) => {
    setCurrentIndex(index);
    setShowExplanation(false);
  }, []);

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowExplanation(false);
    }
  }, [currentIndex, questions.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowExplanation(false);
    }
  }, [currentIndex]);

  const handleSubmit = useCallback(() => {
    setIsSubmitted(true);
    setTimerActive(false);
    announce('Quiz submitted! Review your results.');
  }, [announce]);

  const handleRetry = useCallback(() => {
    setAnswers({});
    setIsSubmitted(false);
    setCurrentIndex(0);
    setShowExplanation(false);
    setTimeLeft(quiz.timeLimit * 60);
    setTimerActive(true);
    announce('Quiz reset. Starting from question 1.');
  }, [quiz.timeLimit, announce]);

  // Calculate score
  const score = isSubmitted
    ? questions.reduce((acc, q) => (answers[q.id] === q.correctAnswer ? acc + 1 : acc), 0)
    : 0;
  const percentage = Math.round((score / questions.length) * 100);

  const getOptionStyle = (question, optionId) => {
    const isSelected = answers[question.id] === optionId;
    const isCorrect = question.correctAnswer === optionId;

    if (isSubmitted) {
      if (isCorrect) {
        return {
          backgroundColor: isHighContrast ? 'rgba(0,255,0,0.2)' : 'rgba(34,197,94,0.1)',
          border: `2px solid ${isHighContrast ? '#00ff00' : '#22c55e'}`,
          color: 'var(--text-primary)',
        };
      }
      if (isSelected && !isCorrect) {
        return {
          backgroundColor: isHighContrast ? 'rgba(255,0,0,0.2)' : 'rgba(239,68,68,0.1)',
          border: `2px solid ${isHighContrast ? '#ff0000' : '#ef4444'}`,
          color: 'var(--text-primary)',
        };
      }
    }

    if (isSelected) {
      return {
        backgroundColor: 'var(--accent-light)',
        border: '2px solid var(--accent)',
        color: 'var(--text-primary)',
      };
    }

    return {
      backgroundColor: 'var(--bg-primary)',
      border: '2px solid var(--border-color)',
      color: 'var(--text-primary)',
    };
  };

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm" role="list">
          <li>
            <Link
              to="/"
              className="flex items-center gap-1 font-medium"
              style={{ color: 'var(--accent)' }}
            >
              <ChevronLeft size={16} aria-hidden="true" />
              Dashboard
            </Link>
          </li>
          <li style={{ color: 'var(--text-muted)' }} aria-hidden="true">/</li>
          <li style={{ color: 'var(--text-secondary)' }}>{quiz.title}</li>
        </ol>
      </nav>

      {/* Quiz header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {quiz.title}
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {quiz.course} • {questions.length} Questions
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Timer */}
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-lg"
            style={{
              backgroundColor: timeLeft < 60 ? 'rgba(239,68,68,0.1)' : 'var(--bg-card)',
              border: `1px solid ${timeLeft < 60 ? 'var(--danger)' : 'var(--border-color)'}`,
              color: timeLeft < 60 ? 'var(--danger)' : 'var(--text-primary)',
            }}
            role="timer"
            aria-label={`Time remaining: ${formatTime(timeLeft)}`}
          >
            <Clock size={16} aria-hidden="true" />
            <span className="font-mono font-bold text-sm">{formatTime(timeLeft)}</span>
          </div>
          {/* Progress */}
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            {totalAnswered}/{questions.length} answered
          </span>
        </div>
      </div>

      {/* Score card (shown after submit) */}
      {isSubmitted && (
        <div
          className="rounded-xl p-6 mb-6 text-center a11y-transition"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: `2px solid ${percentage >= 70 ? 'var(--success)' : 'var(--warning)'}`,
            boxShadow: 'var(--card-shadow)',
          }}
          role="alert"
        >
          <Award
            size={48}
            className="mx-auto mb-3"
            style={{ color: percentage >= 70 ? 'var(--success)' : 'var(--warning)' }}
            aria-hidden="true"
          />
          <h3 className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            {percentage}%
          </h3>
          <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
            You got {score} out of {questions.length} correct
          </p>
          <p
            className="text-sm font-semibold mb-4"
            style={{ color: percentage >= 70 ? 'var(--success)' : 'var(--warning)' }}
          >
            {percentage >= 90 ? 'Outstanding! 🌟' : percentage >= 70 ? 'Great job! 👏' : percentage >= 50 ? 'Good effort! Keep practicing.' : 'Keep studying, you can improve! 💪'}
          </p>
          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer"
            style={{ backgroundColor: 'var(--accent)', color: '#ffffff' }}
          >
            <RotateCcw size={16} aria-hidden="true" />
            Retry Quiz
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Question navigation sidebar */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div
            className="rounded-xl p-4 a11y-transition"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--card-shadow)',
            }}
          >
            <h4 className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
              Questions
            </h4>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, i) => {
                const isActive = i === currentIndex;
                const hasAnswer = answers[q.id] !== undefined;
                const isCorrectAnswer = isSubmitted && answers[q.id] === q.correctAnswer;
                const isWrongAnswer = isSubmitted && hasAnswer && answers[q.id] !== q.correctAnswer;

                let bg = 'var(--bg-primary)';
                let borderCol = 'var(--border-color)';
                let textCol = 'var(--text-secondary)';

                if (isActive) {
                  bg = 'var(--accent-light)';
                  borderCol = 'var(--accent)';
                  textCol = 'var(--accent)';
                } else if (isCorrectAnswer) {
                  bg = 'rgba(34,197,94,0.15)';
                  borderCol = 'var(--success)';
                  textCol = 'var(--success)';
                } else if (isWrongAnswer) {
                  bg = 'rgba(239,68,68,0.15)';
                  borderCol = 'var(--danger)';
                  textCol = 'var(--danger)';
                } else if (hasAnswer) {
                  bg = 'var(--accent-light)';
                  textCol = 'var(--accent)';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => goToQuestion(i)}
                    className="w-full aspect-square rounded-lg text-sm font-bold flex items-center justify-center cursor-pointer transition-all duration-200"
                    style={{
                      backgroundColor: bg,
                      border: `2px solid ${borderCol}`,
                      color: textCol,
                    }}
                    aria-label={`Question ${i + 1}${hasAnswer ? ', answered' : ', not answered'}${isActive ? ', current' : ''}`}
                    aria-current={isActive ? 'true' : undefined}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main question area */}
        <div className="lg:col-span-3 order-1 lg:order-2">
          <div
            className="rounded-xl p-6 a11y-transition"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--card-shadow)',
            }}
          >
            {/* Question header */}
            <div className="flex items-start gap-3 mb-6">
              <span
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: '#ffffff',
                }}
              >
                {currentIndex + 1}
              </span>
              <h3 className="text-lg font-bold pt-1" style={{ color: 'var(--text-primary)' }}>
                {currentQuestion.text}
              </h3>
            </div>

            {/* Options */}
            <fieldset className="space-y-3 mb-6">
              <legend className="sr-only">Select your answer for question {currentIndex + 1}</legend>
              {currentQuestion.options.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all duration-200"
                  style={getOptionStyle(currentQuestion, option.id)}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={option.id}
                    checked={answers[currentQuestion.id] === option.id}
                    onChange={() => selectAnswer(currentQuestion.id, option.id)}
                    disabled={isSubmitted}
                    className="sr-only"
                  />
                  <span
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2"
                    style={{
                      borderColor: answers[currentQuestion.id] === option.id ? 'var(--accent)' : 'var(--border-color)',
                      backgroundColor: answers[currentQuestion.id] === option.id ? 'var(--accent)' : 'transparent',
                      color: answers[currentQuestion.id] === option.id ? '#ffffff' : 'var(--text-secondary)',
                    }}
                  >
                    {option.id.toUpperCase()}
                  </span>
                  <span className="flex-1 text-sm font-medium">{option.text}</span>
                  {isSubmitted && option.id === currentQuestion.correctAnswer && (
                    <CheckCircle2 size={20} style={{ color: 'var(--success)' }} aria-label="Correct answer" />
                  )}
                  {isSubmitted && answers[currentQuestion.id] === option.id && option.id !== currentQuestion.correctAnswer && (
                    <XCircle size={20} style={{ color: 'var(--danger)' }} aria-label="Your incorrect answer" />
                  )}
                </label>
              ))}
            </fieldset>

            {/* Explanation */}
            {isSubmitted && (
              <div>
                <button
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="flex items-center gap-2 text-sm font-medium cursor-pointer mb-3"
                  style={{ color: 'var(--accent)' }}
                  aria-expanded={showExplanation}
                >
                  <HelpCircle size={16} aria-hidden="true" />
                  {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
                </button>
                {showExplanation && (
                  <div
                    className="p-4 rounded-lg text-sm"
                    style={{
                      backgroundColor: 'var(--accent-light)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    {currentQuestion.explanation}
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-color)',
                }}
              >
                Previous
              </button>

              <div className="flex items-center gap-3">
                {!isSubmitted && totalAnswered === questions.length && (
                  <button
                    onClick={handleSubmit}
                    className="px-5 py-2 rounded-lg text-sm font-bold cursor-pointer"
                    style={{
                      backgroundColor: 'var(--success)',
                      color: '#ffffff',
                    }}
                  >
                    Submit Quiz
                  </button>
                )}
                {currentIndex < questions.length - 1 && (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer"
                    style={{
                      backgroundColor: 'var(--accent)',
                      color: '#ffffff',
                    }}
                  >
                    Next
                    <ArrowRight size={16} aria-hidden="true" />
                  </button>
                )}
                {!isSubmitted && currentIndex === questions.length - 1 && totalAnswered < questions.length && (
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Answer all questions to submit
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

