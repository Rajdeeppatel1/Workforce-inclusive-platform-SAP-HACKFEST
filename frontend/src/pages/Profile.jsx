import React, { useState } from 'react';
import { useProfile } from '../context/ProfileContext';
import {
  User,
  GraduationCap,
  Briefcase,
  Target,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function Profile() {
  const { profile, setProfile, saveProfileToServer, loading } = useProfile();

  const [skillsInput, setSkillsInput] = useState('');
  const [saveStatus, setSaveStatus] = useState(null);

  // Form state
  const [newExp, setNewExp] = useState({
    role: '',
    company_or_freelance: '',
    years: '',
    description: '',
  });

  const [newEdu, setNewEdu] = useState({
    degree: '',
    field_of_study: '',
    institution: '',
    graduation_year: '',
  });

  // Handle adding a skill
  const handleAddSkill = (e) => {
    e.preventDefault();
    const trimmed = skillsInput.trim();
    if (!trimmed) return;
    if (!profile.skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setProfile((prev) => ({
        ...prev,
        skills: [...prev.skills, trimmed],
      }));
      setSkillsInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  // Handle adding experience
  const handleAddExperience = (e) => {
    e.preventDefault();
    if (!newExp.role.trim()) return;
    const entry = {
      role: newExp.role.trim(),
      company_or_freelance: newExp.company_or_freelance.trim() || 'Independent / Project',
      years: parseFloat(newExp.years) || 1.0,
      description: newExp.description.trim(),
    };
    setProfile((prev) => ({
      ...prev,
      experience: [...(prev.experience || []), entry],
    }));
    setNewExp({ role: '', company_or_freelance: '', years: '', description: '' });
  };

  const handleRemoveExperience = (idx) => {
    setProfile((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== idx),
    }));
  };

  // Handle adding education
  const handleAddEducation = (e) => {
    e.preventDefault();
    if (!newEdu.degree.trim()) return;
    const entry = {
      degree: newEdu.degree.trim(),
      field_of_study: newEdu.field_of_study.trim(),
      institution: newEdu.institution.trim(),
      graduation_year: parseInt(newEdu.graduation_year) || new Date().getFullYear(),
    };
    setProfile((prev) => ({
      ...prev,
      education: [...(prev.education || []), entry],
    }));
    setNewEdu({ degree: '', field_of_study: '', institution: '', graduation_year: '' });
  };

  const handleRemoveEducation = (idx) => {
    setProfile((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== idx),
    }));
  };

  // Handle goals change
  const handleGoalChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      goals: {
        ...(prev.goals || {}),
        [field]: value,
      },
    }));
  };

  // Save to backend JSON file
  const handleSave = async () => {
    setSaveStatus('saving');
    const res = await saveProfileToServer();
    if (res.success) {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(null), 4000);
    } else {
      setSaveStatus('error');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Top Banner with Synthetic Demo Data Label */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Candidate Profile</h1>
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded">
              Synthetic Demo Data
            </span>
          </div>
          <p className="text-xs text-neutral-500">
            Profile ID: <code className="bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-800">{profile.profile_id}</code> • Stored in <code className="bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-800">backend/data/profiles/</code>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveStatus === 'saved' && (
            <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Saved to backend/data/profiles/{profile.profile_id}.json
            </span>
          )}
          {saveStatus === 'error' && (
            <span className="text-xs text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded flex items-center gap-1.5 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              Save failed
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={loading || saveStatus === 'saving'}
            className="px-5 py-2.5 bg-black hover:bg-neutral-800 text-white rounded font-medium text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Save className="w-4 h-4 text-blue-400" />
            {saveStatus === 'saving' ? 'Saving...' : 'Save Profile to JSON'}
          </button>
        </div>
      </div>

      {/* Consent Mandate Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded p-4 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold text-blue-900 uppercase tracking-wider">
              Privacy & Responsible AI Guarantee
            </div>
            <div className="text-sm font-semibold text-blue-950 mt-0.5">
              "Ye data sirf skill matching ke liye use hoga."
            </div>
            <p className="text-xs text-blue-800 mt-1">
              Protected attributes (naam, gender, college tier, career gap, city tier) scoring mein kabhi nahi jaate.
            </p>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-medium inline-flex items-center gap-1 ${
              profile.consent_given
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-amber-100 text-amber-800 border border-amber-300'
            }`}
          >
            {profile.consent_given ? '✓ Consent Active' : '⚠ Consent Pending'}
          </span>
        </div>
      </div>

      {/* Grid: Skills & Goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Skills Section */}
        <div className="border border-neutral-200 rounded-lg p-5 bg-white shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              Pichle aur Current Skills ({profile.skills.length})
            </h2>
            <span className="text-[10px] text-neutral-400">Purely Skills-First</span>
          </div>

          <form onSubmit={handleAddSkill} className="flex gap-2">
            <input
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="e.g. Python, Docker, React, FastAPI..."
              className="flex-1 px-3 py-2 text-xs border border-neutral-300 rounded focus:outline-none focus:border-blue-600"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-neutral-900 text-white rounded text-xs font-medium hover:bg-black flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </form>

          <div className="flex flex-wrap gap-2 pt-1 max-h-48 overflow-y-auto">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-50 text-blue-800 border border-blue-200 text-xs font-medium"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-rose-600 cursor-pointer"
                  title="Remove skill"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* 2. Goals Section */}
        <div className="border border-neutral-200 rounded-lg p-5 bg-white shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600" />
              Career Goals
            </h2>
            <span className="text-[10px] text-neutral-400">Opportunity Fit</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Target Role
              </label>
              <input
                type="text"
                value={profile.goals?.target_role || ''}
                onChange={(e) => handleGoalChange('target_role', e.target.value)}
                placeholder="e.g. Full Stack Developer, DevOps Engineer"
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-neutral-700 mb-1">
                <span>Weekly Study Hours Commitment</span>
                <span className="text-blue-600">{profile.goals?.weekly_study_hours || 10} hrs/week</span>
              </div>
              <input
                type="range"
                min="2"
                max="30"
                step="1"
                value={profile.goals?.weekly_study_hours || 10}
                onChange={(e) => handleGoalChange('weekly_study_hours', parseInt(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Priority Learning Focus
              </label>
              <div className="flex flex-wrap gap-1.5 text-xs">
                {(profile.goals?.preferred_topics || ['Docker', 'AWS Basics', 'System Design']).map(
                  (topic, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-neutral-100 border border-neutral-300 rounded text-neutral-700 text-[11px]"
                    >
                      {topic}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Experience Section */}
      <div className="border border-neutral-200 rounded-lg p-5 bg-white shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-600" />
              Pichhla Experience & Projects
            </h2>
            <p className="text-[11px] text-neutral-500">
              Freelance, open-source contributions, and prior roles are weighted equally.
            </p>
          </div>
        </div>

        {/* Existing Experience List */}
        <div className="space-y-3">
          {(profile.experience || []).map((exp, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-neutral-50 border border-neutral-200 rounded flex items-start justify-between gap-4"
            >
              <div>
                <div className="text-xs font-bold text-neutral-900">{exp.role}</div>
                <div className="text-[11px] text-neutral-600">
                  {exp.company_or_freelance} • {exp.years} years
                </div>
                {exp.description && (
                  <p className="text-xs text-neutral-700 mt-1.5 leading-relaxed">
                    {exp.description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleRemoveExperience(idx)}
                className="text-neutral-400 hover:text-rose-600 p-1 cursor-pointer"
                title="Delete entry"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Experience Form */}
        <form
          onSubmit={handleAddExperience}
          className="border border-dashed border-neutral-300 rounded p-4 bg-neutral-50/50 space-y-3"
        >
          <div className="text-xs font-bold text-neutral-700">Add New Experience / Project</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Role Title (e.g. Junior Developer)"
              value={newExp.role}
              onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
              className="px-3 py-2 text-xs border border-neutral-300 rounded bg-white"
            />
            <input
              type="text"
              placeholder="Organization / Freelance"
              value={newExp.company_or_freelance}
              onChange={(e) => setNewExp({ ...newExp, company_or_freelance: e.target.value })}
              className="px-3 py-2 text-xs border border-neutral-300 rounded bg-white"
            />
            <input
              type="number"
              step="0.5"
              placeholder="Years (e.g. 1.5)"
              value={newExp.years}
              onChange={(e) => setNewExp({ ...newExp, years: e.target.value })}
              className="px-3 py-2 text-xs border border-neutral-300 rounded bg-white"
            />
          </div>
          <textarea
            placeholder="Project impact, key contributions, or technologies used..."
            value={newExp.description}
            onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 text-xs border border-neutral-300 rounded bg-white"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-neutral-900 text-white rounded text-xs font-medium hover:bg-black flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Experience Entry
          </button>
        </form>
      </div>

      {/* 4. Education Section */}
      <div className="border border-neutral-200 rounded-lg p-5 bg-white shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              Education & Degrees
            </h2>
            <p className="text-[11px] text-neutral-500">
              Note: Institution names and tiers are <strong>strictly stripped</strong> before AI match scoring.
            </p>
          </div>
        </div>

        {/* Existing Education List */}
        <div className="space-y-3">
          {(profile.education || []).map((edu, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-neutral-50 border border-neutral-200 rounded flex items-start justify-between gap-4"
            >
              <div>
                <div className="text-xs font-bold text-neutral-900">{edu.degree} in {edu.field_of_study}</div>
                <div className="text-[11px] text-neutral-600">
                  {edu.institution || 'Accredited Institution'} • Graduated {edu.graduation_year || 'Recent'}
                </div>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded mt-1 inline-block">
                  Pedigree Stripped for Scoring
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveEducation(idx)}
                className="text-neutral-400 hover:text-rose-600 p-1 cursor-pointer"
                title="Delete entry"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Education Form */}
        <form
          onSubmit={handleAddEducation}
          className="border border-dashed border-neutral-300 rounded p-4 bg-neutral-50/50 space-y-3"
        >
          <div className="text-xs font-bold text-neutral-700">Add Education Entry</div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Degree (e.g. B.Tech, BCA)"
              value={newEdu.degree}
              onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
              className="px-3 py-2 text-xs border border-neutral-300 rounded bg-white"
            />
            <input
              type="text"
              placeholder="Field of Study"
              value={newEdu.field_of_study}
              onChange={(e) => setNewEdu({ ...newEdu, field_of_study: e.target.value })}
              className="px-3 py-2 text-xs border border-neutral-300 rounded bg-white"
            />
            <input
              type="text"
              placeholder="Institution (Stripped from scoring)"
              value={newEdu.institution}
              onChange={(e) => setNewEdu({ ...newEdu, institution: e.target.value })}
              className="px-3 py-2 text-xs border border-neutral-300 rounded bg-white"
            />
            <input
              type="number"
              placeholder="Graduation Year"
              value={newEdu.graduation_year}
              onChange={(e) => setNewEdu({ ...newEdu, graduation_year: e.target.value })}
              className="px-3 py-2 text-xs border border-neutral-300 rounded bg-white"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-neutral-900 text-white rounded text-xs font-medium hover:bg-black flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Education Entry
          </button>
        </form>
      </div>
    </div>
  );
}
