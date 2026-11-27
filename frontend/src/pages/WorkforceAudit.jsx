import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Scale,
  Upload,
  Download,
  Database,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Loader2,
} from 'lucide-react';

const STATUS_STYLES = {
  PASS: { box: 'bg-emerald-500/10 border-emerald-500/30', chip: 'bg-emerald-600 text-white', Icon: CheckCircle2, icon: 'text-emerald-600' },
  WARN: { box: 'bg-amber-500/10 border-amber-500/30', chip: 'bg-amber-600 text-white', Icon: AlertTriangle, icon: 'text-amber-600' },
  FAIL: { box: 'bg-rose-500/10 border-rose-500/30', chip: 'bg-rose-600 text-white', Icon: XCircle, icon: 'text-rose-600' },
  INSUFFICIENT_DATA: { box: 'bg-neutral-50 border-neutral-200', chip: 'bg-neutral-500 text-white', Icon: HelpCircle, icon: 'text-neutral-500' },
};

const OVERALL_TEXT = {
  PASS: 'No significant disparity found between employees with the same skill level.',
  WARN: 'Some gaps are emerging. Review the flagged metrics before the next appraisal cycle.',
  FAIL: 'Employees with the same skills are getting different outcomes. Action recommended.',
  INSUFFICIENT_DATA: 'Not enough employees per group to audit safely. Groups under 5 people are never scored.',
};

const METRICS = {
  promotion_parity: { label: 'Promotion parity', format: (v) => `${v.toFixed(2)}×` },
  adjusted_pay_gap: { label: 'Skill-adjusted pay gap', format: (v) => `${v.toFixed(1)}%` },
  rating_gap: { label: 'Performance rating gap', format: (v) => `${v.toFixed(2)} pts` },
};

const REQUIRED_COLUMNS = ['employee_id', 'role', 'skill_score (0-100)', 'performance_rating (1-5)', 'promoted_last_cycle (yes/no)', 'annual_salary'];
const PROTECTED_COLUMNS = ['gender', 'age_band', 'career_gap', 'disability', 'college_tier', 'location_tier'];

const pct = (ratio) => `${ratio >= 1 ? '+' : ''}${((ratio - 1) * 100).toFixed(1)}%`;
const label = (s) => s.replace(/_/g, ' ');

function StatusChip({ status }) {
  return (
    <span className={`text-[11px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded whitespace-nowrap ${STATUS_STYLES[status].chip}`}>
      {label(status)}
    </span>
  );
}

