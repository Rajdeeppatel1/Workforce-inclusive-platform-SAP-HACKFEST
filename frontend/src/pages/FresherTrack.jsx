import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  FileCheck2,
  Briefcase,
  User,
  LayoutDashboard,
  ShieldCheck,
  Award,
  TrendingUp,
  Building2,
  CheckCircle2,
  Clock,
  ExternalLink,
} from 'lucide-react';

export default function FresherTrack() {
  const navigate = useNavigate();

  // State for data from backend/data/fresher_catalog.json
  const [catalog, setCatalog] = useState({
    skills: ['Python', 'React', 'Docker', 'FastAPI', 'SQL', 'Cloud Basics'],
    target_companies: [
      'Inclusive Tech Enterprises',
      'Open Source & Developer Labs',
      'Cloud & SaaS Startups',
    ],
    recommended_certificates: [],
    trending_skills: [],
  });

  const [loading, setLoading] = useState(true);

  // Dropdown states
  const [selectedSkill, setSelectedSkill] = useState('Python');
  const [selectedCompany, setSelectedCompany] = useState('Inclusive Tech Enterprises');

  // Fetch catalog from backend/data/
  useEffect(() => {
    let isMounted = true;
    const fetchCatalog = async () => {
      try {
        const res = await axios.get('/api/fresher/catalog');
        if (isMounted && res.data) {
          setCatalog(res.data);
          if (res.data.skills?.length > 0) {
            setSelectedSkill(res.data.skills[0]);
          }
          if (res.data.target_companies?.length > 0) {
            setSelectedCompany(res.data.target_companies[0]);
          }
        }
      } catch (err) {
        console.warn('Could not load fresher catalog from server, using local fallback', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter recommended certificates by selected skill
  const matchedCerts = catalog.recommended_certificates?.filter(
    (c) => c.skill?.toLowerCase() === selectedSkill.toLowerCase()
  ) || [];

  const displayCert = matchedCerts.length > 0
    ? matchedCerts[0]
    : (catalog.recommended_certificates?.[0] || null);

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
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded">
              Synthetic Demo Data
            </span>
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
            Data from backend/data/
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
              className="w-full px-3.5 py-2.5 text-xs font-medium border border-neutral-300 rounded-md bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 cursor-pointer"
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
              className="w-full px-3.5 py-2.5 text-xs font-medium border border-neutral-300 rounded-md bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 cursor-pointer"
            >
              {catalog.target_companies?.map((tc) => (
                <option key={tc} value={tc}>
                  {tc}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-neutral-400 mt-1">
              All partner companies practice degree-agnostic, blind skills matching.
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
          <div className="p-5 bg-neutral-50 border border-neutral-200 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-900 bg-white border border-neutral-300 px-2 py-0.5 rounded">
                  {displayCert.issuer}
                </span>
                <span className="text-[11px] text-blue-700 font-semibold bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                  {displayCert.relevance_score}% Relevance Match
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
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Upload to Evidence Ledger</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => navigate('/matches')}
                className="px-4 py-2 bg-white hover:bg-neutral-100 text-neutral-900 border border-neutral-300 rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Check Match Impact</span>
              </button>
            </div>
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
            Updated weekly from backend/data/
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
                Fair Job Match
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
