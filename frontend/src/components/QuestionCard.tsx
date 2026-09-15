import { RefreshCw, Edit3, Loader2 } from 'lucide-react';
import { useState } from 'react';

export function QuestionCard({ q, handleRegenerateQuestion, onEdit }: { q: any, handleRegenerateQuestion: (id: string) => Promise<void>, onEdit: (q: any) => void }) {
  const [isRegenerating, setIsRegenerating] = useState(false);

  const onRegen = async () => {
    setIsRegenerating(true);
    await handleRegenerateQuestion(q.id);
    setIsRegenerating(false);
  };

  return (
    <div className="border-b border-gray-200 pb-8 last:border-0 relative group">
      <div className="flex justify-between items-start mb-4">
        <span className="font-bold text-lg text-black">Q{q.questionNumber}.</span>
        <div className="flex items-center gap-2">
            <span className="text-sm font-semibold bg-gray-100 text-gray-700 px-3 py-1 rounded-full shadow-sm">[{q.marks} Marks]</span>
        </div>
      </div>
      
      <p className="text-lg mb-6 pl-8 font-serif leading-relaxed text-black">{q.question}</p>
      
      {q.type === 'mcq' && q.options && (
        <ol className="list-[upper-alpha] pl-16 space-y-3 mb-6 font-serif text-black">
          {q.options.map((opt: string, i: number) => <li key={i}>{opt}</li>)}
        </ol>
      )}
      
      <div className="flex flex-wrap items-center justify-between pl-8 mt-6">
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-1 rounded-md border border-blue-100">{q.topic}</span>
          <span className="text-xs font-semibold bg-green-50 text-green-700 px-2 py-1 rounded-md border border-green-100">{q.difficulty}</span>
          <span className="text-xs font-semibold bg-purple-50 text-purple-700 px-2 py-1 rounded-md border border-purple-100">{q.type}</span>
          <span className={`text-xs font-bold px-2 py-1 rounded-md border ${q.source === 'ai_generated' ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
              {q.source === 'ai_generated' ? '✨ AI Generated' : '📚 From Pool'}
          </span>
        </div>

        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
                onClick={onRegen} 
                disabled={isRegenerating}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 px-3 py-1.5 rounded-md border border-blue-200 transition-colors disabled:opacity-50 cursor-pointer"
            >
                {isRegenerating ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                Regenerate
            </button>
            <button 
                onClick={() => onEdit(q)}
                className="flex items-center gap-1 text-xs text-gray-600 hover:text-white bg-gray-50 hover:bg-gray-600 px-3 py-1.5 rounded-md border border-gray-200 transition-colors cursor-pointer"
            >
                <Edit3 size={14} />
                Edit
            </button>
        </div>
      </div>
    </div>
  );
}
