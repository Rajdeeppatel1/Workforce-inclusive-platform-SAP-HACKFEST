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
} from 'lucide-react';

export default function FresherPrepare() {
  const navigate = useNavigate();

  const [officialPortals, setOfficialPortals] = useState([]);
  const [dsaPlatforms, setDsaPlatforms] = useState([]);
  const [youtubeCreators, setYoutubeCreators] = useState([]);
  const [aimlPlatforms, setAimlPlatforms] = useState([]);
  const [practicePlatforms, setPracticePlatforms] = useState([]);
  const [learningResources, setLearningResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState('All');
  const [sectionFilter, setSectionFilter] = useState('All');

  // Fetch from backend/data/fresher_catalog.json
  useEffect(() => {
    let isMounted = true;
    const fetchCatalog = async () => {
      try {
        const res = await axios.get('/api/fresher/catalog');
        if (isMounted && res.data) {
          setOfficialPortals(res.data.official_portals || []);
          setDsaPlatforms(res.data.dsa_platforms || []);
          setYoutubeCreators(res.data.youtube_creators || []);
          setAimlPlatforms(res.data.aiml_platforms || []);
          setPracticePlatforms(res.data.practice_platforms || []);
          setLearningResources(res.data.learning_resources || []);
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
  ];

  const sectionTabs = [
    { id: 'All', label: 'All Resources' },
    { id: 'Portals', label: '🏛️ Official Portals (SAP, Azure, AWS, GCP)' },
    { id: 'DSA', label: '💻 DSA Practice (LeetCode, CodeChef, GFG)' },
    { id: 'YouTube', label: '📺 Top YouTube Educators (Striver, Harry, Nana)' },
    { id: 'AIML', label: '🤖 AI / ML & Data Science Hubs' },
    { id: 'Sandboxes', label: '🛠️ Interactive Sandboxes & Standards' },
  ];

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
      return val.includes('cloud') || val.includes('devops') || val.includes('docker');
    }
    if (filter === 'dsa & algorithms') {
      return val.includes('dsa') || val.includes('algorithm') || val.includes('problem');
    }
    if (filter === 'fullstack & backend') {
      return val.includes('backend') || val.includes('fullstack') || val.includes('web');
    }
    if (filter === 'ai / ml & data science') {
      return val.includes('ai') || val.includes('ml') || val.includes('data');
    }
    return val.includes(filter);
  };

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
    filteredPortals.length +
    filteredDsa.length +
    filteredCreators.length +
    filteredAiml.length +
    filteredSandboxes.length +
    filteredDocs.length;

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
              Practice Platforms &amp; Learning Hub
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded">
              Verified Direct Links
            </span>
          </div>
          <p className="text-xs text-neutral-500">
            One-click direct redirects to official vendor portals (SAP, Azure, AWS, GCP), DSA coding platforms (LeetCode, CodeChef), famous educator playlists (Striver, CodeWithHarry, Nana), and AI/ML learning hubs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/fresher"
            className="min-h-[44px] text-xs text-neutral-600 hover:text-black font-semibold border border-neutral-300 px-3.5 py-2 rounded-sm transition-colors flex items-center gap-1"
          >
            ← Fresher Overview
          </Link>
          <Link
            to="/fresher/test"
            className="min-h-[44px] text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-sm transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <FileQuestion className="w-4 h-4" />
            <span>Take 5-MCQ Quiz</span>
          </Link>
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
              placeholder="Search SAP Learning Hub, SAP Developers, Azure, AWS, Google Cloud, LeetCode, CodeChef, Striver, CodeWithHarry, Nana, Google AI, Kaggle..."
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
              onClick={() => setSectionFilter(tab.id)}
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
          SECTION 1: Official Enterprise & Cloud Portals (SAP, Azure, AWS, GCP, Trailhead)
          ═════════════════════════════════════════════════════════════ */}
      {(sectionFilter === 'All' || sectionFilter === 'Portals') && (
        <div className="space-y-4">
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
      {(sectionFilter === 'All' || sectionFilter === 'DSA') && (
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
                  <span className="text-[11px] font-semibold text-neutral-600 truncate max-w-[150px]">
                    {item.free_tier}
                  </span>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] px-3.5 text-xs font-bold bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white rounded transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
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
          SECTION 3: Famous YouTube Educators & Curated Playlists (Striver, CodeWithHarry, freeCodeCamp, Love Babbar, NeetCode, etc.)
          ═════════════════════════════════════════════════════════════ */}
      {(sectionFilter === 'All' || sectionFilter === 'YouTube') && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <Youtube className="w-4 h-4 text-red-600" />
              Famous YouTube Educators &amp; Curated Free Playlists ({filteredCreators.length})
            </h2>
            <span className="text-xs text-neutral-400 font-medium">Free High-Quality Video Series</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCreators.map((creator) => (
              <div
                key={creator.id}
                className="p-5 border border-neutral-200 hover:border-red-500 rounded-lg bg-white shadow-xs transition-all flex flex-col justify-between space-y-4 group hover:shadow-md"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded flex items-center gap-1">
                      <PlayCircle className="w-3 h-3" />
                      {creator.creator}
                    </span>
                    <span className="text-[10px] font-medium text-neutral-500">
                      {creator.subscribers}
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

                  <div className="text-[11px] text-neutral-500 font-medium flex items-center gap-2 pt-1">
                    <span className="bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded">
                      Category: {creator.category}
                    </span>
                    <span className="text-neutral-400">•</span>
                    <span className="text-red-700 font-semibold">{creator.badge}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                  <a
                    href={creator.channel_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] text-xs font-semibold text-neutral-600 hover:text-neutral-900 flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <span>Channel</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href={creator.playlist_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] px-3.5 text-xs font-bold bg-red-50 hover:bg-red-600 text-red-700 hover:text-white rounded transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <span>Watch Series / Sheet</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════
          SECTION 4: AI / ML & Data Science Platforms (Kaggle, DeepLearning.AI, Hugging Face, Fast.ai)
          ═════════════════════════════════════════════════════════════ */}
      {(sectionFilter === 'All' || sectionFilter === 'AIML') && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-600" />
              AI / Machine Learning &amp; Data Science Hubs ({filteredAiml.length})
            </h2>
            <span className="text-xs text-neutral-400 font-medium">Free Notebooks, RAG Guides &amp; Open Models</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredAiml.map((ai) => (
              <div
                key={ai.id}
                className="p-5 border border-neutral-200 hover:border-purple-600 rounded-lg bg-white shadow-xs transition-all flex flex-col justify-between space-y-4 group hover:shadow-md"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      {ai.provider}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded">
                      {ai.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-neutral-900 group-hover:text-purple-700 transition-colors leading-snug">
                    {ai.name}
                  </h3>

                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {ai.description}
                  </p>

                  {ai.recommended_for && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {ai.recommended_for.map((skill) => (
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
                  <span className="text-[10px] font-semibold text-neutral-500 truncate max-w-[130px]">
                    {ai.free_tier}
                  </span>
                  <a
                    href={ai.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] px-3 text-xs font-bold bg-purple-50 hover:bg-purple-600 text-purple-800 hover:text-white rounded transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <span>Learn AI</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════
          SECTION 5: Interactive Practice Sandboxes & Architecture Standards
          ═════════════════════════════════════════════════════════════ */}
      {(sectionFilter === 'All' || sectionFilter === 'Sandboxes') && (
        <div className="space-y-6 pt-2">
          {/* Sandboxes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                <Laptop className="w-4 h-4 text-blue-600" />
                In-Browser Interactive Sandboxes ({filteredSandboxes.length})
              </h2>
              <span className="text-xs text-neutral-400 font-medium">Zero-Setup Browser Terminal &amp; Code Execution</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredSandboxes.map((plat) => (
                <div
                  key={plat.id}
                  className="p-4 border border-neutral-200 hover:border-neutral-900 rounded-lg bg-white shadow-xs transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-bold text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded truncate">
                        {plat.category}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded">
                        {plat.badge}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
                      {plat.name}
                    </h3>

                    <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed">
                      {plat.description}
                    </p>

                    <div className="text-[11px] text-neutral-500 font-medium">
                      Level: <span className="text-neutral-800">{plat.difficulty}</span>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      ✓ Open Access
                    </span>
                    <a
                      href={plat.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[44px] text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 group-hover:underline cursor-pointer"
                    >
                      <span>Launch Sandbox</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Architecture Guides */}
          {filteredDocs.length > 0 && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-blue-600" />
                  Engineering Standards &amp; Architecture Guides ({filteredDocs.length})
                </h2>
                <span className="text-xs text-neutral-400 font-medium">Production Architecture References</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDocs.map((res) => (
                  <div
                    key={res.id}
                    className="p-5 border border-neutral-200 hover:border-neutral-900 rounded-lg bg-white shadow-xs transition-all flex flex-col justify-between space-y-3 group"
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
            Take a 5-MCQ category test to save a verified competency badge directly onto your candidate profile.
          </p>
        </div>
        <button
          onClick={() => navigate('/fresher/test')}
          className="min-h-[44px] px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shrink-0"
        >
          <span>Start Assessment</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
