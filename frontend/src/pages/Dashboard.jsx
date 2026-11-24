import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAccessibility } from '../context/AccessibilityContext';
import { useProfile } from '../context/ProfileContext';
import {
  TrendingUp,
  Award,
  Briefcase,
  CheckCircle2,
  Circle,
  ArrowRight,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Sliders,
  ExternalLink,
} from 'lucide-react';

const TARGET_ROLES = [
  {
    id: 'fullstack',
    title: 'Full Stack Developer',
    readiness: 68,
    gaps: [
      { name: 'Docker Containerization', hours: 6, progress: 45, level: 'Crucial' },
      { name: 'AWS Cloud Basics', hours: 8, progress: 30, level: 'Important' },
      { name: 'System Design & APIs', hours: 12, progress: 20, level: 'Recommended' },
    ],
  },
  {
    id: 'sap_btp',
    title: 'Cloud Application Developer (BTP & Python)',
    readiness: 74,
    gaps: [
      { name: 'SAP HANA Vector Queries', hours: 5, progress: 50, level: 'Crucial' },
      { name: 'Docker & Kubernetes', hours: 6, progress: 45, level: 'Important' },
      { name: 'Cloud Security / OAuth', hours: 8, progress: 30, level: 'Recommended' },
    ],
  },
  {
    id: 'ai_data',
    title: 'Data & AI Integration Specialist',
    readiness: 62,
    gaps: [
      { name: 'SAP AI Core Deployments', hours: 8, progress: 25, level: 'Crucial' },
      { name: 'Vector Embeddings Tuning', hours: 7, progress: 40, level: 'Important' },
      { name: 'RAG Pipeline Architecture', hours: 10, progress: 30, level: 'Recommended' },
    ],
  },
];

const INITIAL_CHECKLIST = [
  { id: 1, text: 'Push Dockerfile & docker-compose.yml to GitHub task manager repo', done: true },
  { id: 2, text: 'Review AWS EC2 & S3 foundational cloud concepts', done: false },
  { id: 3, text: 'Document OpenAPI / Swagger schema for portfolio projects', done: false },
];

