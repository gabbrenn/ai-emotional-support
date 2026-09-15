import { useState, useEffect } from 'react';
import { checkHealth } from '../services/api';

type BackendStatus = 'checking' | 'connected' | 'unreachable';

export default function StatusPage() {
  const [backendStatus, setBackendStatus] = useState<BackendStatus>('checking');
  const [lastChecked, setLastChecked] = useState<string | null>(null);

  useEffect(() => {
    const ping = async () => {
      try {
        const result = await checkHealth();
        setLastChecked(new Date(result.timestamp).toLocaleTimeString());
        setBackendStatus('connected');
      } catch {
        setBackendStatus('unreachable');
      }
    };
    ping();
  }, []);

  const statusConfig = {
    checking: {
      color: 'text-amber-700 bg-amber-50 border-amber-200',
      dot: 'bg-amber-500',
      label: 'Checking…',
    },
    connected: {
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      dot: 'bg-emerald-500',
      label: 'Connected',
    },
    unreachable: {
      color: 'text-red-700 bg-red-50 border-red-200',
      dot: 'bg-red-500',
      label: 'Unreachable',
    },
  } as const;

  const s = statusConfig[backendStatus];

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">MindCare AI</h1>
          <p className="text-slate-500 text-xs">System diagnostics and environment status</p>
        </div>

        {/* Status cards */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3 shadow-xs">
          {/* Frontend */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold text-slate-700">Frontend client</span>
            </div>
            <span className="text-xs font-semibold text-emerald-700">Online</span>
          </div>

          {/* Backend */}
          <div className={`flex items-center justify-between p-3 rounded-lg border ${s.color}`}>
            <div className="flex items-center gap-2.5">
              <span className={`h-2 w-2 rounded-full ${s.dot}`} />
              <div>
                <p className="text-xs font-semibold">Backend API</p>
                {lastChecked && backendStatus === 'connected' && (
                  <p className="text-[10px] opacity-75">Checked at {lastChecked}</p>
                )}
              </div>
            </div>
            <span className="text-xs font-semibold">{s.label}</span>
          </div>
        </div>

        {/* Endpoints */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-2.5 shadow-xs text-xs">
          <p className="font-semibold text-slate-700 uppercase tracking-wider text-[11px] mb-2">
            Local Configuration
          </p>
          <div className="flex items-center justify-between text-slate-600">
            <span>Frontend</span>
            <code className="text-slate-800 font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded">http://localhost:5173</code>
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <span>Backend API</span>
            <code className="text-slate-800 font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded">http://localhost:3000</code>
          </div>
        </div>

        <p className="text-center text-[11px] text-slate-400">
          MindCare AI · Wellbeing Assistant
        </p>
      </div>
    </main>
  );
}
