import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Briefcase,
  TrendingUp,
  ArrowRight,
  FileCheck2,
  ShieldAlert,
  User,
  LayoutDashboard,
  ShieldCheck,
} from 'lucide-react';

export default function EmployedTrack() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-black text-white rounded">
              <Briefcase className="w-5 h-5 text-blue-400" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
              Employed Professional Pathway
            </h1>
          </div>
          <p className="text-xs text-neutral-500">
            Skills-first career progression, reskilling, and fair opportunity transitions for working professionals.
          </p>
        </div>

        <Link
          to="/fresher"
          className="text-xs text-neutral-600 hover:text-blue-600 font-medium border border-neutral-300 px-3 py-1.5 rounded self-start sm:self-auto transition-colors"
        >
          Switch to Fresher Track →
        </Link>
      </div>

      {/* Career Gap & Anonymity Disclaimer */}
      <div className="bg-neutral-50 border-l-4 border-blue-600 p-4 rounded-r text-xs text-neutral-700 space-y-1">
        <div className="font-bold text-neutral-900 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          Protected Experience Evaluation
        </div>
        <p>
          This evaluation is strictly skills-first. Career break durations, past employer pedigree, and location are excluded from matching algorithms.
        </p>
      </div>

      {/* Navigation Grid (Layout & Navigation Only) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Navigation Card 1 */}
        <div
          onClick={() => navigate('/matches')}
          className="p-5 border border-neutral-200 hover:border-black rounded-lg bg-white shadow-sm transition-all cursor-pointer group flex flex-col justify-between h-44"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-[10px] text-neutral-400 font-semibold uppercase">Transitions</span>
            </div>
            <h2 className="text-sm font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
              Fair Career Transition Matching
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Match your verified experience against target senior & cross-functional roles degree-agnostically.
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 pt-2 border-t border-neutral-100">
            <span>Analyze Role Transitions</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Navigation Card 2 */}
        <div
          onClick={() => navigate('/jd-checker')}
          className="p-5 border border-neutral-200 hover:border-black rounded-lg bg-white shadow-sm transition-all cursor-pointer group flex flex-col justify-between h-44"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded bg-neutral-100 text-neutral-800 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <span className="text-[10px] text-neutral-400 font-semibold uppercase">Inclusive HR</span>
            </div>
            <h2 className="text-sm font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
              Inclusive Job Description Checker
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Audit job descriptions for pedigree barriers, gendered jargon, and unnecessary degree requirements.
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-neutral-900 pt-2 border-t border-neutral-100">
            <span>Open Bias Checker</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Navigation Card 3 */}
        <div
          onClick={() => navigate('/evidence')}
          className="p-5 border border-neutral-200 hover:border-black rounded-lg bg-white shadow-sm transition-all cursor-pointer group flex flex-col justify-between h-44"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] text-neutral-400 font-semibold uppercase">Evidence</span>
            </div>
            <h2 className="text-sm font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
              Credentials & Freelance Evidence
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Verify ongoing certifications, freelance portfolio proof, and career-break upskilling projects.
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 pt-2 border-t border-neutral-100">
            <span>Manage Verified Ledger</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Navigation Card 4 */}
        <div
          onClick={() => navigate('/dashboard')}
          className="p-5 border border-neutral-200 hover:border-black rounded-lg bg-white shadow-sm transition-all cursor-pointer group flex flex-col justify-between h-44"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded bg-neutral-100 text-neutral-800 flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <span className="text-[10px] text-neutral-400 font-semibold uppercase">Dashboard</span>
            </div>
            <h2 className="text-sm font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
              Main Candidate Dashboard
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Weekly micro-checklists, skill gap analysis, and estimated transition timelines.
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-neutral-900 pt-2 border-t border-neutral-100">
            <span>Go to Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
}
