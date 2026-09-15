import { AlertTriangle } from 'lucide-react';

export function ConflictAlert({ conflicts }: { conflicts: string[] }) {
  if (!conflicts || conflicts.length === 0) return null;

  return (
    <div className="glass-panel border-amber-400/30 p-6 rounded-2xl mb-6 bg-amber-400/5">
      <div className="flex items-start gap-3">
        <AlertTriangle className="text-amber-400 mt-1 shrink-0" size={20} />
        <div>
          <h3 className="font-semibold text-amber-400 mb-2">Constraint Adjustment</h3>
          <p className="text-sm text-gray-300 mb-4">
            Some requested constraints could not be satisfied exactly. The closest feasible paper has been generated.
          </p>
          <div className="space-y-2">
            {conflicts.map((c, i) => (
              <div key={i} className="text-xs text-amber-200/80 bg-amber-400/10 p-3 rounded-lg border border-amber-400/20">
                {c}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
