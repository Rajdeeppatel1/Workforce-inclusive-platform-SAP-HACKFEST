import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  BookOpen,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  GraduationCap,
  Code2,
  Youtube,
  Sparkles,
  Building2,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';

export default function LearningHub() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('vendor'); // 'vendor' | 'dsa' | 'educators' | 'aiml'
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('All'); // 'All' | 'Beginner' | 'Intermediate' | 'Advanced'

  useEffect(() => {
    let isMounted = true;
    const fetchResources = async () => {
      try {
        const res = await axios.get('/api/resources');
        if (isMounted && res.data) {
          setResources(res.data);
        }
      } catch (err) {
        console.warn('Failed to fetch from /api/resources, falling back to /api/fresher/catalog', err);
        try {
          const catRes = await axios.get('/api/fresher/catalog');
          if (isMounted && catRes.data?.resources) {
            setResources(catRes.data.resources);
          }
        } catch (catErr) {
          console.error('Could not load learning resources', catErr);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchResources();
    return () => {
      isMounted = false;
    };
  }, []);

  const tabs = [
    {
      id: 'vendor',
      label: 'Vendor Portals',
      icon: Building2,
      subtitle: 'SAP, Microsoft Azure, AWS, Google Cloud',
    },
    {
      id: 'dsa',
      label: 'DSA Practice',
      icon: Code2,
      subtitle: 'LeetCode, CodeChef & Algorithmic Arenas',
    },
    {
      id: 'educators',
      label: 'Top Educators',
      icon: Youtube,
      subtitle: 'Striver (take U forward), CodeWithHarry, TechWorld with Nana',
    },
    {
      id: 'aiml',
      label: 'AI / ML Hubs',
      icon: Sparkles,
      subtitle: 'Google AI, Kaggle Learn, Hugging Face, fast.ai',
    },
  ];

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  // Client-side filtering by tab, search, and level
  const filteredResources = resources.filter((item) => {
    // Tab filter
    if (item.category !== activeTab) return false;

    // Level filter
    if (levelFilter !== 'All' && item.level?.toLowerCase() !== levelFilter.toLowerCase()) {
      return false;
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (item.title || '').toLowerCase().includes(q);
      const matchProvider = (item.provider || '').toLowerCase().includes(q);
      const matchSkills = (item.skills || []).some((s) => s.toLowerCase().includes(q));
      const matchUrl = (item.url || '').toLowerCase().includes(q);
      if (!matchTitle && !matchProvider && !matchSkills && !matchUrl) {
        return false;
      }
    }

    return true;
  });

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
              Verified Learning Hub &amp; Curated Resources
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded">
              Verified Links
            </span>
          </div>
          <p className="text-xs text-neutral-500">
            Curated direct learning pathways across official Vendor Portals (SAP, Azure, AWS, GCP), DSA Arenas (LeetCode, CodeChef), famous YouTube Educators (Striver, CodeWithHarry, Nana), and AI/ML Platforms (Google AI, Kaggle, Hugging Face, fast.ai).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/fresher/prepare"
            className="min-h-[44px] text-xs text-neutral-600 hover:text-black font-semibold border border-neutral-300 px-3.5 py-2 rounded-sm transition-colors flex items-center gap-1.5"
          >
            <span>Practice &amp; Prepare</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/fresher/test"
            className="min-h-[44px] text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-sm transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span>Skill Quizzes</span>
          </Link>
        </div>
      </div>

      {/* 4 Main Category Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const count = resources.filter((r) => r.category === tab.id).length;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-4 rounded-lg border text-left transition-all cursor-pointer min-h-[74px] flex flex-col justify-between ${
                isActive
                  ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm'
                  : 'border-neutral-200 bg-white hover:border-neutral-400 text-neutral-800'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-blue-600'}`} />
                  <span className="text-xs font-bold">{tab.label}</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-100 text-neutral-600'
                  }`}
                >
                  {count}
                </span>
              </div>
              <p className={`text-[11px] truncate ${isActive ? 'text-neutral-400' : 'text-neutral-500'}`}>
                {tab.subtitle}
              </p>
            </button>
          );
        })}
      </div>

      {/* Search Bar & Level Filters (Client-side) */}
      <div className="p-4 bg-white border border-neutral-200 rounded-lg shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, vendor, provider, topic, or skill (e.g. SAP, Azure, LeetCode, Striver, Python, Transformers)..."
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

        {/* Level Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-neutral-100">
          <span className="text-xs font-semibold text-neutral-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Level:
          </span>
          {levels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevelFilter(lvl)}
              className={`min-h-[34px] px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                levelFilter === lvl
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'
              }`}
            >
              {lvl}
            </button>
          ))}
          <span className="text-[11px] text-neutral-400 ml-auto font-medium">
            Showing {filteredResources.length} resources
          </span>
        </div>
      </div>

      {/* Resources Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-neutral-500 bg-white border border-neutral-200 rounded-lg">
          Loading learning hub resources...
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="p-12 text-center bg-white border border-neutral-200 rounded-lg space-y-2">
          <p className="text-sm font-semibold text-neutral-800">
            No resources match "{searchQuery}" under the selected level filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setLevelFilter('All');
            }}
            className="min-h-[44px] px-4 py-2 bg-blue-600 text-white rounded text-xs font-semibold cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredResources.map((item) => {
            const isVerified = item.verified === true;

            return (
              <div
                key={item.id}
                className="p-5 border border-neutral-200 hover:border-neutral-900 rounded-lg bg-white shadow-xs transition-all flex flex-col justify-between space-y-4 group hover:shadow-md"
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded truncate max-w-[170px]">
                      {item.provider}
                    </span>

                    {/* Verification Status */}
                    {isVerified ? (
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded flex items-center gap-1 shrink-0"
                        title={`Verified reachability checked on ${item.lastVerified || 'recently'}`}
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Verified</span>
                      </span>
                    ) : (
                      <span
                        className="text-[10px] font-bold tracking-wider px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-300 rounded flex items-center gap-1 shrink-0"
                        title="Link reachability has not been verified yet"
                      >
                        <AlertCircle className="w-3 h-3 text-amber-600" />
                        <span>Link not yet verified</span>
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-neutral-900 group-hover:text-blue-600 transition-colors leading-snug">
                    {item.title}
                  </h3>

                  {/* Skills Tags */}
                  {item.skills && item.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.skills.map((skill) => (
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

                {/* Footer with Level, Hours & Direct Open Button */}
                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                  <div className="text-[11px] text-neutral-500 font-medium space-x-2">
                    <span className="font-semibold text-neutral-700">{item.level}</span>
                    <span>•</span>
                    <span>~{item.estHours}h</span>
                  </div>

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
      )}

      {/* Bottom Summary Callout */}
      <div className="p-6 bg-neutral-900 text-white rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            Looking to Fill Candidate Skill Gaps?
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            Visit the Practice &amp; Prepare page to view tailored recommendations matched against your profile gaps.
          </p>
        </div>
        <Link
          to="/fresher/prepare"
          className="min-h-[44px] px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shrink-0"
        >
          <span>View Skill Gap Recommendations</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
