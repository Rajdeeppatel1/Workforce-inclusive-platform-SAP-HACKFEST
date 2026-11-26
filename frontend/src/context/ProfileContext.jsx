import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ProfileContext = createContext(null);

const STORAGE_KEY = 'skillnav_candidate_profile';

const INITIAL_PROFILE = {
  profile_id: 'seed_priya_sharma_01',
  name: 'Priya Sharma',
  email: 'priya.sharma@skillnav.io',
  gender: 'Female',
  age: 27,
  location: 'Bhopal, MP',
  is_synthetic: false,
  demo_label: 'Candidate Profile (Priya Sharma - Software Developer)',
  consent_given: false,
  pathway: 'First-Gen Student',
  skills: ['Python', 'FastAPI', 'React', 'SQL', 'Docker', 'REST APIs'],
  experience: [
    {
      role: 'Junior Python Developer',
      company_or_freelance: 'Self-Taught & Open Source Projects',
      years: 1.0,
      description: 'Built reactive web applications and backend microservices with FastAPI and React.',
    },
  ],
  education: [
    {
      degree: 'Bachelor of Technology',
      field_of_study: 'Computer Science',
      institution: 'State Rural Engineering College, Bhopal',
      graduation_year: 2024,
    },
  ],
  goals: {
    target_role: 'Cloud Application Developer',
    weekly_study_hours: 12,
    preferred_topics: ['Docker', 'AWS Basics', 'Microservices'],
  },
  alternative_evidence: [
    {
      category: 'github',
      title: 'Fullstack Microservices Demo',
      description: 'Production microservice with authentication and Docker orchestration',
      skills_demonstrated: ['Python', 'FastAPI', 'Docker'],
      verification_url: 'https://github.com/priyasharma/microservices-demo',
      confidence: 'High',
      weight_multiplier: 1.2,
      status: 'Verified',
    },
    {
      category: 'freelance',
      title: 'Local Community Portal',
      description: 'Shipped responsive React + Tailwind application for local initiatives',
      skills_demonstrated: ['React', 'Tailwind CSS', 'SQL'],
      verification_url: 'https://bhopal-community.dev',
      confidence: 'High',
      weight_multiplier: 1.1,
      status: 'Verified',
    },
  ],
  certificates: [
    {
      issuer: 'Coursera',
      title: 'Python for Everybody Specialization',
      date: '2024-05',
      skills: ['Python', 'SQL'],
      status: 'Verified',
      confidence: 'High',
    },
  ],
};

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(() => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return INITIAL_PROFILE;
      }
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return INITIAL_PROFILE;
      const parsed = JSON.parse(stored);
      if (!parsed || typeof parsed !== 'object') return INITIAL_PROFILE;
      return {
        ...INITIAL_PROFILE,
        ...parsed,
        skills: Array.isArray(parsed.skills) && parsed.skills.length > 0 ? parsed.skills : INITIAL_PROFILE.skills,
        experience: Array.isArray(parsed.experience) ? parsed.experience : INITIAL_PROFILE.experience,
        education: Array.isArray(parsed.education) ? parsed.education : INITIAL_PROFILE.education,
        goals: parsed.goals && typeof parsed.goals === 'object' ? parsed.goals : INITIAL_PROFILE.goals,
        alternative_evidence: Array.isArray(parsed.alternative_evidence)
          ? parsed.alternative_evidence
          : INITIAL_PROFILE.alternative_evidence,
        certificates: Array.isArray(parsed.certificates)
          ? parsed.certificates
          : INITIAL_PROFILE.certificates,
      };
    } catch {
      return INITIAL_PROFILE;
    }
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.warn('Could not persist profile to localStorage', e);
    }
  }, [profile]);

  // Mock Login - Loads Seeded Profile from Backend
  const loginMock = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/login/mock');
      if (res.data) {
        const merged = {
          ...INITIAL_PROFILE,
          ...res.data,
          certificates: profile.certificates,
        };
        setProfile(merged);
        return merged;
      }
    } catch (err) {
      console.error('Error logging in mock profile:', err);
      // Fallback to local INITIAL_PROFILE
      setProfile(INITIAL_PROFILE);
    } finally {
      setLoading(false);
    }
  };

  // Record Consent
  const giveConsent = async (val = true) => {
    try {
      await axios.post('/api/consent', {
        profile_id: profile.profile_id,
        consent: val,
      });
    } catch (e) {
      console.warn('Backend consent sync failed, updated locally', e);
    }
    setProfile((prev) => ({
      ...prev,
      consent_given: val,
      consent_timestamp: val ? new Date().toISOString() : null,
    }));
  };

  // Save profile to backend JSON
  const saveProfileToServer = async (customProfile = null) => {
    setLoading(true);
    const target = customProfile || profile;
    try {
      const res = await axios.post('/api/profile', target);
      if (res.data && res.data.profile) {
        setProfile((prev) => ({
          ...prev,
          ...res.data.profile,
        }));
      }
      return { success: true };
    } catch (err) {
      console.error('Error saving profile to server:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const addSkill = (skill) => {
    const trimmed = skill.trim();
    if (!trimmed) return;
    if (!profile.skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setProfile((prev) => ({
        ...prev,
        skills: [...prev.skills, trimmed],
      }));
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const setSkills = (newSkills) => {
    setProfile((prev) => ({
      ...prev,
      skills: newSkills,
    }));
  };

  const setPathway = (pathway) => {
    setProfile((prev) => ({
      ...prev,
      pathway,
    }));
  };

  const setGoals = (newGoals) => {
    setProfile((prev) => ({
      ...prev,
      goals: { ...prev.goals, ...newGoals },
    }));
  };

  const addAlternativeEvidence = (evidence) => {
    setProfile((prev) => ({
      ...prev,
      alternative_evidence: [evidence, ...prev.alternative_evidence],
      skills: Array.from(new Set([...prev.skills, ...(evidence.skills_demonstrated || [])])),
    }));
  };

  const addCertificate = (cert) => {
    setProfile((prev) => ({
      ...prev,
      certificates: [cert, ...prev.certificates],
      skills: Array.from(new Set([...prev.skills, ...(cert.skills || [])])),
    }));
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        setProfile,
        loading,
        loginMock,
        giveConsent,
        saveProfileToServer,
        addSkill,
        removeSkill,
        setSkills,
        setPathway,
        setGoals,
        addAlternativeEvidence,
        addCertificate,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
}
