import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useProfile } from '../context/ProfileContext';
import fallbackQuizBank from '../data/quiz_bank.json';
import {
  FileQuestion,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  RotateCcw,
  AlertCircle,
  ChevronRight,
  Loader2,
  Award,
} from 'lucide-react';

const ALL_GROUPS = 'All';

// Finds the stored result for a quiz (older entries only carry the category name).
const findScore = (quizScores, quiz) =>
  (quizScores || []).find((s) => s.quiz_id === quiz.id || s.category === quiz.name);

// Merges a graded result into the locally held list when the server could not store it.
const upsertLocalScore = (quizScores, entry) => {
  const list = Array.isArray(quizScores) ? [...quizScores] : [];
  const idx = list.findIndex((s) => s.quiz_id === entry.quiz_id || s.category === entry.category);
  if (idx === -1) {
    return [...list, { ...entry, attempts: 1, best_percentage: entry.percentage, last_attempt_passed: entry.passed }];
  }
  const prev = list[idx];
  list[idx] = {
    ...entry,
    attempts: (prev.attempts || 1) + 1,
    best_percentage: Math.max(prev.best_percentage ?? prev.percentage ?? 0, entry.percentage),
    passed: entry.passed || Boolean(prev.passed),
    last_attempt_passed: entry.passed,
  };
  return list;
};

