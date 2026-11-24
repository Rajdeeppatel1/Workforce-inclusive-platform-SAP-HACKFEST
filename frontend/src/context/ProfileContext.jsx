import React, { createContext, useContext, useState, useEffect } from 'react';

const ProfileContext = createContext(null);

const STORAGE_KEY = 'skillnav_candidate_profile';

const INITIAL_PROFILE = {
  profile_id: 'anon_' + Math.random().toString(36).substring(2, 10),
  name: 'Candidate (Blind)',
  pathway: 'First-Gen Student',
  skills: ['Python', 'React', 'REST APIs', 'SQL'],
  alternative_evidence: [
    {
      category: 'github',
      title: 'Fullstack Task Manager & REST API',
      description: 'Production microservice with authentication and Docker orchestration',
      skills_demonstrated: ['Python', 'FastAPI', 'Docker'],
      verification_url: 'https://github.com/developer/task-manager-api',
      confidence: 'High',
      weight_multiplier: 1.2,
      status: 'Verified',
    },
    {
      category: 'freelance',
      title: 'Local Retail Inventory Portal',
      description: 'Shipped responsive React + Tailwind application for 3 local storefronts',
      skills_demonstrated: ['React', 'Tailwind CSS', 'SQL'],
      verification_url: 'https://retail-portal-demo.dev',
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
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_PROFILE;
    } catch {
      return INITIAL_PROFILE;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.warn('Could not persist profile to localStorage', e);
    }
  }, [profile]);

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

  const addAlternativeEvidence = (evidence) => {
    setProfile((prev) => ({
      ...prev,
      alternative_evidence: [evidence, ...prev.alternative_evidence],
      // Also add newly demonstrated skills to profile
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
        addSkill,
        removeSkill,
        setSkills,
        setPathway,
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
