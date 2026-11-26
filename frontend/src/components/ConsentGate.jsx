import React, { useState } from 'react';
import { useProfile } from '../context/ProfileContext';
import { ShieldCheck, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ConsentGate({ children }) {
  const { profile, giveConsent, loading } = useProfile();
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // If consent already given, render protected content
  if (profile.consent_given) {
    return <>{children}</>;
  }

  const handleConsent = async () => {
    if (!agreed) return;
    setSubmitting(true);
    await giveConsent(true);
    setSubmitting(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-white">
      <div className="max-w-xl w-full border border-black rounded-lg p-8 shadow-2xl bg-white text-black relative">
        <div className="absolute top-4 right-4">
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded">
            Synthetic Demo Data
          </span>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Candidate Data Consent</h2>
            <p className="text-xs text-neutral-500">Fair, Skills-First Evaluation Mandate</p>
          </div>
        </div>

        <div className="bg-neutral-50 border-l-4 border-blue-600 p-4 mb-6 rounded-r">
          <p className="text-base font-semibold text-neutral-900 mb-1">
            "Ye data sirf skill matching ke liye use hoga."
          </p>
          <p className="text-xs text-neutral-600">
            This data will strictly and exclusively be used for skill-based opportunity matching.
          </p>
        </div>

        <div className="space-y-3 mb-6 text-sm text-neutral-700">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <span>
              <strong>Zero Demographic Bias:</strong> Protected attributes (naam, gender, college tier, career gap, city tier) scoring mein kabhi nahi jaate.
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <span>
              <strong>Skills & Evidence Only:</strong> Scored purely on verified code repositories, freelance outputs, and demonstrable competencies.
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <span>
              <strong>Full Appeal Rights:</strong> You can challenge any automated match decision at any time.
            </span>
          </div>
        </div>

        <div className="border-t border-neutral-200 pt-5 mb-6">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-neutral-400 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-xs text-neutral-800 leading-relaxed">
              Main sahmati deta/deti hoon ki mera data sirf skill matching aur readiness insights ke liye sanitize karke evaluate kiya jaaye.
              <span className="block text-[11px] text-neutral-500 mt-0.5">
                (Consent required to unlock Main Candidate Dashboard)
              </span>
            </span>
          </label>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-xs text-neutral-500 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-neutral-400" /> Dashboard Gated
          </span>
          <button
            onClick={handleConsent}
            disabled={!agreed || submitting || loading}
            className={`min-h-[44px] px-6 py-2.5 rounded font-medium text-sm transition-all flex items-center gap-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
              agreed
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
            }`}
          >
            {submitting ? 'Recording Consent...' : 'Accept Consent & Open Dashboard'}
          </button>
        </div>
      </div>
    </div>
  );
}
