interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: string;
}

export default function PlaceholderPage({ title, description, icon }: PlaceholderPageProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <span>{icon}</span>
          <span>{title}</span>
        </h1>
        <p className="text-slate-600 text-sm">{description}</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3 shadow-xs">
        <div className="text-3xl text-slate-400">{icon}</div>
        <h2 className="text-base font-medium text-slate-800">{title} module</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          This area is ready for feature integration. Authentication and session persistence are active.
        </p>
      </div>
    </div>
  );
}
