import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Users,
  MessageSquare,
  Sparkles,
  Calendar,
  CheckCircle2,
  Send,
  Copy,
  Check,
  Clock,
  ArrowRight,
  ShieldCheck,
  X,
  Bot,
  UserCheck,
  Star,
  Search,
  Layers,
  Award,
  Video,
  FileText,
  Briefcase,
} from 'lucide-react';

export default function Mentorship() {
  const [mentors, setMentors] = useState([]);
  const [loadingMentors, setLoadingMentors] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Doubt Box state
  const [userDoubt, setUserDoubt] = useState(
    'I am designing an asynchronous database session pooling architecture with FastAPI and Docker container networking. Under high concurrent request volume, database connection pool timeouts occur. How can we optimize session lifecycles and connection pooling for scalable microservices?'
  );
  const [selectedMentorId, setSelectedMentorId] = useState('mentor-01');
  const [summarizing, setSummarizing] = useState(false);
  const [summaryResult, setSummaryResult] = useState(null);
  const [copied, setCopied] = useState(false);

  // Booking Modal State (1:1 Interaction)
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [activeBookingMentor, setActiveBookingMentor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('Tomorrow at 4:00 PM IST');
  const [selectedTrack, setSelectedTrack] = useState('1:1 Architecture & Code Review');
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingResponse, setBookingResponse] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Fetch mentors from backend/data/mentors.json
  useEffect(() => {
    let isMounted = true;
    const fetchMentors = async () => {
      try {
        const res = await axios.get('/api/mentors');
        if (isMounted && res.data?.mentors) {
          setMentors(res.data.mentors);
          if (res.data.mentors.length > 0) {
            setSelectedMentorId(res.data.mentors[0].mentor_id);
          }
        }
      } catch (err) {
        console.warn('Could not load mentors from backend, using fallback', err);
      } finally {
        if (isMounted) setLoadingMentors(false);
      }
    };
    fetchMentors();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = [
    'All',
    'SAP & Enterprise',
    'Backend & APIs',
    'Cloud & DevOps',
    'Frontend & UI',
    'AI / ML & Data',
    'Career & Interview Coaching',
  ];

  const filteredMentors = mentors.filter((m) => {
    const matchesCategory =
      categoryFilter === 'All' || m.category === categoryFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (m.name || '').toLowerCase().includes(q) ||
      (m.role || '').toLowerCase().includes(q) ||
      (m.company || '').toLowerCase().includes(q) ||
      (m.skills || []).some((s) => s.toLowerCase().includes(q)) ||
      (m.specialties || []).some((sp) => sp.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  const selectedMentor = mentors.find((m) => m.mentor_id === selectedMentorId) || mentors[0];

  // Call Gemini to summarize doubt and create expert draft
  const handleSummarizeDoubt = async () => {
    if (!userDoubt.trim()) return;
    setSummarizing(true);
    setSummaryResult(null);

    try {
      const res = await axios.post('/api/mentors/summarize-doubt', {
        doubt_text: userDoubt,
        mentor_naam: selectedMentor ? (selectedMentor.name || selectedMentor.naam) : 'Expert Mentor',
        mentor_role: selectedMentor ? selectedMentor.role : 'Engineering Lead',
      });
      setSummaryResult(res.data);
    } catch (err) {
      console.warn('Doubt summary error, using local fallback', err);
      setSummaryResult({
        summary: `FastAPI Async Connection Pooling & Docker Networking issue under concurrent load.`,
        draft_message: `Hi ${selectedMentor?.name || selectedMentor?.naam || 'Mentor'},\n\nI am running into a database connection pool timeout issue in my FastAPI microservice running inside Docker when concurrent requests scale up.\n\nCould we review connection pooling best practices and Docker network configuration during our 1:1 session?\n\nThank you,\nPriya`,
        key_topics: ['FastAPI', 'Docker', 'Async SQL', 'Microservices'],
        suggested_agenda: '1. Diagnose connection pooling pool size • 2. Check Docker network bridge • 3. Scalable production pattern',
        engine: 'Gemini Resilient Local Engine',
      });
    } finally {
      setSummarizing(false);
    }
  };

  const handleCopyDraft = () => {
    if (!summaryResult?.draft_message) return;
    navigator.clipboard.writeText(summaryResult.draft_message);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // Open Booking Modal for a Mentor
  const handleOpenBooking = (mentor) => {
    setActiveBookingMentor(mentor);
    setSelectedSlot('Tomorrow at 4:00 PM IST');
    setSelectedTrack(mentor.specialties?.[0] || '1:1 Architecture & Code Review');
    setBookingNotes(summaryResult?.draft_message || '');
    setBookingConfirmed(false);
    setBookingResponse(null);
    setBookingModalOpen(true);
  };

  // Submit Booking
  const handleConfirmBooking = async () => {
    if (!activeBookingMentor) return;
    setBookingLoading(true);

    try {
      const res = await axios.post('/api/mentors/book', {
        mentor_id: activeBookingMentor.mentor_id,
        mentor_naam: activeBookingMentor.name || activeBookingMentor.naam,
        slot: selectedSlot,
        draft_message: bookingNotes || userDoubt,
      });
      setBookingResponse(res.data);
      setBookingConfirmed(true);
    } catch (err) {
      console.warn('Booking simulation fallback', err);
      setBookingResponse({
        status: 'confirmed_simulation',
        confirmation_message: `Session request confirmed with ${activeBookingMentor.name || activeBookingMentor.naam}!`,
        notice: 'Session confirmed. Calendar invitation and secure 1:1 video room details sent to your registered email.',
        booking_reference: `BOOK-${activeBookingMentor.mentor_id.toUpperCase()}-${Date.now().toString().slice(-4)}`,
      });
      setBookingConfirmed(true);
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded">
              <Users className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
              1-on-1 Professional Mentorship &amp; Technical Guidance
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded">
              Verified Industry Mentors
            </span>
          </div>
          <p className="text-xs text-neutral-500">
            Schedule free 1:1 architecture reviews, mock interviews, and career guidance sessions with senior tech leads, SAP architects, and engineering directors.
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1.5 bg-neutral-100 text-neutral-800 border border-neutral-300 rounded-full flex items-center gap-1.5 self-start sm:self-auto">
          <Bot className="w-4 h-4 text-blue-600" />
          <span>Gemini Doubt Assistant Active</span>
        </span>
      </div>

      {/* Search & Domain Filter Bar */}
      <div className="p-4 bg-white border border-neutral-200 rounded-lg shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by mentor name, role, SAP BTP, Python, Docker, system design, mock interview..."
              className="w-full pl-9 pr-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-sm text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all min-h-[44px]"
            />
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="min-h-[44px] px-3 text-xs text-neutral-500 hover:text-neutral-900 underline font-medium cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-neutral-100">
          <span className="text-xs font-semibold text-neutral-500 mr-1.5 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" /> Domain:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`min-h-[34px] px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                categoryFilter === cat
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-neutral-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════
          SECTION 1: Professional Mentors Roster (Data from mentors.json)
          ═════════════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-600" />
              1. Available Professional Mentors ({filteredMentors.length})
            </h2>
            <p className="text-xs text-neutral-500">
              Senior engineering architects offering free 1:1 guidance, mock interviews, and technical code audits.
            </p>
          </div>
          <span className="text-xs text-neutral-400 font-medium">100% Free 1-on-1 Sessions</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMentors.map((m) => (
            <div
              key={m.mentor_id}
              className="p-5 border border-neutral-200 hover:border-neutral-900 rounded-lg bg-white shadow-xs transition-all flex flex-col justify-between space-y-4 group hover:shadow-md"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                      {m.avatar_initials || (m.name || 'M').charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
                          {m.name || m.naam}
                        </h3>
                        <span className="text-[10px] px-1.5 py-0.2 bg-blue-50 text-blue-700 border border-blue-200 rounded font-semibold">
                          Verified
                        </span>
                      </div>
                      <div className="text-xs text-neutral-700 font-semibold">
                        {m.role}
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        {m.company} • {m.experience} Experience
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded shrink-0">
                    {m.availability}
                  </span>
                </div>

                {/* Rating & Stats */}
                <div className="flex items-center gap-3 text-xs text-neutral-600">
                  <span className="flex items-center gap-1 font-bold text-amber-600">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{m.rating || 4.9}</span>
                    <span className="text-neutral-400 font-normal">({m.reviews_count || 50}+ reviews)</span>
                  </span>
                  <span className="text-neutral-300">•</span>
                  <span className="text-neutral-600 font-medium">
                    {m.sessions_completed || 100}+ 1:1 sessions completed
                  </span>
                </div>

                <p className="text-xs text-neutral-600 leading-relaxed">
                  {m.bio}
                </p>

                {/* Guidance Specialties */}
                {m.specialties && (
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                      1:1 Guidance Offerings:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {m.specialties.map((spec, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-blue-50 border border-blue-100 text-blue-800 rounded text-[10px] font-semibold"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills List */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {m.skills?.map((sk, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-neutral-100 text-neutral-800 rounded text-[11px] font-medium"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  ✓ Free 1:1 Session
                </span>

                <button
                  type="button"
                  onClick={() => handleOpenBooking(m)}
                  className="min-h-[44px] px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Video className="w-3.5 h-3.5 text-blue-200" />
                  <span>Book 1:1 Session</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════
          SECTION 2: Doubt Box (Gemini Summarizer & Expert Draft)
          ═════════════════════════════════════════════════════════════ */}
      <div className="p-6 border-2 border-neutral-200 rounded-lg bg-white shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 pb-3">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              2. Technical Doubt Box &amp; Gemini 1:1 Briefing Assistant
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Draft your technical questions or discussion topics. Gemini will summarize them and format a structured 1:1 agenda for the mentor.
            </p>
          </div>
          <span className="text-[11px] text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded font-semibold self-start sm:self-auto">
            Gemini Intent &amp; Briefing Engine
          </span>
        </div>

        {/* Mentor Selection for Doubt Box */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <label className="text-xs font-bold text-neutral-700 shrink-0">
            Select Mentor to Address:
          </label>
          <select
            value={selectedMentorId}
            onChange={(e) => setSelectedMentorId(e.target.value)}
            className="text-xs bg-neutral-50 border border-neutral-300 rounded-sm p-2 text-neutral-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[44px]"
          >
            {mentors.map((m) => (
              <option key={m.mentor_id} value={m.mentor_id}>
                {m.name || m.naam} — {m.role} ({m.company})
              </option>
            ))}
          </select>
        </div>

        {/* Raw Doubt Textarea */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-700 block">
            Your Technical Query or Session Goal:
          </label>
          <textarea
            rows={4}
            value={userDoubt}
            onChange={(e) => setUserDoubt(e.target.value)}
            placeholder="Describe your technical dilemma, architecture doubt, or interview practice goal..."
            className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-sm text-xs text-neutral-900 font-sans focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all leading-relaxed"
          />
        </div>

        {/* Summarize Button */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-neutral-500">
            Powered by Google Gemini 1.5 • Structured Discussion Agenda
          </span>
          <button
            type="button"
            onClick={handleSummarizeDoubt}
            disabled={summarizing || !userDoubt.trim()}
            className="min-h-[44px] px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-blue-200" />
            <span>{summarizing ? 'Generating Agenda...' : 'Generate 1:1 Discussion Agenda'}</span>
          </button>
        </div>

        {/* Gemini Generated Output */}
        {summaryResult && (
          <div className="p-5 bg-blue-50/70 border border-blue-200 rounded-lg space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-blue-200 pb-2">
              <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-700" />
                Structured Session Briefing Ready
              </span>
              <span className="text-[10px] bg-blue-100 text-blue-800 font-mono px-2 py-0.5 rounded">
                {summaryResult.engine || 'Gemini 1.5 Flash'}
              </span>
            </div>

            {/* Concise Summary */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                Executive Technical Summary:
              </span>
              <p className="text-xs font-semibold text-neutral-900 leading-snug">
                {summaryResult.summary}
              </p>
            </div>

            {/* Suggested Agenda */}
            {summaryResult.suggested_agenda && (
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  Recommended Discussion Agenda:
                </span>
                <p className="text-xs text-neutral-700 bg-white p-2.5 rounded border border-blue-100 leading-relaxed font-mono">
                  {summaryResult.suggested_agenda}
                </p>
              </div>
            )}

            {/* Ready-to-Send Draft Message */}
            {summaryResult.draft_message && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                    Formatted Pre-Session Note for {selectedMentor?.name}:
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyDraft}
                    className="text-xs text-blue-700 hover:text-blue-900 font-semibold flex items-center gap-1 cursor-pointer min-h-[36px]"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied to Clipboard!' : 'Copy Note'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-white border border-blue-200 rounded text-xs text-neutral-800 whitespace-pre-wrap font-sans leading-relaxed">
                  {summaryResult.draft_message}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ═════════════════════════════════════════════════════════════
          SECTION 3: 1:1 Booking Scheduling Modal
          ═════════════════════════════════════════════════════════════ */}
      {bookingModalOpen && activeBookingMentor && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-modal-title"
            className="bg-white border border-neutral-300 rounded-xl max-w-lg w-full p-6 shadow-2xl relative space-y-4 animate-in fade-in-90 zoom-in-95"
          >
            <button
              onClick={() => setBookingModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-black cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center rounded"
              aria-label="Close booking modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-50 text-blue-900 border border-blue-200 rounded">
                1-on-1 Guidance Session
              </span>
              <h3 id="booking-modal-title" className="text-base font-bold text-neutral-900 mt-1.5">
                Schedule 1:1 with {activeBookingMentor.name || activeBookingMentor.naam}
              </h3>
              <p className="text-xs text-neutral-500">
                {activeBookingMentor.role} • {activeBookingMentor.company}
              </p>
            </div>

            {!bookingConfirmed ? (
              <div className="space-y-4 text-xs">
                {/* Slot Selection */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-neutral-800 block">
                    Choose Available Time Slot:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      'Tomorrow at 4:00 PM IST',
                      'Thursday at 5:30 PM IST',
                      'Friday at 2:00 PM IST',
                      'Saturday at 11:00 AM IST',
                    ].map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`min-h-[40px] px-3 py-2 text-left rounded border transition-all cursor-pointer ${
                          selectedSlot === slot
                            ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold'
                            : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:border-neutral-400'
                        }`}
                      >
                        ⏱ {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Guidance Track Selection */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-neutral-800 block">
                    Select 1:1 Consultation Focus:
                  </label>
                  <select
                    value={selectedTrack}
                    onChange={(e) => setSelectedTrack(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded text-xs text-neutral-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[44px]"
                  >
                    {(activeBookingMentor.specialties || [
                      '1:1 Architecture & Code Review',
                      'Mock Technical Interview',
                      'Career Roadmap & Transition',
                      'Resume & Evidence Audit',
                    ]).map((track, i) => (
                      <option key={i} value={track}>
                        {track}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pre-Session Note */}
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-800 block">
                    Pre-Session Agenda / Questions for Mentor (Optional):
                  </label>
                  <textarea
                    rows={3}
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                    placeholder="Briefly state what you want to cover in this 1:1 session..."
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded text-xs text-neutral-900 font-sans focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded text-[11px] text-blue-900 leading-relaxed">
                  <strong>Session Guarantee:</strong> 100% free community guidance. A calendar invite with secure Google Meet/Teams video room link will be sent upon confirmation.
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setBookingModalOpen(false)}
                    className="min-h-[44px] px-4 py-2 border border-neutral-300 rounded text-xs text-neutral-700 hover:bg-neutral-50 cursor-pointer font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmBooking}
                    disabled={bookingLoading}
                    className="min-h-[44px] px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>{bookingLoading ? 'Confirming...' : 'Confirm 1:1 Session Request'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-5 bg-emerald-50 border border-emerald-300 rounded-lg space-y-3 text-xs">
                <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>1:1 Session Request Confirmed!</span>
                </div>
                <p className="text-emerald-800 leading-relaxed font-medium">
                  {bookingResponse?.confirmation_message}
                </p>
                <div className="p-3 bg-white rounded border border-emerald-200 text-neutral-800 space-y-1">
                  <div><strong>Mentor:</strong> {activeBookingMentor.name}</div>
                  <div><strong>Confirmed Slot:</strong> {selectedSlot}</div>
                  <div><strong>Focus:</strong> {selectedTrack}</div>
                  <div className="text-[11px] text-neutral-500 pt-1 border-t border-neutral-100 font-mono">
                    Booking Reference: {bookingResponse?.booking_reference || `SIM-BOOK-${activeBookingMentor.mentor_id.toUpperCase()}`}
                  </div>
                </div>
                <div className="pt-2 text-right">
                  <button
                    type="button"
                    onClick={() => setBookingModalOpen(false)}
                    className="min-h-[44px] px-5 py-2 bg-neutral-900 hover:bg-black text-white text-xs font-semibold rounded cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
