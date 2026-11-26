import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  BookOpen,
  Code2,
  ExternalLink,
  Sparkles,
  ArrowRight,
  FileQuestion,
  CheckCircle2,
  Terminal,
  Bookmark,
  Layers,
} from 'lucide-react';

export default function FresherPrepare() {
  const navigate = useNavigate();

  const [platforms, setPlatforms] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  // Fetch from backend/data/fresher_catalog.json
  useEffect(() => {
    let isMounted = true;
    const fetchCatalog = async () => {
      try {
        const res = await axios.get('/api/fresher/catalog');
        if (isMounted && res.data) {
          setPlatforms(res.data.practice_platforms || []);
          setResources(res.data.learning_resources || []);
        }
      } catch (err) {
        console.warn('Could not load prepare data from server', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

  const filterTabs = ['All', 'Backend', 'DevOps & Cloud', 'AI / ML', 'Algorithms'];

  const filteredPlatforms = platforms.filter((p) => {
    if (activeFilter === 'All') return true;
    return p.category.toLowerCase().includes(activeFilter.toLowerCase());
  });

  const filteredResources = resources.filter((r) => {
    if (activeFilter === 'All') return true;
    return (
      r.topic.toLowerCase().includes(activeFilter.toLowerCase()) ||
      r.title.toLowerCase().includes(activeFilter.toLowerCase())
    );
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded">
              <BookOpen className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
              Practice Platforms &amp; Learning Resources
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded">
              Synthetic Demo Data
            </span>
          </div>
          <p className="text-xs text-neutral-500">
            Verified, open-access coding playgrounds and curated engineering guides from <code className="bg-neutral-100 px-1 py-0.5 rounded">backend/data/</code>.
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
            to="/fresher/test"
            className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3.5 py-1.5 rounded transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <FileQuestion className="w-3.5 h-3.5" />
            <span>Take 5-MCQ Quiz</span>
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-neutral-200 pb-3">
        <span className="text-xs font-semibold text-neutral-500 mr-2 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5" /> Topic Filter:
        </span>
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-all cursor-pointer ${
              activeFilter === tab
                ? 'bg-black text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ═════════════════════════════════════════════════════════════
          SECTION 1: Practice Platforms
          ═════════════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
            <Code2 className="w-4 h-4 text-blue-600" />
            Interactive Practice Platforms ({filteredPlatforms.length})
          </h2>
          <span className="text-xs text-neutral-400 font-medium">Hands-on In-Browser Coding</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPlatforms.map((plat) => (
            <div
              key={plat.id}
              className="p-5 border border-neutral-200 hover:border-black rounded-lg bg-white shadow-sm transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded">
                    {plat.category}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded">
                    {plat.badge}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
                  {plat.name}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {plat.description}
                </p>
                <div className="text-[11px] text-neutral-500 font-medium">
                  Difficulty Level: <span className="text-neutral-800">{plat.difficulty}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  ✓ Open Access
                </span>
                <a
                  href={plat.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 group-hover:underline"
                >
                  <span>Launch Practice</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════
          SECTION 2: Learning Resources & Visual Guides
          ═════════════════════════════════════════════════════════════ */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-blue-600" />
            Curated Learning Guides &amp; Documentation ({filteredResources.length})
          </h2>
          <span className="text-xs text-neutral-400 font-medium">Official Docs &amp; Roadmaps</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredResources.map((res) => (
            <div
              key={res.id}
              className="p-5 border border-neutral-200 hover:border-black rounded-lg bg-white shadow-sm transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-900 bg-blue-50 text-blue-800 px-2 py-0.5 rounded">
                    {res.topic}
                  </span>
                  <span className="text-[11px] text-neutral-500 font-medium">
                    {res.provider}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
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
                  Self-paced Resource
                </span>
                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 group-hover:underline"
                >
                  <span>Open Resource</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Call to Action Card */}
      <div className="p-6 bg-neutral-900 text-white rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            Ready to Validate Your Skills?
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            Take a 5-MCQ category test to save a verified competency badge onto your candidate profile.
          </p>
        </div>
        <button
          onClick={() => navigate('/fresher/test')}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
        >
          <span>Start Assessment</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
