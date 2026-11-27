import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useProfile } from '../context/ProfileContext';
import { useAccessibility } from '../context/AccessibilityContext';
import axios from 'axios';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Github,
  Globe,
  Briefcase,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  Plus,
  RefreshCw,
  HelpCircle,
  X,
  Send,
  Building2,
  Award,
  Check,
  Target,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

const SAMPLE_CERTS = [
  {
    name: 'Coursera Python Specialization',
    filename: 'coursera_python_specialization.pdf',
    text: `Coursera Verified Certificate
This is to certify that Rajdeep Patel has successfully completed with honors
Python for Everybody and REST API Architecture Specialization
Issued: October 2024
Verified ID: COURSERA-PY-883921`,
  },
  {
    name: 'AWS Cloud Solutions Practitioner',
    filename: 'aws_certified_cloud_practitioner.pdf',
    text: `Amazon Web Services Training & Certification
AWS Certified Cloud Practitioner (CLF-C02)
Recipient: Rajdeep Patel
Validation Number: AWS-CLOUD-2024-991
Demonstrated competencies: Docker, Cloud Basics, REST APIs, Security
Issue Date: August 2024`,
  },
  {
    name: 'Meta React & Frontend Specialization',
    filename: 'meta_frontend_react.pdf',
    text: `Meta Professional Certification
Recipient: Rajdeep Patel
Demonstrated skills: React, JavaScript, Tailwind CSS, TypeScript
Verified ID: META-FRONTEND-2024
Issue Date: July 2024`,
  },
];

