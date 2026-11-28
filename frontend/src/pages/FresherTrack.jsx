import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import fallbackCatalog from '../data/fresher_catalog.json';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  FileCheck2,
  Briefcase,
  LayoutDashboard,
  Award,
  TrendingUp,
  Building2,
  CheckCircle2,
  Clock,
  BookOpen,
} from 'lucide-react';

const COMPANY_ECOSYSTEM_FOCUS = {
  'Inclusive Tech Enterprises': 'Fullstack & Accessible Web (Python, React, SQL, TypeScript)',
  'Open Source & Developer Labs': 'API Engineering & Developer Tooling (FastAPI, Python, Docker, Git)',
  'Cloud & SaaS Startups': 'Cloud Native & DevOps Resilience (Docker, Cloud Basics, FastAPI, SQL)',
  'Data & AI Product Platforms': 'Applied AI, Vector Search & Analytics (Python, Machine Learning, SQL)',
  'Modern Engineering Studios': 'Frontend Architecture & Product Delivery (React, TypeScript, REST APIs)',
};

export default function FresherTrack() {
  const navigate = useNavigate();

  // Initialize from bundled catalog so dropdowns and certificates work immediately
  const [catalog, setCatalog] = useState({
    skills: fallbackCatalog.skills || ['Python', 'React', 'Docker', 'FastAPI', 'SQL', 'Cloud Basics', 'Machine Learning', 'TypeScript'],
    target_companies: fallbackCatalog.target_companies || [
      'Inclusive Tech Enterprises',
      'Open Source & Developer Labs',
      'Cloud & SaaS Startups',
      'Data & AI Product Platforms',
      'Modern Engineering Studios',
    ],
    recommended_certificates: fallbackCatalog.recommended_certificates || [],
    trending_skills: fallbackCatalog.trending_skills || [],
  });

  const [loading, setLoading] = useState(false);

  // Dropdown states
  const [selectedSkill, setSelectedSkill] = useState(
    fallbackCatalog.skills?.[0] || 'Python'
  );
  const [selectedCompany, setSelectedCompany] = useState(
    fallbackCatalog.target_companies?.[0] || 'Inclusive Tech Enterprises'
  );

  // Refresh catalog from backend when available, guarding against non-JSON responses
  useEffect(() => {
    let isMounted = true;
    const fetchCatalog = async () => {
      try {
        const res = await axios.get('/api/fresher/catalog');
        const data = res.data;
        if (
          isMounted &&
          data &&
          typeof data === 'object' &&
          !Array.isArray(data) &&
          Array.isArray(data.skills)
        ) {
          setCatalog({
            skills: data.skills,
            target_companies: Array.isArray(data.target_companies)
              ? data.target_companies
              : fallbackCatalog.target_companies || [],
            recommended_certificates: Array.isArray(data.recommended_certificates)
              ? data.recommended_certificates
              : fallbackCatalog.recommended_certificates || [],
            trending_skills: Array.isArray(data.trending_skills)
              ? data.trending_skills
              : fallbackCatalog.trending_skills || [],
          });
        }
      } catch (err) {
        console.warn('Using bundled fresher catalog fallback', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

  // Match certificates by primary skill first, then by skills_covered
  const allCerts = Array.isArray(catalog.recommended_certificates)
    ? catalog.recommended_certificates
    : [];

  const exactMatches = allCerts.filter(
    (c) => c.skill?.toLowerCase() === selectedSkill.toLowerCase()
  );
  const relatedMatches = allCerts.filter(
    (c) =>
      c.skill?.toLowerCase() !== selectedSkill.toLowerCase() &&
      Array.isArray(c.skills_covered) &&
      c.skills_covered.some((sk) => sk.toLowerCase().includes(selectedSkill.toLowerCase()))
  );

  const matchedCerts = [...exactMatches, ...relatedMatches];
  const displayCert = matchedCerts.length > 0 ? matchedCerts[0] : (allCerts[0] || null);
  const additionalCerts = matchedCerts.slice(1);
  const ecosystemFocus =
    COMPANY_ECOSYSTEM_FOCUS[selectedCompany] ||
    'Degree-agnostic, blind skills evaluation across core engineering stacks.';

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded">
              <GraduationCap className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
              Fresher Pathway
            </h1>
          </div>
          <p className="text-xs text-neutral-500">
            Degree-agnostic, skills-first launchpad for students, self-taught coders, and early-career talent.
          </p>
        </div>

        <Link
          to="/employed"
          className="text-xs text-neutral-600 hover:text-blue-600 font-medium border border-neutral-300 px-3 py-1.5 rounded self-start sm:self-auto transition-colors"
        >
          Switch to Employed Track →
        </Link>
      </div>

      {/* Quick Launchpad to /fresher/test and /fresher/prepare */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/fresher/test"
          className="p-4 border-2 border-blue-600/30 hover:border-blue-600 bg-blue-50/40 rounded-lg flex items-center justify-between group transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              20×
            </div>
            <div>
              <div className="text-xs font-bold text-neutral-900 group-hover:text-blue-600">
                Skill Assessments &amp; Quizzes
              </div>
              <div className="text-[11px] text-neutral-500">
                Server-graded quizzes • Verified score saves to profile
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          to="/fresher/prepare"
          className="p-4 border-2 border-neutral-300 hover:border-black bg-white rounded-lg flex items-center justify-between group transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-black text-white flex items-center justify-center font-bold">
              📚
            </div>
            <div>
              <div className="text-xs font-bold text-neutral-900 group-hover:text-black">
                Practice Platforms &amp; Learning
              </div>
              <div className="text-[11px] text-neutral-500">
                In-browser playgrounds, roadmap guides, and open courses
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* ═════════════════════════════════════════════════════════════
          SECTION 1: Interested Skill & Target Company Dropdown
          ═════════════════════════════════════════════════════════════ */}
      <div className="p-6 border border-neutral-200 rounded-lg bg-white shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              1. Tailor Your Opportunity Pathway
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Select your interested primary skill and target company domain to view aligned certifications.
            </p>
          </div>
          <span className="text-[11px] text-blue-700 font-medium bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
            Live Pathway Configurator
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Dropdown 1: Interested Skill */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Interested Skill
            </label>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              aria-label="Interested Skill"
              className="w-full min-h-[44px] px-3.5 py-2.5 text-xs font-medium border border-neutral-300 rounded-md bg-white text-neutral-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 cursor-pointer"
            >
              {catalog.skills?.map((sk) => (
                <option key={sk} value={sk}>
                  {sk}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-neutral-400 mt-1">
              Updates recommended certificate and learning path in real-time.
            </p>
          </div>

          {/* Dropdown 2: Target Company Type */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-neutral-800" />
              Target Company Ecosystem
            </label>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              aria-label="Target Company Ecosystem"
              className="w-full min-h-[44px] px-3.5 py-2.5 text-xs font-medium border border-neutral-300 rounded-md bg-white text-neutral-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 cursor-pointer"
            >
              {catalog.target_companies?.map((tc) => (
                <option key={tc} value={tc}>
                  {tc}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-blue-700 font-medium mt-1">
              {selectedCompany} Focus: {ecosystemFocus}
            </p>
          </div>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════
          SECTION 2: Recommended Certificate
          ═════════════════════════════════════════════════════════════ */}
      <div className="p-6 border border-neutral-200 rounded-lg bg-white shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600" />
              2. Recommended Certificate for {selectedSkill}
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Verified credentials recognized for fair, skills-first evaluation.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Verification Ready
          </span>
        </div>

        {displayCert ? (
          <div className="space-y-4">
            <div className="p-5 bg-neutral-50 border border-neutral-200 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-neutral-900 bg-white border border-neutral-300 px-2 py-0.5 rounded">
                    {displayCert.issuer}
                  </span>
                  <span className="text-[11px] text-blue-700 font-semibold bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                    {displayCert.relevance_score}% Relevance Match
                  </span>
                  <span className="text-[11px] text-neutral-600 font-medium bg-white border border-neutral-200 px-2 py-0.5 rounded">
                    Aligned with {selectedCompany}
                  </span>
                </div>
                <h3 className="text-base font-bold text-neutral-900">{displayCert.title}</h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-600">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-neutral-500" />
                    {displayCert.duration}
                  </span>
                  <span>•</span>
                  <span className="text-neutral-700 font-medium">{displayCert.cost_type}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {displayCert.skills_covered?.map((sk, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-white border border-neutral-200 rounded text-neutral-800 text-[11px] font-medium"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2 shrink-0">
                <button
                  onClick={() => navigate('/evidence')}
                  className="min-h-[40px] px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Upload to Evidence Ledger</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => navigate('/learning-hub')}
                  className="min-h-[40px] px-4 py-2 bg-neutral-900 hover:bg-black text-white rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Explore Learning Hub</span>
                </button>
                <button
                  onClick={() => navigate('/matches')}
                  className="min-h-[40px] px-4 py-2 bg-white hover:bg-neutral-100 text-neutral-900 border border-neutral-300 rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Check Match Impact</span>
                </button>
              </div>
            </div>

            {additionalCerts.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  Related Certificates Covering {selectedSkill} ({additionalCerts.length})
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {additionalCerts.map((cert) => (
                    <div
                      key={cert.id}
                      className="p-3.5 bg-white border border-neutral-200 rounded-lg flex flex-col justify-between gap-2"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-bold text-neutral-700">{cert.issuer}</span>
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                            {cert.relevance_score}% Match
                          </span>
                        </div>
                        <div className="text-xs font-bold text-neutral-900 mt-1">{cert.title}</div>
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        {cert.duration} • {cert.cost_type}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-neutral-500">No specific certificate found for {selectedSkill}.</p>
        )}
      </div>

      {/* ═════════════════════════════════════════════════════════════
          SECTION 3: Trending Skills List with "sample data" label
          ═════════════════════════════════════════════════════════════ */}
      <div className="p-6 border border-neutral-200 rounded-lg bg-white shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                3. Trending Skills in Inclusive Hiring
              </h2>
              {/* Required "sample data" label badge */}
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 rounded">
                sample data
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Market demand signals based on verified project portfolios and open role requirements.
            </p>
          </div>
          <span className="text-[11px] text-neutral-400">
            Updated weekly
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 pt-1">
          {catalog.trending_skills?.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-neutral-50 border border-neutral-200 hover:border-neutral-400 rounded-lg transition-all space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-900">{item.name}</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                  {item.growth}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-neutral-500">
                <span>{item.category}</span>
                <span className="font-medium text-neutral-700">{item.popularity}</span>
              </div>
              {item.reason && (
                <p className="text-[11px] text-neutral-600 leading-tight pt-1 border-t border-neutral-200/60">
                  {item.reason}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════
          SECTION 4: Quick Navigation to Other Workspaces
          ═════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div
          onClick={() => navigate('/evidence')}
          className="p-4 border border-neutral-200 hover:border-black rounded-lg bg-white shadow-sm transition-all cursor-pointer group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-neutral-900 group-hover:text-blue-600">
                Evidence Ledger
              </div>
              <div className="text-[11px] text-neutral-500">Add GitHub & Project Proof</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
        </div>

        <div
          onClick={() => navigate('/matches')}
          className="p-4 border border-neutral-200 hover:border-black rounded-lg bg-white shadow-sm transition-all cursor-pointer group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-neutral-900 group-hover:text-blue-600">
                Job Match
              </div>
              <div className="text-[11px] text-neutral-500">Degree-Agnostic Matching</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
        </div>

        <div
          onClick={() => navigate('/dashboard')}
          className="p-4 border border-neutral-200 hover:border-black rounded-lg bg-white shadow-sm transition-all cursor-pointer group flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-neutral-100 text-neutral-800 flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-neutral-900 group-hover:text-blue-600">
                Dashboard
              </div>
              <div className="text-[11px] text-neutral-500">Readiness & Skill Gaps</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </div>
  );
}
