import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useProfile } from '../context/ProfileContext';
import {
  FileQuestion,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Save,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export default function FresherTest() {
  const navigate = useNavigate();
  const { profile, setProfile } = useProfile();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Active quiz state
  const [activeCategory, setActiveCategory] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [savingScore, setSavingScore] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Fetch test categories from backend catalog
  useEffect(() => {
    let isMounted = true;
    const fetchCatalog = async () => {
      try {
        const res = await axios.get('/api/fresher/catalog');
        if (isMounted && res.data?.test_categories) {
          setCategories(res.data.test_categories);
        }
      } catch (err) {
        console.warn('Could not load test categories from server', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter categories by search
  const filteredCategories = categories.filter((cat) => {
    const q = searchQuery.toLowerCase();
    return (
      cat.name.toLowerCase().includes(q) ||
      cat.displayName.toLowerCase().includes(q) ||
      cat.description.toLowerCase().includes(q)
    );
  });

  const handleStartQuiz = (category) => {
    if (category.status !== 'live') return;
    setActiveCategory(category);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setQuizSubmitted(false);
    setSaveSuccess(false);
  };

  const handleSelectOption = (questionId, optionIndex) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  // Calculate score
  const calculateScore = () => {
    if (!activeCategory || !activeCategory.questions) return 0;
    let correctCount = 0;
    activeCategory.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctIndex) {
        correctCount += 1;
      }
    });
    return correctCount;
  };

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
  };

  // Save score to candidate profile
  const handleSaveScoreToProfile = async () => {
    if (!activeCategory) return;
    setSavingScore(true);
    const score = calculateScore();
    const total = activeCategory.questions.length;
    const passed = score >= Math.ceil(total * 0.6);

    try {
      const res = await axios.post('/api/profile/quiz-score', {
        profile_id: profile.profile_id,
        category: activeCategory.name,
        score,
        total,
        passed,
      });

      if (res.data && res.data.profile) {
        setProfile((prev) => ({
          ...prev,
          ...res.data.profile,
        }));
        setSaveSuccess(true);
      }
    } catch (err) {
      console.error('Failed to save score to profile', err);
    } finally {
      setSavingScore(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded">
              <FileQuestion className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
              Skills Assessment &amp; Quiz
            </h1>
          </div>
          <p className="text-xs text-neutral-500">
            Take 5-minute foundational skill quizzes. Scores are verified and saved directly into your profile.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/fresher"
            className="text-xs text-neutral-600 hover:text-black font-medium border border-neutral-300 px-3 py-1.5 rounded transition-colors"
          >
            ← Fresher Overview
          </Link>
          <Link
            to="/fresher/prepare"
            className="text-xs bg-black text-white hover:bg-neutral-800 font-medium px-3.5 py-1.5 rounded transition-colors flex items-center gap-1"
          >
            <span>Practice &amp; Prepare</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Main Content: Quiz Active OR Category Selection */}
      {!activeCategory ? (
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assessment categories (e.g. Backend, Cloud, AI/ML, Embedded)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs font-medium border border-neutral-300 rounded-lg bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm"
            />
          </div>

          {/* Categories Grid (Backend, Cloud, AI/ML live, Embedded coming soon) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCategories.map((cat) => {
              const isLive = cat.status === 'live';
              return (
                <div
                  key={cat.id}
                  onClick={() => isLive && handleStartQuiz(cat)}
                  className={`p-5 rounded-lg border transition-all flex flex-col justify-between h-48 ${
                    isLive
                      ? 'border-neutral-200 hover:border-black bg-white shadow-sm cursor-pointer group'
                      : 'border-neutral-200 bg-neutral-50/70 opacity-75 cursor-not-allowed'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-xs font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded">
                        {cat.name}
                      </span>
                      {isLive ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                          Live (5 MCQs)
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-neutral-200 text-neutral-600 rounded">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
                      {cat.displayName}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-neutral-100 text-xs">
                    <span className="text-neutral-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-neutral-400" />
                      ~{cat.estimated_minutes || 10} mins
                    </span>
                    {isLive ? (
                      <span className="text-blue-600 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        Start Quiz (5 Questions) <ChevronRight className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="text-neutral-400 font-medium">In Development</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ═════════════════════════════════════════════════════════════
           QUIZ RUNNER INTERFACE
           ═════════════════════════════════════════════════════════════ */
        <div className="space-y-6">
          {/* Quiz Header Bar */}
          <div className="flex items-center justify-between bg-neutral-50 border border-neutral-200 p-4 rounded-lg">
            <div>
              <div className="text-xs text-neutral-500 font-medium">Active Assessment</div>
              <div className="text-base font-bold text-neutral-900">
                {activeCategory.displayName} (5 MCQ Quiz)
              </div>
            </div>
            <button
              onClick={() => setActiveCategory(null)}
              className="text-xs text-neutral-600 hover:text-black border border-neutral-300 px-3 py-1.5 rounded bg-white transition-colors cursor-pointer"
            >
              Exit Quiz
            </button>
          </div>

          {!quizSubmitted ? (
            /* Active Question Card */
            <div className="p-6 border border-neutral-200 rounded-lg bg-white shadow-sm space-y-6">
              {/* Progress Tracker */}
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-600 border-b border-neutral-100 pb-3">
                <span>
                  Question {currentQuestionIndex + 1} of {activeCategory.questions.length}
                </span>
                <span className="text-blue-600">
                  {Object.keys(userAnswers).length} answered
                </span>
              </div>

              {/* Question Text */}
              {(() => {
                const q = activeCategory.questions[currentQuestionIndex];
                return (
                  <div className="space-y-4">
                    <h2 className="text-base font-bold text-neutral-900 leading-snug">
                      {q.id}. {q.question}
                    </h2>

                    {/* Options List */}
                    <div className="space-y-2.5 pt-2">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = userAnswers[q.id] === optIdx;
                        return (
                          <div
                            key={optIdx}
                            onClick={() => handleSelectOption(q.id, optIdx)}
                            className={`p-3.5 rounded-lg border text-xs font-medium cursor-pointer transition-all flex items-center justify-between ${
                              isSelected
                                ? 'border-blue-600 bg-blue-50/60 text-blue-900 font-semibold shadow-xs'
                                : 'border-neutral-200 hover:border-neutral-400 bg-white text-neutral-800'
                            }`}
                          >
                            <span>{opt}</span>
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                                isSelected
                                  ? 'border-blue-600 bg-blue-600 text-white'
                                  : 'border-neutral-300'
                              }`}
                            >
                              {isSelected && '✓'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* Navigation & Submit Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                <button
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="px-4 py-2 text-xs font-medium border border-neutral-300 rounded text-neutral-700 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Previous
                </button>

                {currentQuestionIndex < activeCategory.questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                    className="px-4 py-2 text-xs font-semibold bg-neutral-900 hover:bg-black text-white rounded cursor-pointer"
                  >
                    Next Question
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(userAnswers).length < activeCategory.questions.length}
                    className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded shadow-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Submit Quiz &amp; Calculate Score
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* ═════════════════════════════════════════════════════════════
               QUIZ RESULTS & PROFILE SAVE
               ═════════════════════════════════════════════════════════════ */
            <div className="p-6 border border-neutral-200 rounded-lg bg-white shadow-sm space-y-6">
              {(() => {
                const score = calculateScore();
                const total = activeCategory.questions.length;
                const pct = Math.round((score / total) * 100);
                const passed = pct >= 60;

                return (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-neutral-50 border border-neutral-200 rounded-lg">
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                          Assessment Result
                        </span>
                        <div className="text-2xl font-black text-neutral-900">
                          {score} / {total} Correct ({pct}%)
                        </div>
                        <p className="text-xs text-neutral-600">
                          {passed
                            ? 'Congratulations! You have demonstrated core competency in this category.'
                            : 'Review the explanations below and practice before re-attempting.'}
                        </p>
                      </div>

                      <div className="flex flex-col sm:items-end gap-2 shrink-0">
                        <span
                          className={`px-3 py-1 text-xs font-bold rounded flex items-center gap-1.5 ${
                            passed
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}
                        >
                          {passed ? '✓ Passed (Competency Verified)' : 'Needs Practice'}
                        </span>

                        {saveSuccess ? (
                          <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Saved to profile JSON!
                          </span>
                        ) : (
                          <button
                            onClick={handleSaveScoreToProfile}
                            disabled={savingScore}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                          >
                            <Save className="w-3.5 h-3.5 text-blue-200" />
                            <span>{savingScore ? 'Saving...' : 'Save Score to Profile'}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Question by Question Review */}
                    <div className="space-y-4 pt-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700 border-b border-neutral-100 pb-2">
                        Question Breakdown &amp; Explanations
                      </h3>
                      {activeCategory.questions.map((q, idx) => {
                        const userChoice = userAnswers[q.id];
                        const isCorrect = userChoice === q.correctIndex;

                        return (
                          <div
                            key={q.id}
                            className={`p-4 rounded-lg border text-xs space-y-2 ${
                              isCorrect
                                ? 'border-emerald-200 bg-emerald-50/40'
                                : 'border-rose-200 bg-rose-50/40'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-bold text-neutral-900">
                                {idx + 1}. {q.question}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                                  isCorrect
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {isCorrect ? 'Correct' : 'Incorrect'}
                              </span>
                            </div>

                            <div className="text-neutral-700 space-y-0.5">
                              <div>
                                Your Answer:{' '}
                                <span className={isCorrect ? 'font-semibold text-emerald-800' : 'font-semibold text-rose-800'}>
                                  {userChoice !== undefined ? q.options[userChoice] : 'Not answered'}
                                </span>
                              </div>
                              {!isCorrect && (
                                <div className="text-neutral-800">
                                  Correct Answer:{' '}
                                  <span className="font-semibold text-emerald-800">
                                    {q.options[q.correctIndex]}
                                  </span>
                                </div>
                              )}
                            </div>

                            {q.explanation && (
                              <p className="text-[11px] text-neutral-600 bg-white/80 p-2 rounded border border-neutral-200/80 leading-relaxed">
                                <strong>Explanation:</strong> {q.explanation}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Bottom Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                      <button
                        onClick={() => handleStartQuiz(activeCategory)}
                        className="px-4 py-2 border border-neutral-300 rounded text-xs font-semibold text-neutral-800 hover:bg-neutral-50 flex items-center gap-1.5 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Re-attempt Quiz
                      </button>

                      <button
                        onClick={() => setActiveCategory(null)}
                        className="px-4 py-2 bg-black hover:bg-neutral-800 text-white rounded text-xs font-semibold cursor-pointer"
                      >
                        Back to Test Categories
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