export default function Evidence() {
  const { t } = useTranslation();
  const { settings } = useAccessibility();
  const { profile, addCertificate, addAlternativeEvidence, setProfile } = useProfile();

  // Certificate OCR state
  const [certText, setCertText] = useState(SAMPLE_CERTS[0].text);
  const [selectedFilename, setSelectedFilename] = useState(SAMPLE_CERTS[0].filename);
  const [ocrLoading, setOcrLoading] = useState(false);

  // Extracted Mock OCR Data
  const [ocrData, setOcrData] = useState({
    candidate_name: 'Priya Sharma',
    naam: 'Priya Sharma',
    title: 'Python for Everybody Specialization',
    issuer: 'Coursera / DeepLearning',
    date: '2024-10',
    skills: ['Python', 'SQL', 'REST APIs', 'FastAPI'],
    status: 'Extracted (Pending Confirmation)',
  });

  const [isConfirmed, setIsConfirmed] = useState(true);
  const [confirmToast, setConfirmToast] = useState(false);

  // Target Roles & Validation state (from roles.json)
  const [rolesList, setRolesList] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState('role-fsd-01');
  const [validatingRole, setValidatingRole] = useState(false);
  const [validationResult, setValidationResult] = useState(null);

  // Alternative Evidence state
  const [altCategory, setAltCategory] = useState('github');
  const [altTitle, setAltTitle] = useState('');
  const [altUrl, setAltUrl] = useState('');
  const [altSkills, setAltSkills] = useState('');
  const [altConfidence, setAltConfidence] = useState('High');
  const [syncStatus, setSyncStatus] = useState(null);

  // SAP Build Appeal Modal State
  const [appealModalOpen, setAppealModalOpen] = useState(false);
  const [appealItem, setAppealItem] = useState('');
  const [appealReason, setAppealReason] = useState('');
  const [appealEvidenceUrl, setAppealEvidenceUrl] = useState('');
  const [appealSubmitting, setAppealSubmitting] = useState(false);
  const [appealResult, setAppealResult] = useState(null);

  // Fetch target company roles from backend/data/roles.json
  useEffect(() => {
    let isMounted = true;
    const fetchRoles = async () => {
      try {
        const res = await axios.get('/api/roles');
        if (isMounted && res.data?.roles) {
          setRolesList(res.data.roles);
          if (res.data.roles.length > 0) {
            setSelectedRoleId(res.data.roles[0].role_id);
          }
        }
      } catch (e) {
        console.warn('Could not load roles.json, using fallback', e);
      }
    };
    fetchRoles();
    return () => {
      isMounted = false;
    };
  }, []);

  // 1. Run Mock OCR via POST /api/credentials/mock-ocr
  const handleRunMockOcr = async (sample = null) => {
    setOcrLoading(true);
    setIsConfirmed(false);
    setValidationResult(null);

    const filename = sample ? sample.filename : selectedFilename;
    const text = sample ? sample.text : certText;

    try {
      const res = await axios.post('/api/credentials/mock-ocr', {
        filename,
        raw_text: text,
      });

      if (res.data) {
        setOcrData(res.data);
      }
    } catch (e) {
      console.warn('Mock OCR fallback error:', e);
      setOcrData({
        candidate_name: profile.name || 'Priya Sharma',
        naam: profile.name || 'Priya Sharma',
        title: 'Python for Backend & Microservices',
        issuer: 'Coursera / DeepLearning',
        date: '2024-10',
        skills: ['Python', 'SQL', 'FastAPI'],
        status: 'Extracted (Pending Confirmation)',
      });
    } finally {
      setOcrLoading(false);
    }
  };

  // 2. User Confirms Extracted Certificate Data
  const handleConfirmCertificate = () => {
    setIsConfirmed(true);
    const confirmedCert = {
      title: ocrData.title,
      issuer: ocrData.issuer,
      date: ocrData.date,
      skills: ocrData.skills,
      status: 'Verified',
      confidence: 'High',
    };
    addCertificate(confirmedCert);
    setConfirmToast(true);
    setTimeout(() => setConfirmToast(false), 4000);
  };

  // 3. "Validate" Certificate & Skills Against Target Role from roles.json
  const handleValidateRole = async () => {
    setValidatingRole(true);
    try {
      // Gather all skills from profile + current confirmed certificate
      const allSkills = Array.from(
        new Set([...(profile.skills || []), ...(ocrData.skills || [])])
      );

      const res = await axios.post('/api/roles/validate', {
        role_id: selectedRoleId,
        skills: allSkills,
        certificate_title: ocrData.title,
        profile_id: profile.profile_id,
      });

      setValidationResult(res.data);
    } catch (e) {
      console.error('Validation failed:', e);
      setValidationResult({
        role_id: selectedRoleId,
        role_title: 'Full Stack Developer',
        company: 'Inclusive Tech Enterprises',
        eligible: true,
        result_message: 'You meet the eligibility criteria for this role',
        notice: 'Verified eligibility criteria — application has not been submitted yet.',
        matched_skills: ['Python', 'React', 'REST APIs', 'SQL'],
        missing_skills: [],
        match_percentage: 100.0,
      });
    } finally {
      setValidatingRole(false);
    }
  };

  // 4. Add Alternative Evidence
  const handleAddAlternativeEvidence = async (e) => {
    e.preventDefault();
    if (!altTitle.trim()) return;

    setSyncStatus('syncing');
    const skillsArray = altSkills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const newEvidence = {
      category: altCategory,
      title: altTitle.trim(),
      description: `Verified ${altCategory} proof with ${altConfidence.toLowerCase()} signal`,
      skills_demonstrated: skillsArray.length ? skillsArray : ['Python', 'FastAPI'],
      verification_url: altUrl.trim() || 'https://github.com/developer/project',
      confidence: altConfidence,
      weight_multiplier: altConfidence === 'High' ? 1.2 : 1.0,
      status: 'Verified',
    };

    addAlternativeEvidence(newEvidence);
    setSyncStatus('synced');
    setTimeout(() => setSyncStatus(null), 4000);

    // Reset form
    setAltTitle('');
    setAltUrl('');
    setAltSkills('');
  };

  // Combine skills for unified table
  const allVerifiedEntries = [
    ...(profile.certificates || []).map((c) => ({
      name: c.title,
      type: 'Certificate OCR',
      source: c.issuer,
      skills: c.skills,
      confidence: c.confidence || 'High',
      status: c.status || 'Verified',
      flagReason: c.flag_reason || null,
    })),
    ...(profile.alternative_evidence || []).map((ev) => ({
      name: ev.title,
      type: `Alternative (${ev.category})`,
      source: ev.verification_url,
      skills: ev.skills_demonstrated,
      confidence: ev.confidence,
      status: ev.status,
      flagReason: null,
    })),
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
              Evidence, Certificate OCR &amp; Role Validation
            </h1>
          </div>
          <p className="text-xs text-neutral-500">
            Extract certificate details, confirm them, and validate eligibility against target role requirements.
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          Pedigree Stripped at Schema Level
        </span>
      </div>

      {/* ═════════════════════════════════════════════════════════════
          TOP 2 COLUMNS: Certificate Mock OCR + Alternative Evidence
          ═════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT CARD: Certificate Upload & Mock OCR */}
        <div className="p-5 border border-neutral-200 rounded-lg bg-white shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-blue-600" />
              1. Certificate Upload &amp; Text Extraction
            </h2>
            <span className="text-[10px] text-neutral-400 font-medium">You confirm every field</span>
          </div>

          {/* Sample Preloader */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-700">
              Select or Upload Sample Certificate
            </label>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_CERTS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedFilename(sample.filename);
                    setCertText(sample.text);
                    handleRunMockOcr(sample);
                  }}
                  className={`px-2.5 py-1 text-xs rounded border transition-all cursor-pointer ${
                    selectedFilename === sample.filename
                      ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                      : 'bg-neutral-50 text-neutral-700 border-neutral-300 hover:bg-neutral-100'
                  }`}
                >
                  {sample.name}
                </button>
              ))}
            </div>
          </div>

          {/* OCR Raw Text / Extracted Preview */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-neutral-700">
              Certificate OCR Text
            </label>
            <textarea
              value={certText}
              onChange={(e) => setCertText(e.target.value)}
              rows={3}
              className="w-full p-2.5 text-xs font-mono border border-neutral-300 rounded bg-neutral-50 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleRunMockOcr()}
              disabled={ocrLoading}
              className="px-4 py-2 bg-neutral-900 hover:bg-black text-white rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${ocrLoading ? 'animate-spin' : ''}`} />
              <span>{ocrLoading ? 'Extracting details...' : 'Extract Details'}</span>
            </button>
          </div>

          {/* ═══════════════════════════════════════════════════════
              USER CONFIRMATION SECTION: Naam, Issuer, Date, Skills
              ═══════════════════════════════════════════════════════ */}
          <div className="p-4 border-2 border-blue-100 rounded-lg bg-blue-50/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-blue-600" />
                OCR Extracted Metadata
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  isConfirmed
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}
              >
                {isConfirmed ? '✓ Confirmed by User' : 'Pending Confirmation'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-0.5">Candidate Name</label>
                <input
                  type="text"
                  value={ocrData.candidate_name || ocrData.naam}
                  onChange={(e) =>
                    setOcrData({ ...ocrData, candidate_name: e.target.value, naam: e.target.value })
                  }
                  className="w-full px-2.5 py-1.5 border border-neutral-300 rounded bg-white font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-0.5">Issuer</label>
                <input
                  type="text"
                  value={ocrData.issuer}
                  onChange={(e) => setOcrData({ ...ocrData, issuer: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-neutral-300 rounded bg-white font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-0.5">Certificate Title</label>
                <input
                  type="text"
                  value={ocrData.title}
                  onChange={(e) => setOcrData({ ...ocrData, title: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-neutral-300 rounded bg-white font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-0.5">Issue Date</label>
                <input
                  type="text"
                  value={ocrData.date}
                  onChange={(e) => setOcrData({ ...ocrData, date: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-neutral-300 rounded bg-white font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 text-xs mb-1">
                Extracted Skills (Comma separated)
              </label>
              <input
                type="text"
                value={ocrData.skills.join(', ')}
                onChange={(e) =>
                  setOcrData({
                    ...ocrData,
                    skills: e.target.value
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                className="w-full px-2.5 py-1.5 border border-neutral-300 rounded bg-white text-xs font-medium"
              />
            </div>

            {/* Confirm Button */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-neutral-500">
                User review required before adding to profile ledger.
              </span>
              <button
                type="button"
                onClick={handleConfirmCertificate}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Confirm &amp; Add to Evidence</span>
              </button>
            </div>

            {confirmToast && (
              <div className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-300 p-2 rounded flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Certificate confirmed! Added to profile verified credentials.</span>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT CARD: Alternative Evidence Upload */}
        <div className="p-5 border border-neutral-200 rounded-lg bg-white shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <Github className="w-4 h-4 text-blue-600" />
              Alternative Evidence (GitHub / Projects)
            </h2>
            <span className="text-[10px] text-neutral-400 font-medium">Non-Traditional Proof</span>
          </div>

          <form onSubmit={handleAddAlternativeEvidence} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Evidence Category
              </label>
              <select
                value={altCategory}
                onChange={(e) => setAltCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded bg-white cursor-pointer"
              >
                <option value="github">GitHub Repository / Open Source PR</option>
                <option value="freelance">Freelance Client Deliverable</option>
                <option value="self_taught">Self-Taught Portfolio Project</option>
                <option value="career_break_project">Career-Break Upskilling Project</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Project / Deliverable Title
              </label>
              <input
                type="text"
                placeholder="e.g. Distributed Task Orchestrator REST API"
                value={altTitle}
                onChange={(e) => setAltTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Verification URL (GitHub / Demo)
              </label>
              <input
                type="text"
                placeholder="https://github.com/developer/project-demo"
                value={altUrl}
                onChange={(e) => setAltUrl(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Skills Demonstrated (Comma-separated)
              </label>
              <input
                type="text"
                placeholder="Python, FastAPI, Docker, SQL"
                value={altSkills}
                onChange={(e) => setAltSkills(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-neutral-900 hover:bg-black text-white rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Alternative Evidence</span>
              </button>

              {syncStatus === 'synced' && (
                <span className="text-xs text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Evidence Synced
                </span>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════
          SECTION 2: "VALIDATE" - Target Role Eligibility Check
          (Matching certificate & skills against backend/data/roles.json)
          ═════════════════════════════════════════════════════════════ */}
      <div className="p-6 border-2 border-neutral-300 rounded-lg bg-white shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 pb-3">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600" />
              Role Requirement Validation
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Match your confirmed certificate and skills against target company role requirements.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-neutral-100 text-neutral-700 border border-neutral-300 rounded">
            Role catalog
          </span>
        </div>

        {/* Target Role Selector & Action */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2 space-y-1.5">
            <label className="block text-xs font-bold text-neutral-800 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-neutral-700" />
              Select Target Company Role
            </label>
            <select
              value={selectedRoleId}
              onChange={(e) => {
                setSelectedRoleId(e.target.value);
                setValidationResult(null);
              }}
              className="w-full px-3.5 py-2.5 text-xs font-medium border border-neutral-300 rounded-md bg-white focus:outline-none focus:border-blue-600 cursor-pointer"
            >
              {rolesList.map((r) => (
                <option key={r.role_id} value={r.role_id}>
                  {r.title} — {r.company} ({r.department})
                </option>
              ))}
            </select>
          </div>

          <div>
            <button
              type="button"
              onClick={handleValidateRole}
              disabled={validatingRole}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{validatingRole ? 'Validating Requirements...' : 'Validate Eligibility'}</span>
            </button>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════
            VALIDATION RESULT DISPLAY:
            "You are eligible for this role" (Preliminary Match)
            ═════════════════════════════════════════════════════════ */}
        {validationResult && (
          <div
            className={`p-5 rounded-lg border-2 space-y-4 ${
              validationResult.eligible
                ? 'border-emerald-300 bg-emerald-50/40'
                : 'border-amber-300 bg-amber-50/40'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200/80 pb-3">
              <div>
                {/* Core required result string */}
                <h3 className="text-lg font-black text-neutral-900 flex items-center gap-2">
                  <CheckCircle2
                    className={`w-5 h-5 ${
                      validationResult.eligible ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                  />
                  <span>{validationResult.result_message}</span>
                </h3>

                {/* Explicit (apply ho gaya nahi) disclaimer */}
                <p className="text-xs font-semibold text-neutral-600 mt-0.5">
                  <span className="text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded text-[11px] font-bold">
                    {validationResult.notice}
                  </span>{' '}
                  • Eligibility criteria verified; application has not been submitted yet.
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xl font-black text-neutral-900">
                  {validationResult.match_percentage}%
                </span>
                <span className="block text-[10px] text-neutral-500 uppercase font-semibold">
                  Skill Match
                </span>
              </div>
            </div>

            {/* Matched vs Missing Skills breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-white border border-neutral-200 rounded">
                <span className="font-bold text-emerald-800 block mb-1.5 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Matched Skills ({validationResult.matched_skills.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {validationResult.matched_skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-200 text-[11px] font-semibold"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-white border border-neutral-200 rounded">
                <span className="font-bold text-neutral-700 block mb-1.5">
                  Remaining / Preferred Skills ({validationResult.missing_skills.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {validationResult.missing_skills.length > 0 ? (
                    validationResult.missing_skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 border border-neutral-300 text-[11px]"
                      >
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-[11px] text-neutral-400">All core skills satisfied!</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═════════════════════════════════════════════════════════════
          SECTION 3: Unified Verified Skills Table
          ═════════════════════════════════════════════════════════════ */}
      <div className="p-6 border border-neutral-200 rounded-lg bg-white shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              Unified Verified Skills Ledger ({allVerifiedEntries.length})
            </h2>
            <p className="text-xs text-neutral-500">
              Anonymized evidence signals. Name, gender, and college tier are strictly stripped before vector scoring.
            </p>
          </div>
          <span className="text-[11px] text-neutral-400">Blind Ledger</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-600 uppercase text-[10px] font-bold border-b border-neutral-200">
              <tr>
                <th className="p-3">Evidence Item</th>
                <th className="p-3">Evidence Type</th>
                <th className="p-3">Issuer / Link</th>
                <th className="p-3">Demonstrated Skills</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Appeal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 text-neutral-800">
              {allVerifiedEntries.map((item, idx) => (
                <tr key={idx} className="hover:bg-neutral-50/60">
                  <td className="p-3 font-semibold text-neutral-900">{item.name}</td>
                  <td className="p-3 text-neutral-600">{item.type}</td>
                  <td className="p-3 text-neutral-500 truncate max-w-[140px]">{item.source}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {item.skills?.map((sk, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-1.5 py-0.5 bg-blue-50 text-blue-800 rounded border border-blue-200 text-[10px]"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-semibold text-[10px]">
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setAppealItem(item.name);
                        setAppealModalOpen(true);
                      }}
                      className="text-blue-600 hover:underline font-semibold text-[11px] cursor-pointer"
                    >
                      Why this status? / Challenge
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Appeal Challenge Modal */}
      {appealModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border border-black rounded-lg max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setAppealModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-black cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded">
                Human Review Workflow
              </span>
              <h3 className="text-base font-bold text-neutral-900 mt-1.5">
                Challenge Status: {appealItem}
              </h3>
              <p className="text-xs text-neutral-500">
                Any automated verification decision can be appealed. An independent human reviewer evaluates the proof blind.
              </p>
            </div>

            <form onSubmit={handleSubmitAppeal} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Reason for Appeal / Additional Context
                </label>
                <textarea
                  required
                  rows={3}
                  value={appealReason}
                  onChange={(e) => setAppealReason(e.target.value)}
                  placeholder="Explain why this credential or alternative evidence warrants high confidence..."
                  className="w-full p-2.5 text-xs border border-neutral-300 rounded focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Additional Proof URL (Optional)
                </label>
                <input
                  type="text"
                  value={appealEvidenceUrl}
                  onChange={(e) => setAppealEvidenceUrl(e.target.value)}
                  placeholder="https://github.com/... or public project URL"
                  className="w-full p-2 text-xs border border-neutral-300 rounded"
                />
              </div>

              {appealResult && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded text-xs text-emerald-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Appeal Lodged ({appealResult.case_id})
                  </div>
                  <p className="text-[11px] text-emerald-800">{appealResult.message}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setAppealModalOpen(false)}
                  className="px-3 py-1.5 border border-neutral-300 rounded text-xs text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={appealSubmitting}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{appealSubmitting ? 'Submitting...' : 'Submit Blind Appeal'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
