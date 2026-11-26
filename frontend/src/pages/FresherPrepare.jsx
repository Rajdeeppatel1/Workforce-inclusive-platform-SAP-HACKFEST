import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useProfile } from '../context/ProfileContext';
import {
  BookOpen,
  Code2,
  ExternalLink,
  Sparkles,
  ArrowRight,
  FileQuestion,
  CheckCircle2,
  Bookmark,
  Layers,
  Youtube,
  Building2,
  PlayCircle,
  GraduationCap,
  Award,
  Search,
  Laptop,
  Terminal,
  Cpu,
  Cloud,
  Compass,
  Target,
  HelpCircle,
  Check,
  X,
  RotateCcw,
  Save,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export default function FresherPrepare() {
  const navigate = useNavigate();
  const { profile, setProfile } = useProfile();

  const [officialPortals, setOfficialPortals] = useState([]);
  const [dsaPlatforms, setDsaPlatforms] = useState([]);
  const [youtubeCreators, setYoutubeCreators] = useState([]);
  const [aimlPlatforms, setAimlPlatforms] = useState([]);
  const [practicePlatforms, setPracticePlatforms] = useState([]);
  const [learningResources, setLearningResources] = useState([]);
  const [curatedResources, setCuratedResources] = useState([]);
  const [skillQuizzes, setSkillQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState('All');
  const [sectionFilter, setSectionFilter] = useState('All');

  // Interactive Quiz state inside Prepare & Practice module
  const [activeQuizSkill, setActiveQuizSkill] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [submissionResult, setSubmissionResult] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [savingScore, setSavingScore] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Fetch from backend/data/fresher_catalog.json, /api/quiz/categories, and /api/resources
  useEffect(() => {
    let isMounted = true;
    const fetchCatalog = async () => {
      try {
        const [catRes, quizRes, resRes] = await Promise.allSettled([
          axios.get('/api/fresher/catalog'),
          axios.get('/api/quiz/categories'),
          axios.get('/api/resources'),
        ]);

        if (isMounted && catRes.status === 'fulfilled' && catRes.value.data) {
          const data = catRes.value.data;
          setOfficialPortals(data.official_portals || []);
          setDsaPlatforms(data.dsa_platforms || []);
          setYoutubeCreators(data.youtube_creators || []);
          setAimlPlatforms(data.aiml_platforms || []);
          setPracticePlatforms(data.practice_platforms || []);
          setLearningResources(data.learning_resources || []);
          if (data.skill_quizzes_20 && data.skill_quizzes_20.length > 0) {
            setSkillQuizzes(data.skill_quizzes_20);
          } else if (data.skill_quizzes && data.skill_quizzes.length > 0) {
            setSkillQuizzes(data.skill_quizzes);
          }
          if (data.resources && data.resources.length > 0) {
            setCuratedResources(data.resources);
          }
        }

        if (isMounted && resRes.status === 'fulfilled' && Array.isArray(resRes.value.data)) {
          setCuratedResources(resRes.value.data);
        }

        if (isMounted && quizRes.status === 'fulfilled' && quizRes.value.data?.quizzes) {
          setSkillQuizzes((prev) => {
            if (prev && prev.length >= 20) return prev;
            return quizRes.value.data.quizzes;
          });
        }
      } catch (err) {
        console.warn('Could not load prepare catalog from server', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

  const domainTabs = [
    'All',
    'SAP & Enterprise',
    'Cloud & DevOps',
    'DSA & Algorithms',
    'Fullstack & Backend',
    'AI / ML & Data Science',
    'Business & Project Management',
  ];

  const sectionTabs = [
    { id: 'All', label: 'All Resources' },
    { id: 'Gaps', label: '💡 Skill Gap Recommendations' },
    { id: 'Quizzes', label: '🎯 Skill Quizzes (20 Skills × 20 Questions)' },
    { id: 'Portals', label: '🏛️ Official Portals (SAP, Azure, AWS, GCP)' },
    { id: 'DSA', label: '💻 DSA Practice (LeetCode, CodeChef, GFG)' },
    { id: 'YouTube', label: '📺 Top YouTube Educators (Striver, Harry, Nana)' },
    { id: 'AIML', label: '🤖 AI / ML & Data Science Hubs' },
    { id: 'Sandboxes', label: '🛠️ Interactive Sandboxes & Standards' },
  ];

  // Candidate known skills from profile
  const userKnownSet = new Set(
    (profile?.skills || ['Python', 'FastAPI', 'SQL', 'REST APIs']).map((s) => s.toLowerCase())
  );

  // Recommendations mapped to candidate's missing skills
  const skillGapRecommendations = curatedResources
    .map((res) => {
      const missing = (res.skills || []).filter(
        (s) => !userKnownSet.has(s.toLowerCase())
      );
      return {
        ...res,
        matchingGaps: missing,
        primaryGap: missing[0] || (res.skills && res.skills[0]) || 'General Tech',
      };
    })
    .filter((res) => res.matchingGaps && res.matchingGaps.length > 0);

  const matchesSearch = (item, fields) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return fields.some((f) => (f || '').toLowerCase().includes(q));
  };

  const matchesDomain = (categoryOrTopic) => {
    if (domainFilter === 'All') return true;
    const val = (categoryOrTopic || '').toLowerCase();
    const filter = domainFilter.toLowerCase();
    if (filter === 'sap & enterprise') {
      return val.includes('sap') || val.includes('enterprise');
    }
    if (filter === 'cloud & devops') {
      return val.includes('cloud') || val.includes('devops') || val.includes('docker') || val.includes('linux') || val.includes('git');
    }
    if (filter === 'dsa & algorithms') {
      return val.includes('dsa') || val.includes('algorithm') || val.includes('problem') || val.includes('structure');
    }
    if (filter === 'fullstack & backend') {
      return val.includes('backend') || val.includes('fullstack') || val.includes('web') || val.includes('sql') || val.includes('python') || val.includes('javascript') || val.includes('database');
    }
    if (filter === 'ai / ml & data science') {
      return val.includes('ai') || val.includes('ml') || val.includes('data') || val.includes('learning') || val.includes('analytics');
    }
    if (filter === 'business & project management') {
      return val.includes('business') || val.includes('project') || val.includes('agile') || val.includes('scrum') || val.includes('accounting') || val.includes('communication');
    }
    return val.includes(filter);
  };

  const filteredQuizzes = skillQuizzes.filter((quiz) => {
    return (
      matchesDomain(quiz.category || quiz.name) &&
      matchesSearch(quiz, [quiz.name, quiz.displayName, quiz.category, quiz.description])
    );
  });

  const filteredPortals = officialPortals.filter(
    (p) =>
      matchesDomain(p.category) &&
      matchesSearch(p, [p.name, p.provider, p.description, ...(p.recommended_for || [])])
  );

  const filteredDsa = dsaPlatforms.filter(
    (d) =>
      matchesDomain(d.category) &&
      matchesSearch(d, [d.name, d.provider, d.description, ...(d.recommended_for || [])])
  );

  const filteredCreators = youtubeCreators.filter(
    (c) =>
      matchesDomain(c.category) &&
      matchesSearch(c, [c.name, c.creator, c.description, ...(c.topics || [])])
  );

  const filteredAiml = aimlPlatforms.filter(
    (a) =>
      matchesDomain(a.category) &&
      matchesSearch(a, [a.name, a.provider, a.description, ...(a.recommended_for || [])])
  );

  const filteredSandboxes = practicePlatforms.filter(
    (p) =>
      matchesDomain(p.category) &&
      matchesSearch(p, [p.name, p.category, p.description, p.badge])
  );

  const filteredDocs = learningResources.filter(
    (r) =>
      matchesDomain(r.topic) &&
      matchesSearch(r, [r.title, r.topic, r.summary, r.provider])
  );

  const totalResults =
    filteredQuizzes.length +
    filteredPortals.length +
    filteredDsa.length +
    filteredCreators.length +
    filteredAiml.length +
    filteredSandboxes.length +
    filteredDocs.length;

  // Quiz Handling
  const handleStartSkillQuiz = async (quiz) => {
    let fullQuiz = quiz;
    if (!quiz.questions || quiz.questions.length === 0) {
      try {
        const res = await axios.get(`/api/quiz/${quiz.id}`);
        if (res.data && res.data.questions) {
          fullQuiz = { ...quiz, ...res.data };
        }
      } catch (err) {
        console.warn('Could not fetch quiz questions', err);
      }
    }
    setActiveQuizSkill(fullQuiz);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setSubmissionResult(null);
    setQuizSubmitted(false);
    setSaveSuccess(false);
    setSectionFilter('Quizzes');
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleSelectOption = (questionId, optionIndex) => {
    if (quizSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [String(questionId)]: optionIndex,
    }));
  };

  const calculateScore = () => {
    if (!activeQuizSkill || !activeQuizSkill.questions) return 0;
    let correct = 0;
    activeQuizSkill.questions.forEach((q) => {
      if (userAnswers[String(q.id)] === q.correctIndex) {
        correct += 1;
      }
    });
    return correct;
  };

  const handleSubmitQuiz = async () => {
    setQuizSubmitted(true);
    setSavingScore(true);
    const clientScore = calculateScore();
    const total = activeQuizSkill?.questions?.length || 20;

    try {
      const res = await axios.post(`/api/quiz/${activeQuizSkill.id}/submit`, {
        profile_id: profile?.profile_id || 'seed_priya_sharma_01',
        answers: userAnswers,
      });
      if (res.data) {
        setSubmissionResult(res.data);
        if (res.data.quiz_scores) {
          setProfile((prev) => ({
            ...prev,
            quiz_scores: res.data.quiz_scores,
            skills: res.data.skills_added && res.data.skills_added.length > 0
              ? Array.from(new Set([...(prev.skills || []), ...res.data.skills_added]))
              : prev.skills,
          }));
        }
        setSaveSuccess(Boolean(res.data.saved));
      }
    } catch (err) {
      console.warn('Server grading submission failed, using local result', err);
      setSubmissionResult({
        score: clientScore,
        total,
        percentage: Math.round((clientScore / total) * 100),
        passed: clientScore >= Math.ceil(total * 0.6),
        breakdown: activeQuizSkill.questions.map((q) => ({
          id: q.id,
          question: q.question,
          options: q.options,
          selected_index: userAnswers[String(q.id)],
          correct_index: q.correctIndex,
          is_correct: userAnswers[String(q.id)] === q.correctIndex,
          explanation: q.explanation || '',
        })),
      });
    } finally {
      setSavingScore(false);
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded">
              <BookOpen className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
              Practice Platforms, 20-Skill Quizzes &amp; Learning Hub
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded">
              Verified Quizzes &amp; Links
            </span>
          </div>
          <p className="text-xs text-neutral-500">
            Interactive 20-question quizzes across 20 essential technical &amp; business skills, plus direct redirects to official vendor portals (SAP, Azure, AWS, GCP), DSA coding arenas (LeetCode, CodeChef), and educator channels (Striver, CodeWithHarry, Nana).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/learning-hub"
            className="min-h-[44px] text-xs text-blue-700 bg-blue-50 hover:bg-blue-100 font-semibold border border-blue-200 px-3.5 py-2 rounded-sm transition-colors flex items-center gap-1.5"
          >
            <span>Learning Hub</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/fresher"
            className="min-h-[44px] text-xs text-neutral-600 hover:text-black font-semibold border border-neutral-300 px-3.5 py-2 rounded-sm transition-colors flex items-center gap-1"
          >
            ← Fresher Overview
          </Link>
          <button
            onClick={() => {
              setActiveQuizSkill(null);
              setSectionFilter('Quizzes');
              window.scrollTo({ top: 150, behavior: 'smooth' });
            }}
            className="min-h-[44px] text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-sm transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Target className="w-4 h-4" />
            <span>20 Skill Quizzes</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="p-4 bg-white border border-neutral-200 rounded-lg shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search SQL, HTTP, Cloud, Linux, Git, Python, JS, DSA, Big-O, ML, Excel, Agile, SAP Learning Hub, LeetCode, Striver..."
              className="w-full pl-9 pr-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-sm text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all min-h-[44px]"
            />
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="min-h-[44px] px-3 text-xs text-neutral-500 hover:text-neutral-800 underline font-medium cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Section View Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-neutral-100">
          <span className="text-xs font-semibold text-neutral-500 mr-1.5 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" /> View:
          </span>
          {sectionTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setSectionFilter(tab.id);
                if (tab.id !== 'Quizzes') {
                  setActiveQuizSkill(null);
                }
              }}
              className={`min-h-[38px] px-3 py-1.5 rounded-sm text-xs font-semibold transition-all cursor-pointer ${
                sectionFilter === tab.id
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Domain Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs font-semibold text-neutral-500 mr-1.5">Domain:</span>
          {domainTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setDomainFilter(tab)}
              className={`min-h-[32px] px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer border ${
                domainFilter === tab
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════
          SECTION: Personalized Skill Gap Recommendations (aapki gap: X)
          ═════════════════════════════════════════════════════════════ */}
      {(sectionFilter === 'All' || sectionFilter === 'Gaps') && !activeQuizSkill && skillGapRecommendations.length > 0 && (
        <div className="space-y-4 pt-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-200 rounded-lg">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-blue-600 text-white rounded">
                  <Sparkles className="w-4 h-4" />
                </span>
                <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                  Targeted Skill Gap Recommendations ({skillGapRecommendations.length})
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-100 text-blue-900 rounded border border-blue-200">
                  Profile Matched
                </span>
              </div>
              <p className="text-xs text-neutral-600 mt-1">
                Learning pathways specifically chosen to close gaps identified in your candidate profile and target job roles.
              </p>
            </div>
            <Link
              to="/learning-hub"
              className="min-h-[44px] px-3.5 py-1.5 bg-neutral-900 hover:bg-black text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors shrink-0 shadow-xs"
            >
              <span>View All on Learning Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skillGapRecommendations.slice(0, 6).map((item) => {
              const isVerified = item.verified === true;
              return (
                <div
                  key={item.id}
                  className="p-5 border-2 border-blue-200 hover:border-blue-600 rounded-lg bg-white shadow-xs transition-all flex flex-col justify-between space-y-4 group hover:shadow-md"
                >
                  <div className="space-y-2.5">
                    {/* Reason Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-blue-900 bg-blue-100 px-2.5 py-0.5 rounded border border-blue-300 flex items-center gap-1">
                        <Target className="w-3 h-3 text-blue-700" />
                        aapki gap: {item.primaryGap}
                      </span>

                      {/* Verification Status */}
                      {isVerified ? (
                        <span
                          className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded flex items-center gap-1 shrink-0"
                          title="Verified link"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Verified</span>
                        </span>
                      ) : (
                        <span
                          className="text-[10px] font-bold tracking-wider px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-300 rounded flex items-center gap-1 shrink-0"
                          title="Link not yet verified"
                        >
                          <AlertCircle className="w-3 h-3 text-amber-600" />
                          <span>Link not yet verified</span>
                        </span>
                      )}
                    </div>

                    <div className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">
                      {item.provider} • {item.level} • ~{item.estHours}h
                    </div>

                    <h3 className="text-sm font-bold text-neutral-900 group-hover:text-blue-600 transition-colors leading-snug">
                      {item.title}
                    </h3>

                    <div className="text-[11px] text-neutral-700 bg-blue-50/50 p-2.5 rounded border border-blue-100">
                      <span className="font-bold text-blue-950">Reason: </span>
                      Recommended for your skill gap in <strong>{item.primaryGap}</strong>.
                    </div>

                    {item.skills && (
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {item.skills.map((skill) => {
                          const isGap = !userKnownSet.has(skill.toLowerCase());
                          return (
                            <span
                              key={skill}
                              className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                isGap
                                  ? 'bg-blue-50 text-blue-800 border border-blue-300 font-semibold'
                                  : 'bg-neutral-50 text-neutral-600 border border-neutral-200'
                              }`}
                            >
                              {skill} {isGap && '★ Gap'}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold text-neutral-500 truncate max-w-[140px]">
                      Direct Redirect
                    </span>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[44px] px-4 text-xs font-bold bg-neutral-900 hover:bg-black text-white rounded transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
                      aria-label={`Open ${item.title}`}
                    >
                      <span>Open</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════
          SECTION 0: 20 Skill Quizzes (20 Skills × 20 Questions = 400 MCQs)
          ═════════════════════════════════════════════════════════════ */}
      {(sectionFilter === 'All' || sectionFilter === 'Quizzes') && (
        <div className="space-y-6 pt-1">
          {/* Active Quiz Runner */}
          {activeQuizSkill ? (
            <div className="bg-white border-2 border-blue-600 rounded-lg p-6 shadow-md space-y-6 animate-fadeIn">
              {/* Quiz Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold uppercase rounded">
                      {activeQuizSkill.category || 'Skill Assessment'}
                    </span>
                    <span className="text-xs font-bold text-neutral-500">
                      20 Questions • 20 Minutes
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-neutral-900 mt-1">
                    {activeQuizSkill.displayName || activeQuizSkill.name}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to exit this quiz? Unsaved answers will be lost.')) {
                        setActiveQuizSkill(null);
                        setQuizSubmitted(false);
                      }
                    }}
                    className="min-h-[44px] px-3.5 py-1.5 text-xs font-semibold text-neutral-600 hover:text-black border border-neutral-300 rounded cursor-pointer transition-colors"
                  >
                    ← All 20 Skills
                  </button>
                  {!quizSubmitted && (
                    <button
                      onClick={handleSubmitQuiz}
                      className="min-h-[44px] px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold transition-colors cursor-pointer shadow-sm"
                    >
                      Submit Quiz
                    </button>
                  )}
                </div>
              </div>

              {/* Quiz Results Screen */}
              {quizSubmitted ? (
                <div className="space-y-6">
                  {(() => {
                    const score = submissionResult ? submissionResult.score : calculateScore();
                    const total = submissionResult ? submissionResult.total : (activeQuizSkill.questions?.length || 20);
                    const pct = submissionResult ? Math.round(submissionResult.percentage) : Math.round((score / total) * 100);
                    const passed = submissionResult ? submissionResult.passed : score >= Math.ceil(total * 0.6); // 60% pass mark

                    const reviewItems = submissionResult?.breakdown || activeQuizSkill.questions || [];

                    return (
                      <div className="space-y-6">
                        {/* Result Score Card */}
                        <div
                          className={`p-6 rounded-lg border flex flex-col md:flex-row items-center justify-between gap-6 ${
                            passed
                              ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                              : 'bg-amber-50/70 border-amber-300 text-amber-950'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-xl border-2 ${
                                passed
                                  ? 'bg-emerald-600 text-white border-emerald-700'
                                  : 'bg-amber-600 text-white border-amber-700'
                              }`}
                            >
                              {pct}%
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-lg font-bold">
                                  {passed ? 'Assessment Passed!' : 'Practice Recommended'}
                                </h3>
                                <span
                                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                    passed
                                      ? 'bg-emerald-200 text-emerald-900'
                                      : 'bg-amber-200 text-amber-900'
                                  }`}
                                >
                                  {passed ? 'Verified Competency (≥60%)' : 'Needs Practice (<60%)'}
                                </span>
                              </div>
                              <p className="text-xs text-neutral-600 mt-1">
                                You scored <strong>{score}</strong> out of <strong>{total}</strong> questions correctly ({pct}%).
                                {saveSuccess && ' Verified score is saved to your candidate profile.'}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2.5">
                            <button
                              onClick={handleSaveScoreToProfile}
                              disabled={savingScore || saveSuccess}
                              className={`min-h-[44px] px-4 py-2 rounded text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                                saveSuccess
                                  ? 'bg-emerald-700 text-white'
                                  : 'bg-neutral-900 hover:bg-black text-white'
                              }`}
                            >
                              {saveSuccess ? (
                                <>
                                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                                  <span>Saved to Profile!</span>
                                </>
                              ) : savingScore ? (
                                <span>Saving...</span>
                              ) : (
                                <>
                                  <Save className="w-4 h-4" />
                                  <span>Save Verified Score to Profile</span>
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => {
                                setUserAnswers({});
                                setSubmissionResult(null);
                                setQuizSubmitted(false);
                                setCurrentQuestionIndex(0);
                                setSaveSuccess(false);
                              }}
                              className="min-h-[44px] px-4 py-2 border border-neutral-300 hover:border-black rounded text-xs font-semibold text-neutral-700 hover:text-black flex items-center gap-1.5 transition-colors cursor-pointer bg-white"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Retake Quiz</span>
                            </button>

                            <button
                              onClick={() => {
                                setActiveQuizSkill(null);
                                setSubmissionResult(null);
                                setQuizSubmitted(false);
                              }}
                              className="min-h-[44px] px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded text-xs font-semibold transition-colors cursor-pointer"
                            >
                              Choose Another Skill
                            </button>
                          </div>
                        </div>

                        {/* Detailed Question Review */}
                        <div className="space-y-4">
                          <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                            <FileQuestion className="w-4 h-4 text-blue-600" />
                            Question-by-Question Review &amp; Explanations ({reviewItems.length} Questions)
                          </h4>

                          <div className="space-y-3">
                            {reviewItems.map((q, idx) => {
                              const chosen = q.selected_index !== undefined ? q.selected_index : userAnswers[String(q.id)];
                              const correctIdx = q.correct_index !== undefined ? q.correct_index : q.correctIndex;
                              const isCorrect = q.is_correct !== undefined ? q.is_correct : chosen === correctIdx;

                              return (
                                <div
                                  key={q.id || idx}
                                  className={`p-4 rounded-lg border transition-all ${
                                    isCorrect
                                      ? 'border-emerald-200 bg-emerald-50/30'
                                      : 'border-red-200 bg-red-50/20'
                                  }`}
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-start gap-2.5">
                                      <span
                                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                                          isCorrect
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-red-600 text-white'
                                        }`}
                                      >
                                        {idx + 1}
                                      </span>
                                      <div>
                                        <p className="text-xs font-bold text-neutral-900">
                                          {q.question}
                                        </p>
                                        <div className="mt-2 space-y-1">
                                          {q.options.map((opt, optIdx) => {
                                            const wasChosen = chosen === optIdx;
                                            const isThisCorrect = optIdx === correctIdx;

                                            let badgeClass = 'text-neutral-600 border-neutral-200 bg-white';
                                            if (isThisCorrect) {
                                              badgeClass = 'font-bold text-emerald-800 border-emerald-400 bg-emerald-100/70';
                                            } else if (wasChosen && !isThisCorrect) {
                                              badgeClass = 'font-bold text-red-800 border-red-400 bg-red-100/70 line-through';
                                            }

                                            return (
                                              <div
                                                key={optIdx}
                                                className={`text-[11px] p-2 rounded border flex items-center justify-between ${badgeClass}`}
                                              >
                                                <span>
                                                  <strong>{String.fromCharCode(65 + optIdx)}.</strong> {opt}
                                                </span>
                                                {isThisCorrect && (
                                                  <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                                                    <Check className="w-3 h-3" /> Correct Answer
                                                  </span>
                                                )}
                                                {wasChosen && !isThisCorrect && (
                                                  <span className="text-[10px] font-bold text-red-700 flex items-center gap-1">
                                                    <X className="w-3 h-3" /> Your Choice
                                                  </span>
                                                )}
                                              </div>
                                            );
                                          })}
                                        </div>

                                        <div className="mt-2.5 p-2.5 bg-neutral-100 rounded text-[11px] text-neutral-700 leading-relaxed">
                                          <span className="font-bold text-neutral-900">Explanation: </span>
                                          {q.explanation}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                /* Active Question Step */
                <div className="space-y-6">
                  {/* Progress Indicators */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold text-neutral-600 mb-2">
                      <span>
                        Question {currentQuestionIndex + 1} of {activeQuizSkill.questions.length}
                      </span>
                      <span>
                        Answered: {Object.keys(userAnswers).length} / {activeQuizSkill.questions.length}
                      </span>
                    </div>

                    <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-blue-600 h-2 transition-all duration-300"
                        style={{
                          width: `${((currentQuestionIndex + 1) / activeQuizSkill.questions.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Question Grid Pills for Quick Navigation */}
                  <div className="flex flex-wrap gap-1.5 p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
                    {activeQuizSkill.questions.map((q, idx) => {
                      const isAnswered = userAnswers[q.id] !== undefined;
                      const isCurrent = idx === currentQuestionIndex;

                      let pillClass = 'bg-white text-neutral-700 border-neutral-300 hover:border-blue-500';
                      if (isCurrent) {
                        pillClass = 'bg-blue-600 text-white border-blue-600 font-bold';
                      } else if (isAnswered) {
                        pillClass = 'bg-emerald-50 text-emerald-800 border-emerald-400 font-semibold';
                      }

                      return (
                        <button
                          key={q.id}
                          onClick={() => setCurrentQuestionIndex(idx)}
                          className={`w-7 h-7 rounded text-xs border flex items-center justify-center transition-all cursor-pointer ${pillClass}`}
                          title={`Question ${idx + 1}`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>

                  {/* Current Question Body */}
                  {(() => {
                    const currentQ = activeQuizSkill.questions[currentQuestionIndex];
                    if (!currentQ) return null;

                    return (
                      <div className="space-y-4">
                        <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            Question #{currentQuestionIndex + 1}
                          </span>
                          <h3 className="text-base font-bold text-neutral-900 mt-2 leading-relaxed">
                            {currentQ.question}
                          </h3>
                        </div>

                        {/* Options List */}
                        <div className="space-y-2.5">
                          {currentQ.options.map((option, optIdx) => {
                            const isSelected = userAnswers[currentQ.id] === optIdx;

                            return (
                              <button
                                key={optIdx}
                                onClick={() => handleSelectOption(currentQ.id, optIdx)}
                                className={`w-full text-left p-3.5 rounded-lg border transition-all flex items-center justify-between cursor-pointer min-h-[48px] ${
                                  isSelected
                                    ? 'border-blue-600 bg-blue-50 text-blue-950 font-bold shadow-xs'
                                    : 'border-neutral-200 hover:border-neutral-400 bg-white text-neutral-800'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <span
                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${
                                      isSelected
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-neutral-100 text-neutral-600 border-neutral-300'
                                    }`}
                                  >
                                    {String.fromCharCode(65 + optIdx)}
                                  </span>
                                  <span className="text-xs">{option}</span>
                                </div>
                                {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                              </button>
                            );
                          })}
                        </div>

                        {/* Navigation controls */}
                        <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                          <button
                            onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                            disabled={currentQuestionIndex === 0}
                            className={`min-h-[44px] px-4 py-2 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                              currentQuestionIndex === 0
                                ? 'opacity-40 cursor-not-allowed bg-neutral-100 text-neutral-400'
                                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 cursor-pointer'
                            }`}
                          >
                            <ChevronLeft className="w-4 h-4" />
                            <span>Previous</span>
                          </button>

                          {currentQuestionIndex < activeQuizSkill.questions.length - 1 ? (
                            <button
                              onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                              className="min-h-[44px] px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                            >
                              <span>Next Question</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={handleSubmitQuiz}
                              className="min-h-[44px] px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Submit 20-Question Quiz</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          ) : (
            /* 20 Skills Selection Grid */
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-600" />
                    Interactive Skill Quizzes ({filteredQuizzes.length} of 20 Skills Available)
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Each skill has 20 curated multiple-choice questions with answers, explanations, and instant verification for candidate profiles.
                  </p>
                </div>
                <span className="text-xs font-bold text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded">
                  400 Total Questions
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredQuizzes.map((quiz, idx) => (
                  <div
                    key={quiz.id || idx}
                    className="p-5 border border-neutral-200 hover:border-blue-600 rounded-lg bg-white shadow-xs transition-all flex flex-col justify-between space-y-4 group hover:shadow-md"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded truncate max-w-[180px]">
                          {quiz.category || 'Core Skill'}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded shrink-0">
                          {quiz.questions?.length || 20} MCQs
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-neutral-900 group-hover:text-blue-600 transition-colors leading-snug">
                        {quiz.displayName || quiz.name}
                      </h3>

                      <p className="text-xs text-neutral-600 leading-relaxed line-clamp-3">
                        {quiz.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                      <span className="text-[11px] font-medium text-neutral-500">
                        ⏱️ ~20 mins
                      </span>
                      <button
                        onClick={() => handleStartSkillQuiz(quiz)}
                        className="min-h-[44px] px-3.5 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <PlayCircle className="w-3.5 h-3.5" />
                        <span>Take Quiz</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════
          SECTION 1: Official Enterprise & Cloud Portals (SAP, Azure, AWS, GCP, Trailhead)
          ═════════════════════════════════════════════════════════════ */}
      {(sectionFilter === 'All' || sectionFilter === 'Portals') && !activeQuizSkill && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              Official Vendor Learning &amp; Certification Hubs ({filteredPortals.length})
            </h2>
            <span className="text-xs text-neutral-400 font-medium">Direct Vendor Portals &amp; Free Tiers</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPortals.map((portal) => (
              <div
                key={portal.id}
                className="p-5 border border-neutral-200 hover:border-neutral-900 rounded-lg bg-white shadow-xs transition-all flex flex-col justify-between space-y-4 group hover:shadow-md"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded">
                      {portal.provider}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded">
                      {portal.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-neutral-900 group-hover:text-blue-600 transition-colors leading-snug">
                    {portal.name}
                  </h3>

                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {portal.description}
                  </p>

                  {portal.recommended_for && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {portal.recommended_for.map((skill) => (
                        <span
                          key={skill}
                          className="text-[10px] bg-neutral-50 text-neutral-700 border border-neutral-200 px-2 py-0.5 rounded-full font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded truncate max-w-[160px]">
                    ✓ {portal.free_tier}
                  </span>
                  <a
                    href={portal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] px-3 text-xs font-bold bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <span>Launch Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════
          SECTION 2: DSA & Problem-Solving Coding Arenas (LeetCode, CodeChef, HackerRank, GFG, Codeforces)
          ═════════════════════════════════════════════════════════════ */}
      {(sectionFilter === 'All' || sectionFilter === 'DSA') && !activeQuizSkill && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-600" />
              DSA &amp; Problem Solving Coding Platforms ({filteredDsa.length})
            </h2>
            <span className="text-xs text-neutral-400 font-medium">Algorithmic Arenas &amp; Contest Trackers</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDsa.map((item) => (
              <div
                key={item.id}
                className="p-5 border border-neutral-200 hover:border-emerald-600 rounded-lg bg-white shadow-xs transition-all flex flex-col justify-between space-y-4 group hover:shadow-md"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {item.provider}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-neutral-900 group-hover:text-emerald-700 transition-colors leading-snug">
                    {item.name}
                  </h3>

                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {item.description}
                  </p>

                  {item.recommended_for && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.recommended_for.map((skill) => (
                        <span
                          key={skill}
                          className="text-[10px] bg-neutral-50 text-neutral-700 border border-neutral-200 px-2 py-0.5 rounded-full font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded truncate max-w-[160px]">
                    ✓ {item.free_tier}
                  </span>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] px-3 text-xs font-bold bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white rounded transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <span>Practice DSA</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════
          SECTION 3: Famous YouTube Educators & Playlists (Striver, Harry, Nana, freeCodeCamp, etc.)
          ═════════════════════════════════════════════════════════════ */}
      {(sectionFilter === 'All' || sectionFilter === 'YouTube') && !activeQuizSkill && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <Youtube className="w-4 h-4 text-red-600" />
              Famous YouTube Educators &amp; Structured Playlists ({filteredCreators.length})
            </h2>
            <span className="text-xs text-neutral-400 font-medium">Free High-Quality Video Courses</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCreators.map((creator) => (
              <div
                key={creator.id}
                className="p-5 border border-neutral-200 hover:border-red-500 rounded-lg bg-white shadow-xs transition-all flex flex-col justify-between space-y-4 group hover:shadow-md"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200 flex items-center gap-1">
                      <PlayCircle className="w-3 h-3 text-red-600" />
                      {creator.creator}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded">
                      {creator.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-neutral-900 group-hover:text-red-600 transition-colors leading-snug">
                    {creator.name}
                  </h3>

                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {creator.description}
                  </p>

                  {creator.topics && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {creator.topics.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] bg-neutral-50 text-neutral-700 border border-neutral-200 px-2 py-0.5 rounded-full font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded truncate max-w-[160px]">
                    {creator.subscribers}
                  </span>
                  <a
                    href={creator.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] px-3 text-xs font-bold bg-red-50 hover:bg-red-600 text-red-700 hover:text-white rounded transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <span>Watch Playlist</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════
          SECTION 4: AI / ML & Data Science Learning Hubs (Google AI, Kaggle, Hugging Face, fast.ai)
          ═════════════════════════════════════════════════════════════ */}
      {(sectionFilter === 'All' || sectionFilter === 'AIML') && !activeQuizSkill && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              AI / ML, LLMs &amp; Data Science Learning Hubs ({filteredAiml.length})
            </h2>
            <span className="text-xs text-neutral-400 font-medium">Model Sandboxes &amp; Hands-on Datasets</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAiml.map((item) => (
              <div
                key={item.id}
                className="p-5 border border-neutral-200 hover:border-purple-600 rounded-lg bg-white shadow-xs transition-all flex flex-col justify-between space-y-4 group hover:shadow-md"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      {item.provider}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-neutral-900 group-hover:text-purple-700 transition-colors leading-snug">
                    {item.name}
                  </h3>

                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {item.description}
                  </p>

                  {item.recommended_for && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.recommended_for.map((skill) => (
                        <span
                          key={skill}
                          className="text-[10px] bg-neutral-50 text-neutral-700 border border-neutral-200 px-2 py-0.5 rounded-full font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded truncate max-w-[160px]">
                    ✓ {item.free_tier}
                  </span>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] px-3 text-xs font-bold bg-purple-50 hover:bg-purple-600 text-purple-700 hover:text-white rounded transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <span>Explore Hub</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════
          SECTION 5: Interactive Sandboxes & Official Documentation
          ═════════════════════════════════════════════════════════════ */}
      {(sectionFilter === 'All' || sectionFilter === 'Sandboxes') && !activeQuizSkill && (
        <div className="space-y-6 pt-2">
          {/* Sandboxes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                <Laptop className="w-4 h-4 text-neutral-700" />
                Browser Sandboxes &amp; Playgrounds ({filteredSandboxes.length})
              </h2>
              <span className="text-xs text-neutral-400 font-medium">In-Browser REPLs &amp; Containers</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSandboxes.map((item) => (
                <div
                  key={item.id}
                  className="p-5 border border-neutral-200 hover:border-black rounded-lg bg-white shadow-xs transition-all flex flex-col justify-between space-y-4 group hover:shadow-md"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded">
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-neutral-900 group-hover:text-blue-600 transition-colors leading-snug">
                      {item.name}
                    </h3>

                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      ✓ Free Online
                    </span>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[44px] px-3 text-xs font-bold bg-neutral-100 hover:bg-neutral-900 text-neutral-800 hover:text-white rounded transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <span>Open Sandbox</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Standards & Guides */}
          {filteredDocs.length > 0 && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-neutral-700" />
                  Standards &amp; Production Documentation ({filteredDocs.length})
                </h2>
                <span className="text-xs text-neutral-400 font-medium">Curated Reference Material</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDocs.map((res) => (
                  <div
                    key={res.id}
                    className="p-5 border border-neutral-200 hover:border-black rounded-lg bg-white shadow-xs transition-all flex flex-col justify-between space-y-4 group hover:shadow-md"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded">
                          {res.topic}
                        </span>
                        <span className="text-[11px] text-neutral-500 font-medium">
                          {res.provider}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-neutral-900 group-hover:text-blue-600 transition-colors leading-snug">
                        {res.title}
                      </h3>

                      <p className="text-xs text-neutral-600 leading-relaxed">
                        {res.summary}
                      </p>

                      <div className="text-[11px] text-neutral-400 font-medium">
                        Type: <span className="text-neutral-700">{res.type}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                      <span className="text-[11px] text-neutral-500 font-medium">
                        Standard Reference
                      </span>
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-[44px] text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 group-hover:underline cursor-pointer"
                      >
                        <span>Read Guide</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Zero results fallback */}
      {totalResults === 0 && (
        <div className="p-8 text-center bg-white border border-neutral-200 rounded-lg space-y-2">
          <p className="text-sm font-semibold text-neutral-800">
            No resources match "{searchQuery}" under the selected filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setDomainFilter('All');
              setSectionFilter('All');
            }}
            className="min-h-[44px] px-4 py-2 bg-blue-600 text-white rounded text-xs font-semibold cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Bottom Call to Action Card */}
      <div className="p-6 bg-neutral-900 text-white rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            Ready to Validate Your Learned Skills?
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            Take a 20-question skill assessment across 20 domains to save a verified competency badge directly onto your candidate profile.
          </p>
        </div>
        <button
          onClick={() => {
            setActiveQuizSkill(null);
            setSectionFilter('Quizzes');
            window.scrollTo({ top: 150, behavior: 'smooth' });
          }}
          className="min-h-[44px] px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shrink-0"
        >
          <span>Choose a Skill Quiz (20 Skills)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}