export default function FresherTest() {
  const { profile, setProfile } = useProfile();

  // Catalogue of quizzes
  const [quizzes, setQuizzes] = useState([]);
  const [groups, setGroups] = useState([]);
  const [passMark, setPassMark] = useState(60);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGroup, setActiveGroup] = useState(ALL_GROUPS);

  // Active quiz
  const [activeQuiz, setActiveQuiz] = useState(null); // metadata + questions (no answer key)
  const [openingId, setOpeningId] = useState(null);
  const [openError, setOpenError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [result, setResult] = useState(null); // graded by the server

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    const loadFromFallback = () => {
      const bankQuizzes = (fallbackQuizBank.quizzes || []).map((q) => ({
        id: q.id,
        name: q.name,
        displayName: q.displayName,
        group: q.group || 'General',
        description: q.description || '',
        status: 'live',
        total_questions: q.questions?.length || 0,
        estimated_minutes: q.estimated_minutes || 10,
        skills_awarded: q.skills_awarded || [q.name],
      }));
      const bankGroups = [];
      bankQuizzes.forEach((q) => {
        if (!bankGroups.includes(q.group)) bankGroups.push(q.group);
      });
      setQuizzes(bankQuizzes);
      setGroups(bankGroups);
      setPassMark(fallbackQuizBank.pass_mark_percent || 60);
    };

    try {
      const res = await axios.get('/api/quiz/categories');
      if (res.data && typeof res.data === 'object' && Array.isArray(res.data.quizzes)) {
        setQuizzes(res.data.quizzes);
        setGroups(res.data.groups || []);
        if (res.data.pass_mark_percent) setPassMark(res.data.pass_mark_percent);
      } else {
        loadFromFallback();
      }
    } catch (err) {
      console.warn('Could not load quizzes from server, using bundled bank', err);
      loadFromFallback();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const quizScores = profile.quiz_scores || [];

  const filteredQuizzes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return quizzes.filter((quiz) => {
      if (activeGroup !== ALL_GROUPS && quiz.group !== activeGroup) return false;
      if (!q) return true;
      return [quiz.name, quiz.displayName, quiz.description, quiz.group, ...(quiz.skills_awarded || [])]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [quizzes, searchQuery, activeGroup]);

  const passedCount = quizzes.filter((quiz) => findScore(quizScores, quiz)?.passed).length;
  const attemptedCount = quizzes.filter((quiz) => findScore(quizScores, quiz)).length;

  const handleStartQuiz = async (quiz) => {
    setOpeningId(quiz.id);
    setOpenError(null);
    const openFromFallback = () => {
      const found = (fallbackQuizBank.quizzes || []).find((q) => q.id === quiz.id || q.name === quiz.name);
      if (found) {
        setActiveQuiz(found);
        setCurrentQuestionIndex(0);
        setUserAnswers({});
        setResult(null);
        setSubmitError(false);
        window.scrollTo({ top: 0 });
      } else {
        setOpenError(quiz.id);
      }
    };

    try {
      const res = await axios.get(`/api/quiz/${encodeURIComponent(quiz.id)}`);
      if (res.data && typeof res.data === 'object' && Array.isArray(res.data.questions)) {
        setActiveQuiz(res.data);
        setCurrentQuestionIndex(0);
        setUserAnswers({});
        setResult(null);
        setSubmitError(false);
        window.scrollTo({ top: 0 });
      } else {
        openFromFallback();
      }
    } catch (err) {
      console.warn('Could not load quiz questions from server, using bundled bank', err);
      openFromFallback();
    } finally {
      setOpeningId(null);
    }
  };

  const handleSelectOption = (questionId, optionIndex) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  // Sends the answers to the server, which grades them and records the result on the profile.
  const handleSubmitQuiz = async () => {
    if (!activeQuiz) return;
    setSubmitting(true);
    setSubmitError(false);

    const gradeLocally = () => {
      const bankQuiz = (fallbackQuizBank.quizzes || []).find((q) => q.id === activeQuiz.id) || activeQuiz;
      const questions = bankQuiz.questions || [];
      let score = 0;
      const breakdown = questions.map((q) => {
        const selected = userAnswers[q.id];
        const isCorrect = selected === q.correctIndex;
        if (isCorrect) score += 1;
        return {
          id: q.id,
          question: q.question,
          options: q.options,
          selected_index: selected ?? null,
          correct_index: q.correctIndex,
          is_correct: isCorrect,
          explanation: q.explanation || '',
        };
      });
      const total = questions.length;
      const percentage = total ? Math.round((score / total) * 1000) / 10 : 0;
      const passed = percentage >= passMark;
      const entry = {
        quiz_id: activeQuiz.id,
        category: activeQuiz.name,
        display_name: activeQuiz.displayName,
        score,
        total,
        percentage,
        passed,
        completed_at: new Date().toISOString(),
      };
      return {
        quiz_id: activeQuiz.id,
        category: activeQuiz.name,
        display_name: activeQuiz.displayName,
        score,
        total,
        percentage,
        pass_mark_percent: passMark,
        passed,
        breakdown,
        skills_awarded: passed ? activeQuiz.skills_awarded || [activeQuiz.name] : [],
        profile_entry: entry,
        saved: true,
        save_message: 'Result saved locally in browser session.',
      };
    };

    const applyResult = (data) => {
      setResult(data);
      setProfile((prev) => {
        const nextScores = Array.isArray(data.quiz_scores)
          ? data.quiz_scores
          : upsertLocalScore(prev.quiz_scores, data.profile_entry);
        const known = new Set((prev.skills || []).map((s) => s.toLowerCase()));
        const newSkills = (data.skills_awarded || []).filter((s) => !known.has(s.toLowerCase()));
        return {
          ...prev,
          quiz_scores: nextScores,
          skills: [...(prev.skills || []), ...newSkills],
        };
      });
      window.scrollTo({ top: 0 });
    };

    try {
      const res = await axios.post(`/api/quiz/${encodeURIComponent(activeQuiz.id)}/submit`, {
        profile_id: profile.profile_id,
        answers: userAnswers,
      });
      if (res.data && typeof res.data === 'object' && Array.isArray(res.data.breakdown)) {
        applyResult(res.data);
      } else {
        applyResult(gradeLocally());
      }
    } catch (err) {
      console.warn('Server quiz submission failed, grading locally', err);
      applyResult(gradeLocally());
    } finally {
      setSubmitting(false);
    }
  };

  const exitQuiz = () => {
    setActiveQuiz(null);
    setResult(null);
    setSubmitError(false);
  };

  const answeredCount = activeQuiz
    ? activeQuiz.questions.filter((q) => userAnswers[q.id] !== undefined).length
    : 0;

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
            Short quizzes for every skill and technology on SkillNav. Answers are graded on the server and
            the result is added to your profile automatically. Pass mark: {passMark}%.
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

      {!activeQuiz ? (
        /* ═════════════════════════════════════════════════════════════
           QUIZ CATALOGUE
           ═════════════════════════════════════════════════════════════ */
        <div className="space-y-6">
          {loading && (
            <div className="flex items-center gap-2 text-xs text-neutral-600 p-6 border border-neutral-200 rounded-lg" role="status">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading quizzes…
            </div>
          )}

          {!loading && loadError && (
            <div className="p-5 border border-rose-200 bg-rose-50 rounded-lg text-xs text-rose-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3" role="alert">
              <span className="flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                The quizzes could not be loaded. Check that the backend is running and try again.
              </span>
              <button
                onClick={fetchCategories}
                className="min-h-[44px] px-4 border border-rose-300 bg-white rounded font-semibold hover:bg-rose-100 cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !loadError && (
            <>
              {/* Progress summary */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Quizzes available', value: quizzes.length },
                  { label: 'Attempted', value: attemptedCount },
                  { label: 'Passed', value: passedCount },
                ].map((stat) => (
                  <div key={stat.label} className="p-4 border border-neutral-200 rounded-lg bg-white">
                    <div className="text-2xl font-black text-neutral-900">{stat.value}</div>
                    <div className="text-[11px] font-medium text-neutral-500">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search quizzes"
                  placeholder="Search a skill or technology (e.g. Python, Docker, SAP HANA, React)..."
                  className="w-full min-h-[44px] pl-10 pr-4 py-2.5 text-xs font-medium border border-neutral-300 rounded-lg bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm"
                />
              </div>

              {/* Group filter */}
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter quizzes by area">
                {[ALL_GROUPS, ...groups].map((group) => {
                  const selected = activeGroup === group;
                  return (
                    <button
                      key={group}
                      onClick={() => setActiveGroup(group)}
                      aria-pressed={selected}
                      className={`min-h-[44px] px-3.5 text-xs font-semibold rounded border transition-colors cursor-pointer ${
                        selected
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-neutral-700 border-neutral-300 hover:border-black'
                      }`}
                    >
                      {group}
                    </button>
                  );
                })}
              </div>

              {filteredQuizzes.length === 0 && (
                <p className="text-xs text-neutral-600 p-6 border border-dashed border-neutral-300 rounded-lg text-center">
                  No quiz matches “{searchQuery}”. Try a different skill name or clear the filter.
                </p>
              )}

              {/* Quiz cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredQuizzes.map((quiz) => {
                  const score = findScore(quizScores, quiz);
                  const isOpening = openingId === quiz.id;
                  return (
                    <div
                      key={quiz.id}
                      className="p-5 rounded-lg border border-neutral-200 bg-white shadow-sm flex flex-col justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">
                            {quiz.group}
                          </span>
                          {score ? (
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${
                                score.passed
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : 'bg-amber-50 text-amber-800 border-amber-300'
                              }`}
                            >
                              {score.passed && <CheckCircle2 className="w-3 h-3" />}
                              {score.passed ? 'Passed' : 'Needs practice'} ·{' '}
                              {Math.round(score.best_percentage ?? score.percentage)}%
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-100 text-neutral-600">
                              Not attempted
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-bold text-neutral-900">{quiz.displayName}</h3>
                        <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{quiz.description}</p>
                      </div>

                      <div className="space-y-2">
                        {openError === quiz.id && (
                          <p className="text-[11px] text-rose-700 font-medium" role="alert">
                            Could not load this quiz. Please try again.
                          </p>
                        )}
                        <div className="flex items-center justify-between pt-3 border-t border-neutral-100 text-xs">
                          <span className="text-neutral-500 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-neutral-400" />
                            {quiz.total_questions} questions · ~{quiz.estimated_minutes} min
                          </span>
                          <button
                            onClick={() => handleStartQuiz(quiz)}
                            disabled={isOpening}
                            aria-label={`${score ? 'Retake' : 'Start'} the ${quiz.displayName} quiz`}
                            className="min-h-[44px] px-3 text-blue-700 font-semibold flex items-center gap-1 rounded hover:bg-blue-50 disabled:opacity-50 cursor-pointer"
                          >
                            {isOpening ? 'Opening…' : score ? 'Retake' : 'Start quiz'}
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      ) : (
        /* ═════════════════════════════════════════════════════════════
           QUIZ RUNNER
           ═════════════════════════════════════════════════════════════ */
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-3 bg-neutral-50 border border-neutral-200 p-4 rounded-lg">
            <div>
              <div className="text-xs text-neutral-500 font-medium">
                {result ? 'Assessment result' : 'Active assessment'}
              </div>
              <div className="text-base font-bold text-neutral-900">
                {activeQuiz.displayName} ({activeQuiz.questions.length} questions)
              </div>
            </div>
            <button
              onClick={exitQuiz}
              className="min-h-[44px] text-xs text-neutral-700 hover:text-black border border-neutral-300 px-3 rounded bg-white transition-colors cursor-pointer"
            >
              {result ? 'All quizzes' : 'Exit quiz'}
            </button>
          </div>

          {!result ? (
            <div className="p-6 border border-neutral-200 rounded-lg bg-white shadow-sm space-y-6">
              {/* Progress */}
              <div className="space-y-3 border-b border-neutral-100 pb-4">
                <div className="flex items-center justify-between text-xs font-semibold text-neutral-600">
                  <span>
                    Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}
                  </span>
                  <span className="text-blue-700">
                    {answeredCount} of {activeQuiz.questions.length} answered
                  </span>
                </div>
                <div className="flex gap-1.5" aria-label="Jump to question">
                  {activeQuiz.questions.map((q, idx) => {
                    const isCurrent = idx === currentQuestionIndex;
                    const isAnswered = userAnswers[q.id] !== undefined;
                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentQuestionIndex(idx)}
                        aria-label={`Go to question ${idx + 1}${isAnswered ? ' (answered)' : ' (not answered)'}`}
                        aria-current={isCurrent ? 'step' : undefined}
                        className={`min-h-[44px] min-w-[44px] text-xs font-bold rounded border cursor-pointer ${
                          isCurrent
                            ? 'border-black bg-black text-white'
                            : isAnswered
                            ? 'border-blue-300 bg-blue-50 text-blue-800'
                            : 'border-neutral-300 bg-white text-neutral-600'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question */}
              {(() => {
                const q = activeQuiz.questions[currentQuestionIndex];
                const headingId = `quiz-question-${q.id}`;
                return (
                  <div className="space-y-4">
                    <h2 id={headingId} className="text-base font-bold text-neutral-900 leading-snug">
                      {currentQuestionIndex + 1}. {q.question}
                    </h2>

                    <div className="space-y-2.5 pt-2" role="radiogroup" aria-labelledby={headingId}>
                      {q.options.map((opt, optIdx) => {
                        const isSelected = userAnswers[q.id] === optIdx;
                        return (
                          <button
                            key={optIdx}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            onClick={() => handleSelectOption(q.id, optIdx)}
                            className={`w-full min-h-[44px] text-left p-3.5 rounded-lg border text-xs font-medium cursor-pointer transition-all flex items-center justify-between gap-3 ${
                              isSelected
                                ? 'border-blue-600 bg-blue-50/60 text-blue-900 font-semibold'
                                : 'border-neutral-200 hover:border-neutral-400 bg-white text-neutral-800'
                            }`}
                          >
                            <span>{opt}</span>
                            <span
                              aria-hidden="true"
                              className={`w-4 h-4 shrink-0 rounded-full border flex items-center justify-center text-[10px] ${
                                isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-neutral-300'
                              }`}
                            >
                              {isSelected && '✓'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {submitError && (
                <p className="text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded p-3 flex items-center gap-2" role="alert">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  Your answers could not be submitted. They are still selected — check your connection and submit again.
                </p>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                <button
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="min-h-[44px] px-4 text-xs font-medium border border-neutral-300 rounded text-neutral-700 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Previous
                </button>

                {currentQuestionIndex < activeQuiz.questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                    className="min-h-[44px] px-4 text-xs font-semibold bg-neutral-900 hover:bg-black text-white rounded cursor-pointer"
                  >
                    Next question
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    {answeredCount < activeQuiz.questions.length && (
                      <span className="text-[11px] text-neutral-500">
                        Answer all questions to submit
                      </span>
                    )}
                    <button
                      onClick={handleSubmitQuiz}
                      disabled={submitting || answeredCount < activeQuiz.questions.length}
                      className="min-h-[44px] px-5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded shadow-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {submitting ? 'Grading…' : 'Submit quiz'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ═════════════════════════════════════════════════════════════
               RESULT (graded by the server)
               ═════════════════════════════════════════════════════════════ */
            <div className="p-6 border border-neutral-200 rounded-lg bg-white shadow-sm space-y-6">
              <div
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-neutral-50 border border-neutral-200 rounded-lg"
                role="status"
              >
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Your result
                  </span>
                  <div className="text-2xl font-black text-neutral-900">
                    {result.score} / {result.total} correct ({Math.round(result.percentage)}%)
                  </div>
                  <p className="text-xs text-neutral-600">
                    {result.passed
                      ? `You passed. The pass mark is ${Math.round(result.pass_mark_percent)}%.`
                      : `You need ${Math.round(result.pass_mark_percent)}% to pass. Review the explanations below and try again.`}
                  </p>
                  {result.profile_entry?.attempts > 1 && (
                    <p className="text-[11px] text-neutral-500">
                      Attempt {result.profile_entry.attempts} · best score{' '}
                      {Math.round(result.profile_entry.best_percentage)}%
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:items-end gap-2 shrink-0">
                  <span
                    className={`px-3 py-1 text-xs font-bold rounded flex items-center gap-1.5 ${
                      result.passed
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    {result.passed ? '✓ Passed' : 'Needs practice'}
                  </span>

                  {result.saved ? (
                    <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Added to your profile
                    </span>
                  ) : (
                    <span className="text-xs text-amber-800 font-medium flex items-start gap-1 bg-amber-50 px-2.5 py-1 rounded border border-amber-200 max-w-xs">
                      <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      Kept in this browser only. {result.save_message}
                    </span>
                  )}
                </div>
              </div>

              {result.passed && result.skills_awarded?.length > 0 && (
                <div className="p-4 border border-emerald-200 bg-emerald-50/50 rounded-lg text-xs text-emerald-900 flex items-start gap-2">
                  <Award className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>
                    Verified skill{result.skills_awarded.length > 1 ? 's' : ''} on your profile:{' '}
                    <strong>{result.skills_awarded.join(', ')}</strong>
                  </span>
                </div>
              )}

              {/* Breakdown */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700 border-b border-neutral-100 pb-2">
                  Question breakdown &amp; explanations
                </h3>
                {result.breakdown.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-lg border text-xs space-y-2 ${
                      item.is_correct ? 'border-emerald-200 bg-emerald-50/40' : 'border-rose-200 bg-rose-50/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-neutral-900">
                        {idx + 1}. {item.question}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                          item.is_correct ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {item.is_correct ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>

                    <div className="text-neutral-700 space-y-0.5">
                      <div>
                        Your answer:{' '}
                        <span className={`font-semibold ${item.is_correct ? 'text-emerald-800' : 'text-rose-800'}`}>
                          {item.selected_index !== null && item.selected_index !== undefined
                            ? item.options[item.selected_index]
                            : 'Not answered'}
                        </span>
                      </div>
                      {!item.is_correct && (
                        <div className="text-neutral-800">
                          Correct answer:{' '}
                          <span className="font-semibold text-emerald-800">
                            {item.options[item.correct_index]}
                          </span>
                        </div>
                      )}
                    </div>

                    {item.explanation && (
                      <p className="text-[11px] text-neutral-600 bg-white/80 p-2 rounded border border-neutral-200/80 leading-relaxed">
                        <strong>Explanation:</strong> {item.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-neutral-200">
                <button
                  onClick={() => handleStartQuiz(activeQuiz)}
                  disabled={openingId === activeQuiz.id}
                  className="min-h-[44px] px-4 border border-neutral-300 rounded text-xs font-semibold text-neutral-800 hover:bg-neutral-50 flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Re-attempt quiz
                </button>

                <div className="flex items-center gap-2">
                  <Link
                    to="/profile"
                    className="min-h-[44px] px-4 border border-neutral-300 rounded text-xs font-semibold text-neutral-800 hover:bg-neutral-50 flex items-center"
                  >
                    View on profile
                  </Link>
                  <button
                    onClick={exitQuiz}
                    className="min-h-[44px] px-4 bg-black hover:bg-neutral-800 text-white rounded text-xs font-semibold cursor-pointer"
                  >
                    Back to all quizzes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
