import React, { useState, useEffect } from 'react';
import axios from 'axios';
import fallbackRoles from '../data/roles.json';
import {
  Upload,
  Trash2,
  ShieldCheck,
  Sparkles,
  Check,
  X,
  Edit3,
  BarChart3,
  FileText,
  Download,
  AlertCircle,
  Loader2,
  Send,
} from 'lucide-react';

export default function OnboardingPipelinePanel({ profile, transcript, onSkillsConfirmed }) {
  const userId = profile?.profile_id || 'seed_rajdeep_patel_01';
  const authHeaders = { 'X-User-Id': userId };

  // Step 1: Resume Upload
  const [uploading, setUploading] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const [uploadError, setUploadError] = useState('');

  // Step 2: Voice Intro
  const [voiceSaving, setVoiceSaving] = useState(false);
  const [voiceData, setVoiceData] = useState(null);
  const [voiceError, setVoiceError] = useState('');

  // Step 3: Gemini Extraction & Candidates
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [confirmedSkills, setConfirmedSkills] = useState([]);

  // Step 4: Match & Explanation
  const [roles, setRoles] = useState(fallbackRoles.roles || []);
  const [selectedRoleId, setSelectedRoleId] = useState(
    fallbackRoles.roles?.[0]?.role_id || 'role-fsd-01'
  );
  const [runningAnalysis, setRunningAnalysis] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [allRolesAnalysis, setAllRolesAnalysis] = useState([]);
  const [explaining, setExplaining] = useState(false);
  const [explanationResult, setExplanationResult] = useState(null);
  const [analysisError, setAnalysisError] = useState('');

  // Cleanup state
  const [cleaning, setCleaning] = useState(false);
  const [cleanupNotice, setCleanupNotice] = useState('');

  useEffect(() => {
    axios
      .get('/api/roles')
      .then((res) => {
        if (
          res.data &&
          typeof res.data === 'object' &&
          !Array.isArray(res.data) &&
          Array.isArray(res.data.roles) &&
          res.data.roles.length > 0
        ) {
          setRoles(res.data.roles);
        }
      })
      .catch(() => {});

    axios
      .get('/api/onboarding/candidates', { headers: authHeaders })
      .then((res) => {
        if (res.data && typeof res.data === 'object' && Array.isArray(res.data.candidates)) {
          setCandidates(res.data.candidates);
        }
      })
      .catch(() => {});
  }, [userId]);

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError('');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await axios.post('/api/resume/upload', formData, {
        headers: { ...authHeaders, 'Content-Type': 'multipart/form-data' },
      });
      setResumeData(res.data);
    } catch (err) {
      setUploadError(err.response?.data?.detail || 'Resume upload failed.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDeleteResume = async () => {
    if (!resumeData?.id) return;
    try {
      await axios.delete(`/api/resume/${resumeData.id}`, { headers: authHeaders });
      setResumeData(null);
    } catch (err) {
      setUploadError(err.response?.data?.detail || 'Could not delete resume.');
    }
  };

  const handleSaveVoiceIntro = async () => {
    setVoiceError('');
    setVoiceSaving(true);
    try {
      const cleanText = (transcript || '').replace(/^"|"$/g, '').trim();
      const res = await axios.post(
        '/api/voice/intro',
        { transcript: cleanText },
        { headers: authHeaders }
      );
      setVoiceData(res.data);
    } catch (err) {
      setVoiceError(err.response?.data?.detail || 'Failed to save voice intro.');
    } finally {
      setVoiceSaving(false);
    }
  };

  const handleExtractSkills = async () => {
    setExtractError('');
    setExtracting(true);
    try {
      const res = await axios.post('/api/onboarding/extract', {}, { headers: authHeaders });
      setCandidates(res.data?.candidates || []);
    } catch (err) {
      setExtractError(err.response?.data?.detail || 'Skill extraction failed.');
    } finally {
      setExtracting(false);
    }
  };

  const handlePatchCandidate = async (candId, status, newName = null) => {
    try {
      const payload = { status };
      if (newName) payload.skill_name = newName;
      const res = await axios.patch(
        `/api/onboarding/candidates/${candId}`,
        payload,
        { headers: authHeaders }
      );
      setCandidates((prev) => prev.map((c) => (c.id === candId ? res.data : c)));
      setEditingId(null);
    } catch (err) {
      setExtractError(err.response?.data?.detail || 'Failed to update candidate.');
    }
  };

  const handleConfirmAll = async () => {
    setConfirming(true);
    setExtractError('');
    try {
      const res = await axios.post('/api/onboarding/confirm', {}, { headers: authHeaders });
      const skills = res.data?.user_skills || [];
      setConfirmedSkills(skills);
      if (onSkillsConfirmed) {
        onSkillsConfirmed(skills.map((s) => s.skill_name));
      }
    } catch (err) {
      setExtractError(err.response?.data?.detail || 'Confirmation failed.');
    } finally {
      setConfirming(false);
    }
  };

  const computeLocalMatch = (role, skillsList) => {
    const userSet = new Set((skillsList || []).map((s) => s.trim().toLowerCase()));
    const req = role.required_skills || [];
    const nice = role.nice_to_have_skills || [];
    const matchedReq = req.filter((s) => userSet.has(s.toLowerCase()));
    const missingReq = req.filter((s) => !userSet.has(s.toLowerCase()));
    const matchedNice = nice.filter((s) => userSet.has(s.toLowerCase()));
    const missingNice = nice.filter((s) => !userSet.has(s.toLowerCase()));
    const reqRatio = req.length ? matchedReq.length / req.length : 1.0;
    const niceRatio = nice.length ? matchedNice.length / nice.length : 1.0;
    let score = reqRatio * 0.8 + niceRatio * 0.2;
    const minLevel = Number(role.min_level || 1);
    const candLevel = skillsList.length > 0 ? 1 : 0;
    let levelCapped = false;
    if (candLevel < minLevel && score > 0.65) {
      score = 0.65;
      levelCapped = true;
    }
    score = Math.round(score * 10000) / 10000;
    return {
      run_id: `local_${role.role_id}`,
      role_id: role.role_id,
      role_title: role.title,
      score,
      score_percent: Math.round(score * 1000) / 10,
      level_capped: levelCapped,
      min_level: minLevel,
      evaluated_skills: skillsList,
      matched_skills: [...matchedReq, ...matchedNice],
      missing_skills: [...missingReq, ...missingNice],
      matched_required: matchedReq,
      missing_required: missingReq,
      matched_nice: matchedNice,
      missing_nice: missingNice,
    };
  };

  const buildLocalExplanation = (m) => {
    const suitable = m.score >= 0.7;
    const matchedStr = m.matched_skills.length ? m.matched_skills.join(', ') : 'none recorded yet';
    const missingStr = m.missing_skills.length ? m.missing_skills.join(', ') : 'no major skill gaps';
    const s1 = suitable
      ? `You are suitable for this role with a verified match score of ${m.score_percent}%.`
      : `Your current match score is ${m.score_percent}%, which is below the suitability threshold.`;
    return {
      explanation: `${s1} Your confirmed strengths include ${matchedStr}. Key skills to develop next are ${missingStr}. Focus on closing these gaps through practice projects and skill assessments.`,
      suitable,
    };
  };

  const handleRunAnalysis = async (overrideRoleId = null) => {
    const targetRoleId = typeof overrideRoleId === 'string' ? overrideRoleId : selectedRoleId;
    setRunningAnalysis(true);
    setAnalysisError('');
    setExplanationResult(null);

    const activeSkills =
      confirmedSkills.length > 0
        ? confirmedSkills.map((s) => s.skill_name)
        : profile?.skills || [];

    const runLocalFallback = () => {
      const roleObj = roles.find((r) => r.role_id === targetRoleId) || roles[0];
      if (!roleObj) return;
      const primary = computeLocalMatch(roleObj, activeSkills);
      setAnalysisResult(primary);
      setAllRolesAnalysis(roles.map((r) => computeLocalMatch(r, activeSkills)));
      setExplanationResult(buildLocalExplanation(primary));
    };

    try {
      const res = await axios.post(
        '/api/analysis/run',
        { role_id: targetRoleId, skills: activeSkills },
        { headers: authHeaders }
      );
      if (!res.data || typeof res.data !== 'object' || typeof res.data.score_percent !== 'number') {
        runLocalFallback();
        return;
      }
      setAnalysisResult(res.data);

      if (roles.length > 0) {
        const otherResults = await Promise.all(
          roles.map((r) =>
            r.role_id === targetRoleId
              ? Promise.resolve(res.data)
              : axios
                  .post(
                    '/api/analysis/run',
                    { role_id: r.role_id, skills: activeSkills },
                    { headers: authHeaders }
                  )
                  .then((x) => (x.data && typeof x.data.score_percent === 'number' ? x.data : computeLocalMatch(r, activeSkills)))
                  .catch(() => computeLocalMatch(r, activeSkills))
          )
        );
        setAllRolesAnalysis(otherResults.filter(Boolean));
      }

      setExplaining(true);
      try {
        const expRes = await axios.post(
          '/api/analysis/explain',
          { run_id: res.data.run_id },
          { headers: authHeaders }
        );
        if (expRes.data && typeof expRes.data === 'object' && expRes.data.explanation) {
          setExplanationResult(expRes.data);
        } else {
          setExplanationResult(buildLocalExplanation(res.data));
        }
      } catch {
        setExplanationResult(buildLocalExplanation(res.data));
      } finally {
        setExplaining(false);
      }
    } catch {
      runLocalFallback();
    } finally {
      setRunningAnalysis(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!analysisResult?.run_id) return;
    try {
      const res = await axios.get(`/api/resume/generate/${analysisResult.run_id}`, {
        headers: authHeaders,
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `skillnav_resume_${analysisResult.run_id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setAnalysisError(err.response?.data?.detail || 'Could not generate PDF.');
    }
  };

  const handleCleanupData = async () => {
    setCleaning(true);
    setCleanupNotice('');
    try {
      const res = await axios.delete('/api/user/data', { headers: authHeaders });
      setResumeData(null);
      setVoiceData(null);
      setCandidates([]);
      setCleanupNotice(
        `Cleaned ${res.data.uploads_removed} uploads, ${res.data.voice_intros_removed} voice intros, ${res.data.candidates_removed} candidates.`
      );
    } catch (err) {
      setCleanupNotice(err.response?.data?.detail || 'Cleanup failed.');
    } finally {
      setCleaning(false);
    }
  };

  return (
    <section className="sn-card p-6 md:p-8 flex flex-col gap-6 border-2 border-blue-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <h2 className="font-headline text-heading-sm text-on-surface font-bold">
              Verified Onboarding Pipeline (Resume, Redaction, AI Extraction &amp; Match PDF)
            </h2>
          </div>
          <p className="text-xs text-on-surface-muted mt-1">
            Upload your PDF/DOCX resume &amp; voice intro. All PII (email, phone, PIN, address, name, gender, college) is redacted before storage or Gemini extraction.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCleanupData}
          disabled={cleaning}
          className="min-h-[40px] px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{cleaning ? 'Deleting...' : 'Delete My Data'}</span>
        </button>
      </div>

      {cleanupNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-900 font-medium">
          {cleanupNotice}
        </div>
      )}

      {/* 1. Resume Upload & Redaction */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-surface-elevated border border-outline rounded space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-primary" />
              1. Upload Resume (PDF / DOCX, max 5 MB)
            </h3>
            {resumeData && (
              <button
                type="button"
                onClick={handleDeleteResume}
                className="text-[11px] text-rose-700 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" /> Delete File
              </button>
            )}
          </div>

          <label className="min-h-[44px] w-full border border-dashed border-primary/50 bg-blue-50/40 hover:bg-blue-50 rounded flex items-center justify-center gap-2 text-xs font-semibold text-primary cursor-pointer px-4 py-2.5">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            <span>{uploading ? 'Extracting & Redacting...' : 'Choose PDF or DOCX Resume'}</span>
            <input
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleResumeUpload}
              className="hidden"
            />
          </label>

          {uploadError && (
            <p className="text-xs text-rose-700 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {uploadError}
            </p>
          )}

          {resumeData && (
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded">
                <span>✓ {resumeData.filename}</span>
                <span>{resumeData.redaction_count} PII items redacted</span>
              </div>
              <div className="p-2.5 bg-white border border-outline rounded max-h-28 overflow-y-auto font-mono text-[11px] text-neutral-700 whitespace-pre-wrap">
                {resumeData.redacted_text}
              </div>
            </div>
          )}
        </div>

        {/* 2. Save Voice Intro (Redacted) */}
        <div className="p-4 bg-surface-elevated border border-outline rounded space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface flex items-center gap-1.5">
            <Send className="w-4 h-4 text-primary" />
            2. Save Redacted Voice Intro (max 3000 chars)
          </h3>
          <p className="text-[11px] text-on-surface-muted">
            Saves your spoken/typed intro above after stripping PII (names, phones, emails, gender pronouns, colleges).
          </p>
          <button
            type="button"
            onClick={handleSaveVoiceIntro}
            disabled={voiceSaving}
            className="min-h-[44px] w-full bg-neutral-900 hover:bg-black text-white rounded text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
          >
            {voiceSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            <span>{voiceSaving ? 'Redacting & Saving...' : 'Redact & Save Voice Intro'}</span>
          </button>

          {voiceError && (
            <p className="text-xs text-rose-700 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {voiceError}
            </p>
          )}

          {voiceData && (
            <div className="space-y-1.5 text-xs">
              <div className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded">
                ✓ Saved ({voiceData.char_count} chars, {voiceData.redaction_count} redacted)
              </div>
              <div className="p-2 bg-white border border-outline rounded max-h-20 overflow-y-auto font-mono text-[11px] text-neutral-700">
                {voiceData.redacted_text}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Gemini Skill Extraction & Candidate Review */}
      <div className="p-4 bg-surface-elevated border border-outline rounded space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary" />
              3. AI Skill Extraction &amp; Human Confirmation
            </h3>
            <p className="text-[11px] text-on-surface-muted mt-0.5">
              Extracts skills grounded in verbatim quotes from your redacted text against our 60-skill taxonomy.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExtractSkills}
              disabled={extracting}
              className="min-h-[40px] px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              {extracting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>{extracting ? 'Extracting...' : 'Extract Skills (Gemini)'}</span>
            </button>
            {candidates.some((c) => c.status === 'confirmed' || c.status === 'edited') && (
              <button
                type="button"
                onClick={handleConfirmAll}
                disabled={confirming}
                className="min-h-[40px] px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{confirming ? 'Saving...' : 'Commit Confirmed Skills'}</span>
              </button>
            )}
          </div>
        </div>

        {extractError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{extractError}</span>
          </div>
        )}

        {candidates.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {candidates.map((c) => (
              <div
                key={c.id}
                className={`p-3 rounded border bg-white flex flex-col justify-between gap-2 ${
                  c.status === 'confirmed' || c.status === 'edited'
                    ? 'border-emerald-400 bg-emerald-50/20'
                    : c.status === 'rejected'
                    ? 'border-rose-200 opacity-60'
                    : 'border-outline'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    {editingId === c.id ? (
                      <div className="flex items-center gap-1.5 flex-1">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="sn-input py-1 text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => handlePatchCandidate(c.id, 'edited', editValue)}
                          className="px-2 py-1 bg-primary text-white rounded text-[11px] font-bold cursor-pointer"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-neutral-900">{c.skill_name}</span>
                    )}
                    <div className="flex items-center gap-1">
                      {c.needs_confirmation && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-100 text-amber-900 rounded">
                          Low conf ({Math.round(c.confidence * 100)}%)
                        </span>
                      )}
                      <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 bg-neutral-100 text-neutral-700 rounded">
                        {c.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-neutral-500 italic mt-1">
                    &ldquo;{c.evidence_quote}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-1.5 pt-2 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => handlePatchCandidate(c.id, 'confirmed')}
                    className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white border border-emerald-200 rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3 h-3" /> Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(c.id);
                      setEditValue(c.skill_name);
                    }}
                    className="px-2.5 py-1 bg-neutral-50 hover:bg-neutral-200 text-neutral-700 border border-neutral-200 rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePatchCandidate(c.id, 'rejected')}
                    className="px-2.5 py-1 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3 h-3" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {confirmedSkills.length > 0 && (
          <div className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 p-2.5 rounded">
            ✓ Confirmed {confirmedSkills.length} verified skills saved to database:{' '}
            {confirmedSkills.map((s) => s.skill_name).join(', ')}
          </div>
        )}
      </div>

      {/* 4. Role Match, Explanation & Resume PDF */}
      <div className="p-4 bg-surface-elevated border border-outline rounded space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-primary" />
              4. Deterministic Match, Explanation &amp; Resume PDF
            </h3>
            <p className="text-[11px] text-on-surface-muted mt-0.5">
              Evaluates confirmed skills (80% required, 20% nice-to-have) without any protected attributes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedRoleId}
              onChange={(e) => {
                const nextId = e.target.value;
                setSelectedRoleId(nextId);
                if (analysisResult) {
                  handleRunAnalysis(nextId);
                }
              }}
              className="min-h-[40px] px-3 py-1.5 border border-outline rounded bg-white text-xs font-medium text-neutral-900 cursor-pointer relative z-10"
              aria-label="Select target role"
            >
              {roles.map((r) => (
                <option key={r.role_id} value={r.role_id}>
                  {r.title}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => handleRunAnalysis()}
              disabled={runningAnalysis}
              className="min-h-[40px] px-4 py-2 bg-neutral-900 hover:bg-black text-white rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              {runningAnalysis ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <BarChart3 className="w-3.5 h-3.5" />}
              <span>{runningAnalysis ? 'Analyzing...' : 'Run Match & Explain'}</span>
            </button>
          </div>
        </div>

        {analysisError && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{analysisError}</span>
          </div>
        )}

        {analysisResult && (
          <div className="p-4 bg-white border border-outline rounded space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs text-neutral-500 font-semibold">
                  {analysisResult.role_title}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-neutral-900">
                    {analysisResult.score_percent}% Match
                  </span>
                  {analysisResult.level_capped && (
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-900 rounded">
                      Level Capped (min level {analysisResult.min_level})
                    </span>
                  )}
                </div>
                {analysisResult.evaluated_skills?.length > 0 && (
                  <div className="text-[11px] text-neutral-500 mt-1">
                    Evaluated Skills: <span className="font-medium text-neutral-700">{analysisResult.evaluated_skills.join(', ')}</span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleDownloadPdf}
                className="min-h-[44px] px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Download Resume PDF</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded space-y-1">
                <div className="font-bold text-emerald-900">
                  Matched Skills ({analysisResult.matched_skills?.length || 0})
                </div>
                <div className="text-emerald-950">
                  <span className="font-semibold">Required (80%): </span>
                  {analysisResult.matched_required?.length ? analysisResult.matched_required.join(', ') : 'None'}
                </div>
                <div className="text-emerald-800">
                  <span className="font-semibold">Nice-to-Have (20%): </span>
                  {analysisResult.matched_nice?.length ? analysisResult.matched_nice.join(', ') : 'None'}
                </div>
              </div>
              <div className="p-3 bg-amber-50/60 border border-amber-200 rounded space-y-1">
                <div className="font-bold text-amber-900">
                  Role-Specific Skill Gaps ({analysisResult.missing_skills?.length || 0})
                </div>
                <div className="text-amber-950">
                  <span className="font-semibold">Missing Required: </span>
                  {analysisResult.missing_required?.length ? analysisResult.missing_required.join(', ') : 'None!'}
                </div>
                <div className="text-amber-800">
                  <span className="font-semibold">Missing Nice-to-Have: </span>
                  {analysisResult.missing_nice?.length ? analysisResult.missing_nice.join(', ') : 'None!'}
                </div>
              </div>
            </div>

            {explaining && (
              <div className="text-xs text-neutral-500 flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating explanation...
              </div>
            )}

            {explanationResult && (
              <div className="p-3 bg-blue-50/60 border border-blue-200 rounded text-xs text-neutral-800 leading-relaxed">
                <div className="font-bold text-blue-950 mb-1 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-700" />
                  Match Explanation {explanationResult.suitable ? '• Suitable (≥70%)' : ''}
                </div>
                {explanationResult.explanation}
              </div>
            )}

            {/* All Roles Comparison Grid */}
            {allRolesAnalysis.length > 1 && (
              <div className="pt-3 border-t border-neutral-100 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                  Comparison Across All 5 Roles (Click any role to inspect)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {allRolesAnalysis.map((roleRes) => {
                    const isSelected = roleRes.role_id === analysisResult.role_id;
                    return (
                      <button
                        key={roleRes.role_id}
                        type="button"
                        onClick={() => {
                          setSelectedRoleId(roleRes.role_id);
                          handleRunAnalysis(roleRes.role_id);
                        }}
                        className={`p-3 rounded border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                            : 'border-neutral-200 hover:border-neutral-400 bg-neutral-50/50'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-neutral-900 truncate">
                            {roleRes.role_title}
                          </span>
                          <span className="text-xs font-black text-blue-700 shrink-0">
                            {roleRes.score_percent}%
                          </span>
                        </div>
                        <div className="text-[11px] text-amber-800 mt-1 line-clamp-2">
                          <span className="font-semibold">Gaps: </span>
                          {roleRes.missing_skills?.length
                            ? roleRes.missing_skills.join(', ')
                            : 'None'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
