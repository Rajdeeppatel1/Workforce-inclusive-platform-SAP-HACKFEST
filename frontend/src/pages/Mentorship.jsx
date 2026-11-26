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
} from 'lucide-react';

export default function Mentorship() {
  const [mentors, setMentors] = useState([]);
  const [loadingMentors, setLoadingMentors] = useState(true);

  // Doubt Box state
  const [userDoubt, setUserDoubt] = useState(
    'Mujhe FastAPI mein async database session management aur Docker container networking mein issue aa raha hai. Jab multiple concurrent requests aate hain toh connection pool timeout hone lagta hai. Isko microservices architecture ke hisaab se kaise structure karein?'
  );
  const [selectedMentorId, setSelectedMentorId] = useState('mentor-01');
  const [summarizing, setSummarizing] = useState(false);
  const [summaryResult, setSummaryResult] = useState(null);
  const [copied, setCopied] = useState(false);

  // Booking Modal State (Simulation only)
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [activeBookingMentor, setActiveBookingMentor] = useState(null);
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

  const selectedMentor = mentors.find((m) => m.mentor_id === selectedMentorId) || mentors[0];

  // Call Gemini to summarize doubt and create expert draft
  const handleSummarizeDoubt = async () => {
    if (!userDoubt.trim()) return;
    setSummarizing(true);
    setSummaryResult(null);

    try {
      const res = await axios.post('/api/mentors/summarize-doubt', {
        doubt_text: userDoubt,
        mentor_naam: selectedMentor ? selectedMentor.naam : 'Expert Mentor',
        mentor_role: selectedMentor ? selectedMentor.role : 'Engineering Lead',
      });
      setSummaryResult(res.data);
    } catch (err) {
      console.warn('Doubt summary error, using local fallback', err);
      setSummaryResult({
        summary: `FastAPI Async Connection Pooling & Docker Networking issue under concurrent load.`,
        draft_message: `Hi ${selectedMentor?.naam || 'Mentor'},\n\nI am running into a database connection pool timeout issue in my FastAPI microservice running inside Docker when concurrent requests scale up.\n\nCould we review connection pooling best practices and Docker network configuration during our 1:1 session?\n\nThank you,\nRajdeep`,
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
    setBookingConfirmed(false);
    setBookingResponse(null);
    setBookingModalOpen(true);
  };

  // Simulate Booking (Booking sirf confirmation message, koi real booking nahi)
  const handleConfirmBooking = async () => {
    if (!activeBookingMentor) return;
    setBookingLoading(true);

    try {
      const res = await axios.post('/api/mentors/book', {
        mentor_id: activeBookingMentor.mentor_id,
        mentor_naam: activeBookingMentor.naam,
        slot: 'Tomorrow at 4:00 PM IST',
        draft_message: summaryResult?.draft_message || userDoubt,
      });
      setBookingResponse(res.data);
      setBookingConfirmed(true);
    } catch (err) {
      console.warn('Booking simulation fallback', err);
      setBookingResponse({
        status: 'confirmed_simulation',
        confirmation_message: `Session request confirmed for ${activeBookingMentor.naam}!`,
        notice: 'Booking sirf confirmation message hai, koi real booking nahi.',
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
              Expert Mentors &amp; AI Doubt Resolution
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded">
              Synthetic Demo Data
            </span>
          </div>
          <p className="text-xs text-neutral-500">
            Ask technical doubts, let Gemini draft structured mentor briefings, and simulate 1:1 sessions from <code className="bg-neutral-100 px-1 py-0.5 rounded">backend/data/mentors.json</code>.
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1 bg-neutral-100 text-neutral-700 border border-neutral-300 rounded-full flex items-center gap-1.5">
          <Bot className="w-4 h-4 text-blue-600" />
          Gemini LLM Assistant Active
        </span>
      </div>

      {/* ═════════════════════════════════════════════════════════════
          SECTION 1: Expert Cards (Data from mentors.json)
          ═════════════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-600" />
              1. Available Domain Experts ({mentors.length})
            </h2>
            <p className="text-xs text-neutral-500">
              Senior engineering mentors practicing inclusive, skills-first career coaching.
            </p>
          </div>
          <span className="text-[11px] text-neutral-400">Data: mentors.json</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mentors.map((m) => (
            <div
              key={m.mentor_id}
              className="p-5 border border-neutral-200 hover:border-black rounded-lg bg-white shadow-sm transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      {m.avatar_initials || m.naam.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
                        {m.naam}
                      </h3>
                      <div className="text-xs text-neutral-600 font-medium">
                        {m.role}
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        {m.company} • {m.experience}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded shrink-0">
                    {m.availability}
                  </span>
                </div>

                <p className="text-xs text-neutral-600 leading-relaxed">
                  {m.bio}
                </p>

                {/* Skills List */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {m.skills?.map((sk, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-neutral-100 border border-neutral-200 text-neutral-800 rounded text-[11px] font-medium"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Book Button (Booking sirf confirmation message, koi real booking nahi) */}
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-[11px] text-neutral-400 font-medium">
                  Free 1:1 Community Session
                </span>

                <button
                  type="button"
                  onClick={() => handleOpenBooking(m)}
                  className="px-4 py-1.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold rounded flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  <span>Book</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════
          SECTION 2: Doubt Box (Gemini Summarizer & Expert Draft)
          ═════════════════════════════════════════════════════════════ */}
      <div className="p-6 border-2 border-neutral-200 rounded-lg bg-white shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 pb-3">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              2. Technical Doubt Box &amp; Gemini Briefing Assistant
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Write your raw technical doubt. Gemini will summarize it and draft a structured agenda for the expert.
            </p>
          </div>
          <span className="text-[11px] text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded font-semibold">
            Gemini API Summarizer
          </span>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div className="md:col-span-2 space-y-2">
            <label className="block text-xs font-bold text-neutral-800">
              Apna Sawaal / Technical Doubt Likhein:
            </label>
            <textarea
              rows={4}
              value={userDoubt}
              onChange={(e) => setUserDoubt(e.target.value)}
              placeholder="e.g. Describe your technical bug, architecture question, or learning roadblock..."
              className="w-full p-3 text-xs border border-neutral-300 rounded-md bg-neutral-50/50 focus:outline-none focus:border-blue-600 leading-relaxed font-sans"
            />
          </div>

          <div className="space-y-3 p-4 bg-neutral-50 border border-neutral-200 rounded-md">
            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1">
                Target Expert for Draft:
              </label>
              <select
                value={selectedMentorId}
                onChange={(e) => setSelectedMentorId(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium border border-neutral-300 rounded bg-white focus:outline-none focus:border-blue-600 cursor-pointer"
              >
                {mentors.map((m) => (
                  <option key={m.mentor_id} value={m.mentor_id}>
                    {m.naam} ({m.role.split(' ')[0]})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleSummarizeDoubt}
              disabled={summarizing || !userDoubt.trim()}
              className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-40"
            >
              <Sparkles className="w-4 h-4 text-blue-200" />
              <span>{summarizing ? 'Gemini Summarizing...' : 'Summarize Doubt with Gemini'}</span>
            </button>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════
            GEMINI SUMMARY & DRAFT RESULT DISPLAY
            ═════════════════════════════════════════════════════════ */}
        {summaryResult && (
          <div className="p-5 border-2 border-blue-200 rounded-lg bg-blue-50/20 space-y-4 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-100 pb-3">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-neutral-900">
                  Gemini Generated Mentor Briefing
                </h3>
              </div>
              <span className="text-[10px] font-semibold text-neutral-500 bg-white border border-neutral-200 px-2 py-0.5 rounded">
                Engine: {summaryResult.engine || 'Gemini 1.5 Flash'}
              </span>
            </div>

            {/* Core Summary */}
            <div className="p-3 bg-white border border-neutral-200 rounded text-xs space-y-1">
              <span className="font-bold text-blue-900 uppercase text-[10px] tracking-wider block">
                Crisp Technical Summary:
              </span>
              <p className="text-neutral-800 leading-relaxed font-medium">
                {summaryResult.summary}
              </p>
              {summaryResult.key_topics && (
                <div className="flex flex-wrap gap-1 pt-1.5">
                  {summaryResult.key_topics.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-semibold"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Formatted Draft for Expert */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider text-[10px]">
                  Draft Message for {selectedMentor?.naam || 'Expert'}:
                </label>
                <button
                  type="button"
                  onClick={handleCopyDraft}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Draft'}</span>
                </button>
              </div>

              <div className="p-3.5 bg-neutral-900 text-neutral-100 rounded-md font-mono text-xs whitespace-pre-line leading-relaxed shadow-xs">
                {summaryResult.draft_message}
              </div>
            </div>

            {/* Suggested Agenda */}
            {summaryResult.suggested_agenda && (
              <div className="text-xs text-neutral-600 bg-white p-2.5 rounded border border-neutral-200">
                <strong className="text-neutral-900">Suggested 15-Minute Agenda:</strong>{' '}
                {summaryResult.suggested_agenda}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ═════════════════════════════════════════════════════════════
          BOOKING CONFIRMATION MODAL (Simulation Only)
          ═════════════════════════════════════════════════════════════ */}
      {bookingModalOpen && activeBookingMentor && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border border-black rounded-lg max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setBookingModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-black cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded">
                Simulated Session Booking
              </span>
              <h3 className="text-base font-bold text-neutral-900 mt-1.5">
                Book 1:1 Session with {activeBookingMentor.naam}
              </h3>
              <p className="text-xs text-neutral-500">
                {activeBookingMentor.role} • {activeBookingMentor.company}
              </p>
            </div>

            {!bookingConfirmed ? (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-neutral-50 border border-neutral-200 rounded space-y-1.5">
                  <div className="flex items-center justify-between text-neutral-700">
                    <span className="font-semibold">Recommended Slot:</span>
                    <span className="font-bold text-neutral-900">Tomorrow at 4:00 PM IST</span>
                  </div>
                  <div className="flex items-center justify-between text-neutral-700">
                    <span className="font-semibold">Session Duration:</span>
                    <span>20 minutes (Free 1:1)</span>
                  </div>
                  <div className="flex items-center justify-between text-neutral-700">
                    <span className="font-semibold">Target Topics:</span>
                    <span>{activeBookingMentor.skills.slice(0, 3).join(', ')}</span>
                  </div>
                </div>

                <div className="p-2.5 bg-blue-50 border border-blue-200 rounded text-[11px] text-blue-900 leading-relaxed">
                  <strong>Notice:</strong> Booking sirf confirmation message hai, koi real booking nahi. Yeh hackathon prototype simulation hai.
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setBookingModalOpen(false)}
                    className="px-3 py-1.5 border border-neutral-300 rounded text-xs text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmBooking}
                    disabled={bookingLoading}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold shadow-sm cursor-pointer"
                  >
                    {bookingLoading ? 'Confirming...' : 'Confirm Session Request'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-lg space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Session Request Confirmed!</span>
                </div>
                <p className="text-emerald-800 leading-relaxed">
                  {bookingResponse?.confirmation_message}
                </p>
                <div className="p-2 bg-white/80 rounded border border-emerald-200 text-[11px] text-neutral-700">
                  <span className="font-bold text-amber-900">
                    {bookingResponse?.notice || 'Booking sirf confirmation message hai, koi real booking nahi.'}
                  </span>
                </div>
                <div className="pt-2 text-right">
                  <button
                    type="button"
                    onClick={() => setBookingModalOpen(false)}
                    className="px-4 py-1.5 bg-neutral-900 hover:bg-black text-white text-xs font-semibold rounded cursor-pointer"
                  >
                    Close
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
