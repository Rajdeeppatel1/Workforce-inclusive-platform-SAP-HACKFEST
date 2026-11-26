import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  FileCheck2,
  Briefcase,
  User,
  LayoutDashboard,
  ShieldCheck,
} from 'lucide-react';

export default function FresherTrack() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
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

      {/* Fairness & Pedigree Disclaimer */}
      <div className="bg-neutral-50 border-l-4 border-black p-4 rounded-r text-xs text-neutral-700 space-y-1">
        <div className="font-bold text-neutral-900 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          Zero College Tier Penalty
        </div>
        <p>
          "Ye data sirf skill matching ke liye use hoga." College name, city tier, aur protected attributes scoring se bahar hain.
        </p>
      </div>

      {/* Navigation Grid (Layout & Navigation Only) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Navigation Card 1 */}
        <div
          onClick={() => navigate('/evidence')}
          className="p-5 border border-neutral-200 hover:border-black rounded-lg bg-white shadow-sm transition-all cursor-pointer group flex flex-col justify-between h-44"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] text-neutral-400 font-semibold uppercase">Step 1</span>
            </div>
            <h2 className="text-sm font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
              Alternative Evidence & Projects
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Add your GitHub repositories, hackathon outputs, and self-taught certifications.
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 pt-2 border-t border-neutral-100">
            <span>Open Evidence Workspace</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Navigation Card 2 */}
        <div
          onClick={() => navigate('/matches')}
          className="p-5 border border-neutral-200 hover:border-black rounded-lg bg-white shadow-sm transition-all cursor-pointer group flex flex-col justify-between h-44"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-[10px] text-neutral-400 font-semibold uppercase">Step 2</span>
            </div>
            <h2 className="text-sm font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
              Fair Job Matching
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Run blind vector matching against inclusive job catalogs with 0.0% pedigree bias.
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 pt-2 border-t border-neutral-100">
            <span>Explore Opportunities</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Navigation Card 3 */}
        <div
          onClick={() => navigate('/profile')}
          className="p-5 border border-neutral-200 hover:border-black rounded-lg bg-white shadow-sm transition-all cursor-pointer group flex flex-col justify-between h-44"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded bg-neutral-100 text-neutral-800 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <span className="text-[10px] text-neutral-400 font-semibold uppercase">Profile</span>
            </div>
            <h2 className="text-sm font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
              Candidate Profile & Learning Goals
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Configure your previous skills, graduation timeline, and target weekly study hours.
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-neutral-900 pt-2 border-t border-neutral-100">
            <span>Manage Profile</span>
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
              <span className="text-[10px] text-neutral-400 font-semibold uppercase">Overview</span>
            </div>
            <h2 className="text-sm font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
              Main Candidate Dashboard
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Review your readiness score ring, verified skills ledger, and top 3 skill gap hours.
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
