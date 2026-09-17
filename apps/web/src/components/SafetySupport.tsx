export default function SafetySupport() {
  return (
    <section
      aria-labelledby="safety-support-heading"
      className="space-y-6"
    >
      {/* ── Urgent support ──────────────────────────────────────── */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 space-y-4">
        <div className="space-y-1">
          <h2
            id="safety-support-heading"
            className="text-base font-bold text-amber-900"
          >
            Need urgent support?
          </h2>
          <p className="text-sm text-amber-800 leading-relaxed">
            MindCare AI is not a replacement for a mental-health professional or emergency service.
            If you or someone else may be in immediate danger, contact your local emergency service
            or go to the nearest emergency department.
          </p>
        </div>

        <div className="space-y-3">
          {/* Emergency */}
          <div className="flex items-start gap-3 rounded-lg bg-white border border-amber-200 p-4">
            <span className="text-lg select-none mt-0.5" aria-hidden="true">🚨</span>
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-slate-900">Emergency support</p>
              <p className="text-sm text-slate-700 leading-relaxed">
                If you are in immediate danger, contact your local emergency service or go to the
                nearest emergency department.
              </p>
            </div>
          </div>

          {/* Trusted support */}
          <div className="flex items-start gap-3 rounded-lg bg-white border border-amber-200 p-4">
            <span className="text-lg select-none mt-0.5" aria-hidden="true">💬</span>
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-slate-900">Trusted support</p>
              <p className="text-sm text-slate-700 leading-relaxed">
                Consider contacting a trusted friend, family member, teacher, counsellor,
                healthcare professional, or another person who can stay with you.
              </p>
            </div>
          </div>

          {/* Professional help */}
          <div className="flex items-start gap-3 rounded-lg bg-white border border-amber-200 p-4">
            <span className="text-lg select-none mt-0.5" aria-hidden="true">🏥</span>
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-slate-900">Professional help</p>
              <p className="text-sm text-slate-700 leading-relaxed">
                Reach out to a qualified mental-health professional — your GP, a therapist, or a
                counsellor. They can provide personalised guidance and support.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── When to seek professional support ────────────────────── */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-3">
        <h2
          id="professional-support-heading"
          className="text-base font-bold text-slate-900"
        >
          When to seek professional support
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          It can be helpful to speak with a qualified mental-health professional if difficult
          emotions, stress, anxiety, low mood, or other problems:
        </p>
        <ul className="space-y-2">
          {[
            'Persist for a long time',
            'Interfere with school, work, relationships, sleep, or daily activities',
            'Feel difficult to manage on your own',
            'Cause you significant distress',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
              <span
                className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0"
                aria-hidden="true"
              />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-slate-600 leading-relaxed pt-1">
          Seeking help is a sign of strength. A professional can offer support tailored to your
          specific situation. Your GP or family doctor is often a good starting point.
        </p>
      </div>
    </section>
  );
}
