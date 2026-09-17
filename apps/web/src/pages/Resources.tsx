import { useState } from 'react';
import { RESOURCES, ALL_CATEGORIES, type ResourceCategory } from '../data/resources';
import ResourceCard from '../components/ResourceCard';
import SafetySupport from '../components/SafetySupport';

type FilterTab = 'All' | ResourceCategory;
const FILTER_TABS: FilterTab[] = ['All', ...ALL_CATEGORIES];

export default function Resources() {
  const [activeTab, setActiveTab] = useState<FilterTab>('All');

  const filtered =
    activeTab === 'All'
      ? RESOURCES
      : RESOURCES.filter((r) => r.category === activeTab);

  return (
    <div className="space-y-10">
      {/* ── Page header ───────────────────────────────────────── */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Wellbeing Resources
        </h1>
        <p className="text-slate-600 text-sm">
          Simple information and practical ideas to support your wellbeing.
        </p>
      </div>

      {/* ── Category filter ───────────────────────────────────── */}
      <div
        role="tablist"
        aria-label="Filter resources by category"
        className="flex flex-wrap gap-2"
      >
        {FILTER_TABS.map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            id={`tab-${tab.toLowerCase().replace(/\s+/g, '-')}`}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 ${
              activeTab === tab
                ? 'bg-teal-600 border-teal-600 text-white'
                : 'bg-white border-slate-200 text-slate-600 hover:border-teal-400 hover:text-teal-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Resource cards grid ───────────────────────────────── */}
      {filtered.length > 0 ? (
        <div
          role="tabpanel"
          aria-label={`Resources: ${activeTab}`}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {filtered.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500">No resources found for this category.</p>
      )}

      {/* ── Safety & professional support ─────────────────────── */}
      <SafetySupport />

      {/* ── Disclaimer ────────────────────────────────────────── */}
      <div className="p-4 rounded-lg bg-slate-100/70 border border-slate-200 text-slate-600 text-xs flex items-start gap-3">
        <span className="text-base select-none" aria-hidden="true">ℹ️</span>
        <p className="leading-relaxed">
          <span className="font-semibold text-slate-800">Disclaimer: </span>
          MindCare AI provides general wellbeing information and emotional support. It does not
          provide medical diagnoses, prescribe medication, or replace qualified professional care.
        </p>
      </div>
    </div>
  );
}
