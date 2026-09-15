import { useState, useEffect } from 'react';
import { Database, Search } from 'lucide-react';

export function QuestionBank() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/questions')
      .then(res => res.json())
      .then(data => {
        setQuestions(data);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-10 text-white">Loading question bank...</div>;
  }

  return (
    <div className="h-full flex flex-col p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2 text-white flex items-center gap-3">
                <Database className="text-blue-400" />
                Question Bank
            </h1>
            <p className="text-gray-400">Viewing all {questions.length} seeded questions available in the pool.</p>
        </div>
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="Search pool..." className="glass-input pl-10 py-2 w-64" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar glass-panel rounded-3xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {questions.map((q, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded border border-blue-500/30 font-semibold">{q.topic}</span>
                        <span className="text-xs text-gray-400">{q.marks}M</span>
                    </div>
                    <p className="text-sm text-gray-200 mb-4 line-clamp-3">{q.question}</p>
                    <div className="flex flex-wrap gap-1 mt-auto">
                        <span className="text-[10px] bg-white/10 text-gray-300 px-2 py-1 rounded-full">{q.difficulty}</span>
                        <span className="text-[10px] bg-white/10 text-gray-300 px-2 py-1 rounded-full">{q.type}</span>
                        <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full ml-auto">{q.source}</span>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