function AttributeCard({ attr }) {
  const { box, Icon, icon } = STATUS_STYLES[attr.status];
  return (
    <section className={`p-4 rounded border ${box} space-y-3`} aria-labelledby={`attr-${attr.attribute}`}>
      <div className="flex items-center justify-between gap-2">
        <h3 id={`attr-${attr.attribute}`} className="flex items-center gap-2 text-sm font-bold text-neutral-900 capitalize">
          <Icon className={`w-5 h-5 ${icon}`} aria-hidden="true" />
          {label(attr.attribute)}
        </h3>
        <StatusChip status={attr.status} />
      </div>

      {attr.checks.map((c) => (
        <div key={c.metric} className="bg-white/70 rounded p-3 border border-neutral-200">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-neutral-800">{METRICS[c.metric].label}</span>
            <span className="flex items-center gap-2">
              <span className="text-sm font-bold text-neutral-900">{METRICS[c.metric].format(c.value)}</span>
              <StatusChip status={c.status} />
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-1">{c.explanation}</p>
        </div>
      ))}

      {attr.groups.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <caption className="sr-only">Outcomes by {label(attr.attribute)} compared with skill-matched peers</caption>
            <thead className="text-neutral-500">
              <tr>
                <th scope="col" className="py-1 pr-3 font-semibold">Group</th>
                <th scope="col" className="py-1 pr-3 font-semibold">Employees</th>
                <th scope="col" className="py-1 pr-3 font-semibold">Promotions vs expected</th>
                <th scope="col" className="py-1 pr-3 font-semibold">Pay vs peers</th>
                <th scope="col" className="py-1 font-semibold">Rating vs peers</th>
              </tr>
            </thead>
            <tbody className="text-neutral-800">
              {attr.groups.map((g) => (
                <tr key={g.group} className="border-t border-neutral-200">
                  <th scope="row" className="py-1 pr-3 font-medium capitalize">{g.group}</th>
                  <td className="py-1 pr-3">{g.count}</td>
                  <td className="py-1 pr-3">{Math.round(g.promotion_ratio * 100)}%</td>
                  <td className="py-1 pr-3">{pct(g.pay_ratio)}</td>
                  <td className="py-1">{g.rating_residual >= 0 ? '+' : ''}{g.rating_residual.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {attr.skipped_groups.length > 0 && (
        <p className="text-[11px] text-neutral-500">
          Not scored to protect privacy (fewer than 5 people):{' '}
          {attr.skipped_groups.map((g) => `${g.group} (${g.count})`).join(', ')}
        </p>
      )}
    </section>
  );
}

function PayReviewTable({ rows }) {
  if (rows.length === 0) return null;
  return (
    <section className="p-4 rounded border border-neutral-200 bg-white space-y-2" aria-labelledby="pay-review">
      <h3 id="pay-review" className="text-sm font-bold text-neutral-900">
        Individual pay review ({rows.length})
      </h3>
      <p className="text-xs text-neutral-600">
        Paid more than 10% below the median of peers in the same role and skill band. Protected attributes are deliberately not shown.
      </p>
      <div className="overflow-x-auto max-h-72">
        <table className="w-full text-xs text-left">
          <thead className="text-neutral-500 sticky top-0 bg-white">
            <tr>
              <th scope="col" className="py-1 pr-3 font-semibold">Employee</th>
              <th scope="col" className="py-1 pr-3 font-semibold">Role</th>
              <th scope="col" className="py-1 pr-3 font-semibold">Skill band</th>
              <th scope="col" className="py-1 font-semibold">Pay vs peers</th>
            </tr>
          </thead>
          <tbody className="text-neutral-800">
            {rows.map((r) => (
              <tr key={r.employee_id} className="border-t border-neutral-100">
                <td className="py-1 pr-3 font-mono">{r.employee_id}</td>
                <td className="py-1 pr-3">{r.role}</td>
                <td className="py-1 pr-3">{r.skill_band}</td>
                <td className="py-1 font-semibold text-rose-600">{r.pay_vs_peers_pct}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function WorkforceAudit() {
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState('');

  const runAudit = async (file, name) => {
    setLoading(true);
    setErrors([]);
    setResult(null);
    setSource(name);
    try {
      const form = new FormData();
      form.append('file', file, name);
      const res = await axios.post('/api/workforce/audit', form);
      setResult(res.data);
    } catch (err) {
      const detail = err.response?.data?.detail;
      setErrors(detail?.errors || ['Could not reach the audit service. Check that the backend is running.']);
    } finally {
      setLoading(false);
    }
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file) runAudit(file, file.name);
    e.target.value = '';
  };

  const handleExample = async () => {
    try {
      const res = await fetch('/workforce_sample.csv');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await runAudit(await res.blob(), 'workforce_sample.csv');
    } catch (err) {
      setErrors([`Could not load the example dataset (${err.message}).`]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-black text-white rounded">
              <Scale className="w-5 h-5 text-blue-400" aria-hidden="true" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Workforce Equity Audit</h1>
          </div>
          <p className="text-xs text-neutral-500">
            Do employees with the same skills get the same promotions, pay and ratings? Upload your team data and find out.
          </p>
        </div>
        <Link to="/employed" className="text-xs text-neutral-600 hover:text-blue-600 font-medium border border-neutral-300 px-3 py-1.5 rounded self-start sm:self-auto min-h-[44px] inline-flex items-center">
          ← Employed Track
        </Link>
      </div>

      <div className="bg-neutral-50 border-l-4 border-blue-600 p-4 rounded-r text-xs text-neutral-700 space-y-1">
        <div className="font-bold text-neutral-900 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-blue-600" aria-hidden="true" />
          Privacy by design
        </div>
        <p>
          Your file is analysed in memory and never stored. Every employee is compared only with skill-matched peers, groups
          smaller than 5 people are never scored, and the individual review list never shows protected attributes.
        </p>
      </div>

      <section className="p-5 border border-neutral-200 rounded-lg bg-white shadow-sm space-y-4" aria-labelledby="upload-heading">
        <h2 id="upload-heading" className="text-sm font-bold text-neutral-900">1. Add employee data (CSV)</h2>
        <div className="flex flex-wrap gap-3">
          <label className="inline-flex items-center gap-2 px-4 min-h-[44px] rounded bg-black text-white text-xs font-semibold cursor-pointer hover:bg-neutral-800 focus-within:ring-2 focus-within:ring-blue-600">
            <Upload className="w-4 h-4" aria-hidden="true" />
            Upload CSV
            <input type="file" accept=".csv,text/csv" className="sr-only" onChange={handleFile} disabled={loading} />
          </label>
          <button
            type="button"
            onClick={handleExample}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 min-h-[44px] rounded border border-neutral-300 text-xs font-semibold text-neutral-800 hover:border-black disabled:opacity-50"
          >
            <Database className="w-4 h-4" aria-hidden="true" />
            Try example dataset (120 employees)
          </button>
          <a
            href="/workforce_template.csv"
            download
            className="inline-flex items-center gap-2 px-4 min-h-[44px] rounded border border-neutral-300 text-xs font-semibold text-neutral-800 hover:border-black"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            Download template
          </a>
        </div>
        <div className="text-[11px] text-neutral-500 space-y-0.5">
          <p><span className="font-semibold text-neutral-700">Required:</span> {REQUIRED_COLUMNS.join(', ')}</p>
          <p><span className="font-semibold text-neutral-700">Audited (at least one):</span> {PROTECTED_COLUMNS.join(', ')}</p>
        </div>
      </section>

      <div aria-live="polite" className="space-y-4">
        {loading && (
          <p className="flex items-center gap-2 text-xs text-neutral-600">
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> Auditing {source}…
          </p>
        )}

        {errors.length > 0 && (
          <div role="alert" className="p-4 rounded border bg-rose-500/10 border-rose-500/30 text-xs text-rose-800 space-y-1">
            <p className="font-bold">Please fix these issues in {source || 'the file'}:</p>
            <ul className="list-disc pl-5">
              {errors.map((e) => <li key={e}>{e}</li>)}
            </ul>
          </div>
        )}

        {result && (
          <>
            <h2 className="text-sm font-bold text-neutral-900">2. Results for {source}</h2>
            <div className={`p-4 rounded border ${STATUS_STYLES[result.overall_status].box} flex items-start gap-3`}>
              <StatusChip status={result.overall_status} />
              <p className="text-xs text-neutral-800">
                <span className="font-semibold">{result.employee_count} employees audited.</span>{' '}
                {OVERALL_TEXT[result.overall_status]}
              </p>
            </div>
            {result.attributes.map((a) => <AttributeCard key={a.attribute} attr={a} />)}
            <PayReviewTable rows={result.pay_review} />
            <p className="text-[11px] text-neutral-500">
              Method: each employee is compared with peers in the same skill band ({result.method.skill_bands.join(' / ')}); pay
              also within the same role. Promotion parity below 0.80 fails the four-fifths rule; pay gap ≥10% and rating gap ≥0.5
              points fail.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
