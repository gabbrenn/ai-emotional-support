import type { Resource } from '../data/resources';

const CATEGORY_ICONS: Record<string, string> = {
  Stress: '🌬️',
  Emotions: '💛',
  'Daily Habits': '🌿',
  Coping: '🤝',
};

interface ResourceCardProps {
  resource: Resource;
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  const catIcon = CATEGORY_ICONS[resource.category] ?? '📋';

  return (
    <article
      className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col gap-4"
      aria-labelledby={`resource-title-${resource.id}`}
    >
      {/* Category pill */}
      <div className="flex items-center gap-2">
        <span className="text-base select-none" aria-hidden="true">
          {catIcon}
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-100 px-2.5 py-0.5 rounded-full">
          {resource.category}
        </span>
      </div>

      {/* Title + description */}
      <div className="space-y-1.5">
        <h3
          id={`resource-title-${resource.id}`}
          className="text-base font-semibold text-slate-900 leading-snug"
        >
          {resource.title}
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed">{resource.description}</p>
      </div>

      {/* Tips */}
      <ul className="space-y-2">
        {resource.tips.map((tip, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
            <span
              className="mt-1 h-1.5 w-1.5 rounded-full bg-teal-500 shrink-0"
              aria-hidden="true"
            />
            <span className="leading-relaxed">{tip}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
