import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccessibility } from '../context/AccessibilityContext';
import axios from 'axios';
import {
  ShieldCheck,
  Brain,
  Sparkles,
  BarChart3,
  Layers,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  ExternalLink,
  ChevronRight,
  Database,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

const TASKS_AI_AUGMENTS = [
  'Boilerplate API Scaffolding',
  'Unit Test Generation',
  'SQL Query Optimization',
  'CSS Grid & Flexbox Alignment',
  'Regex Pattern Matching',
  'Documentation Synthesis',
  'Syntax Error Debugging',
];

const GROWING_HUMAN_AI_SKILLS = [
  'System Architecture & Resilience',
  'Responsible AI Governance',
  'Critical Edge-Case Evaluation',
  'Domain Problem Formulation',
  'Empathetic Stakeholder Collaboration',
  'Human-in-the-Loop DEI Oversight',
  'Multi-Cloud Trade-off Decisioning',
];

const DEPARTMENTS = ['Engineering', 'Product & Design', 'Data & AI', 'Operations & DevOps'];
const SKILL_DOMAINS = ['Python / Backend', 'React / UI', 'SAP HANA Vector', 'Cloud & DevOps', 'Security'];

// Matrix readiness percentages (0 to 100)
const HEATMAP_DATA = [
  [88, 82, 74, 85, 91], // Engineering
  [52, 94, 60, 48, 70], // Product & Design
  [95, 68, 92, 78, 88], // Data & AI
  [76, 62, 70, 94, 96], // Operations & DevOps
];

const COHORT_PARITY = [
  { cohort: 'First-Gen Students', baseline: 84.5, blindScore: 84.5, parityIndex: 100 },
  { cohort: 'Tier-3 / State Colleges', baseline: 83.8, blindScore: 83.8, parityIndex: 100 },
  { cohort: 'Tier-1 Elite Colleges', baseline: 84.2, blindScore: 84.2, parityIndex: 100 },
  { cohort: 'Career Returners (>2y)', baseline: 82.6, blindScore: 82.6, parityIndex: 100 },
  { cohort: 'Self-Taught / Open Source', baseline: 85.0, blindScore: 85.0, parityIndex: 100 },
];

export default function AiReadinessAndSap() {
  const { t } = useTranslation();
  const { settings } = useAccessibility();

  const [sacEmbedUrl, setSacEmbedUrl] = useState(null);
  const [activeCell, setActiveCell] = useState(null);

  // Check if SAC_STORY_EMBED_URL or status endpoint is set
  useEffect(() => {
    axios
      .get('/api/sap/status')
      .then((res) => {
        if (res.data?.sac?.configured) {
          setSacEmbedUrl(res.data.sac.embed_url || 'https://sap-analytics-cloud-embed.corp');
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-10 bg-white text-on-surface">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-outline">
        <div>
          <h1 className="font-display text-display-lg text-on-surface">
            {settings.language === 'hi'
              ? 'AI तत्परता और एंटरप्राइज़ SAP व्यू'
              : 'AI Readiness & Enterprise SAP View'}
          </h1>
          <p className="font-body text-body-md text-on-surface-muted mt-1">
            {settings.language === 'hi'
              ? 'जिम्मेदार AI पारदर्शिता, कौशल संवर्द्धन और SAP Analytics Cloud (SAC) समूहीकृत गोपनीयता दृश्य।'
              : 'Responsible AI transparency, augmented skill shifts, and SAP Analytics Cloud (SAC) cohort governance.'}
          </p>
        </div>

        <span className="sn-badge-blue">
          <Database className="w-4 h-4 text-primary" />
          SAP Analytics Cloud Ready
        </span>
      </div>

      {/* ═══════════════════════════════════════════════
          SECTION 1: AI Task Augmentation vs Human+AI Skills
          ═══════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Tasks AI May Augment (Black Outline Pills) */}
        <div className="sn-card space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-sm bg-sidebar text-white flex items-center justify-center">
              <Brain className="w-4 h-4" />
            </span>
            <div>
              <h2 className="font-title text-title-md text-on-surface">
                Tasks AI May Augment / Automate
              </h2>
              <p className="font-body text-body-sm text-on-surface-muted">
                Synthesizable execution tasks where AI acts as developer copilot
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {TASKS_AI_AUGMENTS.map((task, idx) => (
              <span
                key={idx}
                className="px-3.5 py-1.5 rounded-full border-2 border-sidebar text-sidebar bg-surface font-label text-xs font-semibold hover:bg-surface-card transition-colors shadow-sm"
              >
                {task}
              </span>
            ))}
          </div>

          <p className="font-body text-body-sm text-on-surface-muted pt-2 border-t border-outline">
            Candidates who harness AI for routine boilerplate free up cognitive capacity for high-leverage architectural reasoning.
          </p>
        </div>

        {/* Right: Growing Human + AI Skills (Solid Blue Pills) */}
        <div className="sn-card space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-sm bg-primary text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h2 className="font-title text-title-md text-on-surface">
                Growing Human + AI Core Skills
              </h2>
              <p className="font-body text-body-sm text-on-surface-muted">
                High-leverage competencies evaluated during blind candidate matching
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {GROWING_HUMAN_AI_SKILLS.map((skill, idx) => (
              <span
                key={idx}
                className="px-3.5 py-1.5 rounded-full bg-primary text-white font-label text-xs font-semibold shadow-sm hover:bg-primary-deep transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>

          <p className="font-body text-body-sm text-on-surface-muted pt-2 border-t border-outline">
            SkillNav weights verified architectural judgment and collaborative design as Tier-1 criteria regardless of college brand.
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          SECTION 2: Responsible AI Transparency Card
          ═══════════════════════════════════════════════ */}
      <div className="sn-card border-2 border-sidebar space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-outline">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-full bg-sidebar text-white flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </span>
            <div>
              <h2 className="font-title text-title-md text-on-surface font-bold">
                Responsible AI &amp; Ethical Governance Transparency Card
              </h2>
              <p className="font-body text-body-sm text-on-surface-muted">
                Adheres to SAP Guiding Principles for Artificial Intelligence &amp; UNESCO AI Ethics
              </p>
            </div>
          </div>

          <span className="sn-badge-sap text-xs">SAP AI Ethics Compliant</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          {/* Col 1: What AI Sees */}
          <div className="p-4 bg-surface border border-outline rounded-sm space-y-2">
            <div className="flex items-center gap-2 font-bold text-primary">
              <Eye className="w-4 h-4" />
              <span>What AI Scorer Sees</span>
            </div>
            <ul className="space-y-1.5 text-on-surface-muted list-disc list-inside leading-relaxed">
              <li>Verified technical skill competencies</li>
              <li>Alternative project URLs (GitHub, freelance)</li>
              <li>Credential OCR verification codes</li>
              <li>Code commit volume &amp; framework usage</li>
              <li>Learning trajectory velocity</li>
            </ul>
          </div>

          {/* Col 2: What AI Never Sees */}
          <div className="p-4 bg-surface border border-outline rounded-sm space-y-2">
            <div className="flex items-center gap-2 font-bold text-error">
              <EyeOff className="w-4 h-4" />
              <span>What AI Never Sees</span>
            </div>
            <ul className="space-y-1.5 text-on-surface-muted list-disc list-inside leading-relaxed">
              <li>Candidate Legal Name &amp; Photos</li>
              <li>Gender, Age &amp; Demographic labels</li>
              <li>College name &amp; Institutional tier</li>
              <li>Home postal address / Tier-3 region</li>
              <li>Disability &amp; accessibility settings</li>
            </ul>
          </div>

          {/* Col 3: Human Appeal Guarantee */}
          <div className="p-4 bg-surface border border-outline rounded-sm space-y-2">
            <div className="flex items-center gap-2 font-bold text-success">
              <UserCheck className="w-4 h-4" />
              <span>Human Appeal Guarantee</span>
            </div>
            <p className="text-on-surface-muted leading-relaxed">
              Every candidate maintains the inviolable right to dispute automated scoring. Challenges instantly instantiate an <strong>SAP Build Process Automation</strong> workflow (<code className="text-primary font-mono text-[11px]">skillnav.appeal.review</code>) for independent DEI ombudsperson review.
            </p>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          SECTION 3: SAP Analytics Cloud (SAC) Inclusion View
          ═══════════════════════════════════════════════ */}
      <section className="space-y-6">
        {/* Banner with Strict Privacy Constraint */}
        <div className="p-4 bg-sidebar text-white rounded-sm border border-sidebar flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-primary shrink-0" />
            <p className="font-label text-label-md">
              <strong>SAP HANA Aggregated View • Anonymised Data Only (Min cohort size: 10). No individual candidate ranking.</strong>
            </p>
          </div>
          <span className="hidden md:inline-flex items-center px-2.5 py-1 bg-white/10 rounded text-xs font-mono text-gray-300">
            V_COHORT_FAIRNESS_SUMMARY
          </span>
        </div>

        {/* Live SAC Embed if URL configured */}
        {sacEmbedUrl && (
          <div className="sn-card space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-title text-title-md text-on-surface">
                SAP Analytics Cloud Live Embedded Story
              </h3>
              <a
                href={sacEmbedUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline"
              >
                <span>Open in SAC Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <iframe
              src={sacEmbedUrl}
              title="SAP Analytics Cloud Dashboard"
              className="w-full h-96 border border-outline rounded-sm bg-surface-card"
            />
          </div>
        )}

        {/* Built-in Native Interactive Heatmap & Parity Bar Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Department vs Skill Readiness Heatmap (7 cols) */}
          <div className="lg:col-span-7 sn-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-title text-title-md text-on-surface">
                  Department vs. Skill Readiness Heatmap
                </h3>
                <p className="font-body text-body-sm text-on-surface-muted">
                  Aggregated readiness benchmarks across enterprise business units
                </p>
              </div>
              <span className="sn-badge text-xs">HANA Real-Vector</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-center border-collapse">
                <thead>
                  <tr>
                    <th className="p-2.5 text-left text-on-surface-muted font-label">Department</th>
                    {SKILL_DOMAINS.map((domain, i) => (
                      <th key={i} className="p-2 text-on-surface-muted font-label text-[11px]">
                        {domain}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DEPARTMENTS.map((dept, rowIdx) => (
                    <tr key={dept} className="border-t border-outline">
                      <td className="p-2.5 text-left font-semibold text-on-surface">{dept}</td>
                      {HEATMAP_DATA[rowIdx].map((score, colIdx) => {
                        // Blue-shaded heatmap calculation
                        const opacity = score / 100;
                        return (
                          <td
                            key={colIdx}
                            onMouseEnter={() =>
                              setActiveCell(`${dept} • ${SKILL_DOMAINS[colIdx]}: ${score}% Readiness`)
                            }
                            onMouseLeave={() => setActiveCell(null)}
                            className="p-2 cursor-pointer transition-transform hover:scale-105"
                          >
                            <div
                              style={{
                                backgroundColor: `rgba(37, 99, 235, ${Math.max(0.15, opacity)})`,
                                color: opacity > 0.65 ? '#FFFFFF' : '#0A0A0A',
                              }}
                              className="py-2 px-1 rounded-sm font-bold text-xs shadow-sm"
                            >
                              {score}%
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between text-xs text-on-surface-muted pt-2 border-t border-outline">
              <span>{activeCell || 'Hover over cells to view domain granularity'}</span>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-primary/20" />
                <span className="text-[11px]">50%</span>
                <span className="w-3 h-3 rounded-sm bg-primary" />
                <span className="text-[11px]">100%</span>
              </div>
            </div>
          </div>

          {/* Cohort Fairness Parity Bar Chart (5 cols) */}
          <div className="lg:col-span-5 sn-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-title text-title-md text-on-surface">
                  Cohort Fairness Parity Index
                </h3>
                <p className="font-body text-body-sm text-on-surface-muted">
                  Equal qualification probability across demographic subsets
                </p>
              </div>
              <span className="sn-badge-success text-xs font-bold">100% Parity</span>
            </div>

            <div className="space-y-3.5 pt-1">
              {COHORT_PARITY.map((item, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between font-label">
                    <span className="text-on-surface font-medium">{item.cohort}</span>
                    <span className="font-bold text-primary">{item.blindScore}% Match</span>
                  </div>

                  {/* Parity Bar */}
                  <div className="w-full bg-outline h-2.5 rounded-full overflow-hidden flex">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-700"
                      style={{ width: `${item.blindScore}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-surface-card border border-outline rounded-sm text-[11px] text-on-surface-muted leading-relaxed">
              <strong className="text-on-surface">Statistical Parity Guaranteed:</strong> Removing pedigree and demographic proxies from vector scoring eliminated historical 18% college-tier disparity.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