const HANA_JOB_MATCHES = [
  {
    id: 'JOB-SAP-01',
    title: 'Cloud Application Developer (BTP & Python)',
    department: 'SAP Engineering & Platform',
    matchScore: 88,
    matchedSkills: ['Python', 'FastAPI', 'REST APIs', 'SQL'],
    missingCount: 2,
    evidenceBoost: '+15%',
  },
  {
    id: 'JOB-SAP-02',
    title: 'Full-Stack Frontend Engineer (React & UI5)',
    department: 'Experience Engineering',
    matchScore: 82,
    matchedSkills: ['React', 'JavaScript', 'REST APIs'],
    missingCount: 2,
    evidenceBoost: '+12%',
  },
  {
    id: 'JOB-SAP-03',
    title: 'Data & AI Integration Specialist',
    department: 'GenAI & Intelligent Systems',
    matchScore: 74,
    matchedSkills: ['Python', 'SQL', 'REST APIs'],
    missingCount: 3,
    evidenceBoost: '+10%',
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { settings } = useAccessibility();
  const { profile } = useProfile();

  const [selectedRoleId, setSelectedRoleId] = useState('fullstack');
  const [checklist, setChecklist] = useState(INITIAL_CHECKLIST);
  const [studyHoursPerWeek, setStudyHoursPerWeek] = useState(8);

  const currentRole = TARGET_ROLES.find((r) => r.id === selectedRoleId) || TARGET_ROLES[0];

  const totalGapHours = currentRole.gaps.reduce((acc, g) => acc + g.hours, 0);
  const estimatedWeeks = Math.max(1, Math.ceil(totalGapHours / studyHoursPerWeek));

  const toggleChecklist = (id) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  // SVG Circular progress constants
  const circleRadius = 38;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (currentRole.readiness / 100) * circumference;

  return (
    <div className="max-w-6xl mx-auto space-y-8 bg-white text-on-surface">
      {/* ═══════════════════════════════════════════════
          Top Greeting Header & Blind Pill
          ═══════════════════════════════════════════════ */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-outline">
        <div>
          <h1 className="font-display text-display-lg text-on-surface">
            {settings.language === 'hi' ? 'स्वागत है, राजदीप' : 'Welcome back, Rajdeep'}
          </h1>
          <p className="font-body text-body-md text-on-surface-muted mt-1">
            {settings.language === 'hi'
              ? 'आपकी योग्यता-आधारित प्रोफ़ाइल सक्रिय है। कोई जनसांख्यिकीय या कॉलेज पूर्वाग्रह लागू नहीं है।'
              : 'Your skills-first blind profile is active and verified across alternative evidence signals.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="sn-badge-blue">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>Blind Identity Verified</span>
          </span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          1. Three Minimal KPI Cards (#F8FAFC, 1px solid #E2E8F0)
          ═══════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPI 1: Blind Job Readiness */}
        <div className="sn-card flex items-center justify-between">
          <div className="space-y-1">
            <span className="font-label text-label-sm text-on-surface-muted block">
              {settings.language === 'hi' ? 'ब्लाइंड जॉब रेडिनेस' : 'Blind Job Readiness'}
            </span>
            <div className="font-display text-display-lg-mobile text-on-surface font-bold">
              {currentRole.readiness}%
            </div>
            <span className="inline-flex items-center gap-1 text-xs text-success font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+6% this week</span>
            </span>
          </div>

          {/* #2563EB Circular Progress Ring */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
              {/* Background Ring */}
              <circle
                cx="48"
                cy="48"
                r={circleRadius}
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="7"
              />
              {/* Active Royal Blue Ring */}
              <circle
                cx="48"
                cy="48"
                r={circleRadius}
                fill="none"
                stroke="#2563EB"
                strokeWidth="7"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <span className="absolute font-label text-label-md font-bold text-primary">
              {currentRole.readiness}%
            </span>
          </div>
        </div>

        {/* KPI 2: Verified Skills */}
        <div className="sn-card flex flex-col justify-between">
          <div className="space-y-1">
            <span className="font-label text-label-sm text-on-surface-muted block">
              {settings.language === 'hi' ? 'सत्यापित कौशल' : 'Verified Skills'}
            </span>
            <div className="font-display text-display-lg-mobile text-on-surface font-bold">
              14
            </div>
            <p className="font-body text-body-sm text-on-surface-muted">
              <strong className="text-on-surface">8 Certificates</strong> •{' '}
              <strong className="text-on-surface">6 Alternative Proofs</strong>
            </p>
          </div>

          <div className="pt-3 border-t border-outline flex items-center justify-between text-xs">
            <span className="text-success font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% Vector Indexed</span>
            </span>
            <span className="text-primary font-label text-[11px] cursor-pointer hover:underline" onClick={() => navigate('/evidence')}>
              View ledger →
            </span>
          </div>
        </div>

        {/* KPI 3: Target Role with Dropdown */}
        <div className="sn-card flex flex-col justify-between">
          <div className="space-y-1.5">
            <span className="font-label text-label-sm text-on-surface-muted block">
              {settings.language === 'hi' ? 'लक्षित भूमिका' : 'Target Career Role'}
            </span>
            <select
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              className="w-full bg-white border border-outline rounded-sm px-3 py-2 text-xs font-semibold text-on-surface focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer shadow-sm"
              aria-label="Switch Target Role"
            >
              {TARGET_ROLES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-3 border-t border-outline flex items-center justify-between text-xs">
            <span className="text-on-surface-muted">Active Pathway:</span>
            <span className="font-label font-medium text-primary">
              {profile.pathway || 'First-Gen Student'}
            </span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          2. Middle 2 Columns: Top 3 Skill Gaps & HANA Matches
          ═══════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Top 3 Skill Gaps */}
        <div className="sn-card space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-title text-title-md text-on-surface">
                {settings.language === 'hi' ? 'शीर्ष 3 कौशल अंतराल' : 'Top 3 Skill Gaps'}
              </h2>
              <p className="font-body text-body-sm text-on-surface-muted">
                Fastest roadmap to reach 90%+ readiness for {currentRole.title}
              </p>
            </div>
            <span className="sn-badge font-label text-xs">
              ~{totalGapHours} hrs total
            </span>
          </div>

          <div className="space-y-4">
            {currentRole.gaps.map((gap, idx) => (
              <div key={idx} className="p-3.5 bg-surface border border-outline rounded-sm space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-on-surface">{gap.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-on-surface-muted flex items-center gap-1">
                      <Clock className="w-3 h-3 text-primary" />
                      <span>~{gap.hours} hrs</span>
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary-tint text-primary">
                      {gap.level}
                    </span>
                  </div>
                </div>

                {/* Thin Blue Progress Bar */}
                <div className="w-full bg-outline h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-500"
                    style={{ width: `${gap.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => navigate('/evidence')}
            className="sn-btn-secondary w-full text-xs py-2.5 flex items-center justify-center gap-2 font-semibold"
          >
            <span>Add Alternative Project Proof to Close Gaps</span>
            <ArrowRight className="w-3.5 h-3.5 text-primary" />
          </button>
        </div>

        {/* Right Column: SAP HANA Semantic Job Matches */}
        <div className="sn-card space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-title text-title-md text-on-surface">
                SAP HANA Semantic Job Matches
              </h2>
              <p className="font-body text-body-sm text-on-surface-muted">
                Cosine similarity match against live enterprise role catalog
              </p>
            </div>
            <span className="sn-badge-blue text-xs">HANA Vector</span>
          </div>

          <div className="space-y-3.5">
            {HANA_JOB_MATCHES.map((job) => (
              <div
                key={job.id}
                className="p-4 bg-surface border border-outline rounded-sm hover:border-primary/50 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-title text-title-sm text-on-surface font-semibold">
                      {job.title}
                    </h3>
                    <p className="font-body text-body-sm text-on-surface-muted">
                      {job.department}
                    </p>
                  </div>
                  {/* Match % Badge */}
                  <span className="px-2.5 py-1 rounded-full bg-primary-tint text-primary font-bold text-xs shrink-0 border border-blue-200">
                    {job.matchScore}% Match
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1 border-t border-outline/50">
                  <div className="flex flex-wrap gap-1">
                    {job.matchedSkills.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 bg-surface-card border border-outline rounded text-[11px] font-medium text-on-surface"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(`/matches?job=${job.id}`)}
                    className="sn-btn-primary py-1.5 px-3 text-xs flex items-center gap-1.5 shadow-none"
                  >
                    <span>Analyze Match</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          3. Bottom Weekly Micro-Checklist & Study Hours Slider
          ═══════════════════════════════════════════════ */}
      <div className="sn-card grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left (7 cols): Micro-Checklist */}
        <div className="lg:col-span-7 space-y-4">
          <div>
            <h2 className="font-title text-title-md text-on-surface flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span>Weekly Micro-Checklist</span>
            </h2>
            <p className="font-body text-body-sm text-on-surface-muted">
              Complete these 3 tasks to boost your blind match score before employer review.
            </p>
          </div>

          <div className="space-y-2.5">
            {checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleChecklist(item.id)}
                className={`p-3 rounded-sm border cursor-pointer transition-all flex items-center gap-3 ${
                  item.done
                    ? 'bg-surface-card border-outline text-on-surface-muted line-through'
                    : 'bg-white border-outline hover:border-primary text-on-surface'
                }`}
              >
                {item.done ? (
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-on-surface-muted shrink-0" />
                )}
                <span className="font-body text-body-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right (5 cols): Study Hours Slider & ETA */}
        <div className="lg:col-span-5 p-6 bg-surface border border-outline rounded-sm space-y-5">
          <div className="flex items-center justify-between">
            <span className="font-label text-label-md text-on-surface flex items-center gap-2">
              <Sliders className="w-4 h-4 text-primary" />
              <span>Weekly Study Hours</span>
            </span>
            <span className="font-display text-title-lg font-bold text-primary">
              {studyHoursPerWeek} hrs/week
            </span>
          </div>

          <input
            type="range"
            min="4"
            max="30"
            step="2"
            value={studyHoursPerWeek}
            onChange={(e) => setStudyHoursPerWeek(Number(e.target.value))}
            className="w-full accent-primary h-2 bg-outline rounded-lg cursor-pointer"
            aria-label="Weekly study hours slider"
          />

          <div className="flex justify-between text-xs text-on-surface-muted font-body">
            <span>4 hrs</span>
            <span>15 hrs</span>
            <span>30 hrs</span>
          </div>

          {/* Dynamic ETA Banner */}
          <div className="p-4 bg-primary-tint border border-blue-200 rounded-sm text-center space-y-1">
            <span className="text-xs text-on-primary-tint font-label font-semibold block uppercase tracking-wider">
              Career Trajectory Estimate
            </span>
            <div className="font-display text-headline-sm font-bold text-primary">
              Estimated Job-Ready in {estimatedWeeks} {estimatedWeeks === 1 ? 'Week' : 'Weeks'}
            </div>
            <p className="text-[11px] text-on-primary-tint">
              Based on ~{totalGapHours} remaining gap hours for {currentRole.title}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
