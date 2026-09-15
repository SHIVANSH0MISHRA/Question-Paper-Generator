import { CheckCircle2 } from 'lucide-react';
import { ConflictAlert } from './ConflictAlert';

export function BreakdownPanel({ config, breakdown, conflicts }: { config: any, breakdown: any, conflicts: string[] }) {
  if (!breakdown) return null;

  return (
    <div className="h-full space-y-6">
      <ConflictAlert conflicts={conflicts} />

      <div className="glass-panel p-6 rounded-2xl h-full sticky top-8">
        <h2 className="text-xl font-medium tracking-tight mb-6">Paper Breakdown</h2>
        
        <div className="space-y-6">
            <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Total Marks</h3>
                <div className="flex items-center justify-between text-2xl font-light">
                    <span>{breakdown.totalMarks} <span className="text-sm text-gray-400">/ {config.totalMarks}</span></span>
                    {breakdown.totalMarks === config.totalMarks && <CheckCircle2 className="text-green-400" size={20} />}
                </div>
            </div>

            <div className="w-full h-px bg-white/10"></div>

            <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Difficulty</h3>
                <div className="space-y-3">
                    {['Easy', 'Medium', 'Hard'].map(diff => {
                        const actual = breakdown.difficulty[diff] || 0;
                        const reqPct = config.difficulty[diff.toLowerCase()];
                        const reqMarks = Math.round((reqPct / 100) * config.totalMarks);
                        const isMatch = actual === reqMarks;
                        return (
                            <div key={diff} className="text-sm">
                                <div className="flex justify-between mb-1">
                                    <span>{diff}</span>
                                    <span className="flex items-center gap-2">
                                        <span className="text-gray-400">{reqPct}% ({reqMarks}) →</span> 
                                        <span className={isMatch ? 'text-white' : 'text-amber-400'}>{actual}</span>
                                        {isMatch && <CheckCircle2 className="text-green-400" size={14} />}
                                    </span>
                                </div>
                                <div className="w-full bg-white/5 rounded-full h-1">
                                    <div className="bg-blue-400 h-1 rounded-full transition-all" style={{width: `${reqPct}%`}}></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="w-full h-px bg-white/10"></div>

            <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Topics</h3>
                <div className="space-y-3">
                    {config.topics.map((t: any) => {
                        const actual = breakdown.topics[t.name] || 0;
                        const reqPct = t.percentage;
                        const reqMarks = Math.round((reqPct / 100) * config.totalMarks);
                        const isMatch = actual === reqMarks;
                        return (
                            <div key={t.name} className="text-sm">
                                <div className="flex justify-between mb-1">
                                    <span>{t.name}</span>
                                    <span className="flex items-center gap-2">
                                        <span className="text-gray-400">{reqPct}% ({reqMarks}) →</span> 
                                        <span className={isMatch ? 'text-white' : 'text-amber-400'}>{actual}</span>
                                        {isMatch && <CheckCircle2 className="text-green-400" size={14} />}
                                    </span>
                                </div>
                                <div className="w-full bg-white/5 rounded-full h-1">
                                    <div className="bg-blue-400 h-1 rounded-full transition-all" style={{width: `${reqPct}%`}}></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            
            <div className="w-full h-px bg-white/10"></div>

            <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Question Types</h3>
                <div className="space-y-3">
                    {Object.entries({mcq: 'MCQ', shortAnswer: 'Short Answer', longAnswer: 'Long Answer'}).map(([key, label]) => {
                        const actual = breakdown.questionTypes[label] || 0;
                        const reqPct = config.questionTypes[key];
                        const reqMarks = Math.round((reqPct / 100) * config.totalMarks);
                        const isMatch = actual === reqMarks;
                        return (
                            <div key={key} className="text-sm">
                                <div className="flex justify-between mb-1">
                                    <span>{label}</span>
                                    <span className="flex items-center gap-2">
                                        <span className="text-gray-400">{reqPct}% ({reqMarks}) →</span> 
                                        <span className={isMatch ? 'text-white' : 'text-amber-400'}>{actual}</span>
                                        {isMatch && <CheckCircle2 className="text-green-400" size={14} />}
                                    </span>
                                </div>
                                <div className="w-full bg-white/5 rounded-full h-1">
                                    <div className="bg-blue-400 h-1 rounded-full transition-all" style={{width: `${reqPct}%`}}></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}
