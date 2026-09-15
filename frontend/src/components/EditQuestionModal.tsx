import { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

export function EditQuestionModal({ question, paperId, onClose, onSave }: any) {
  const [formData, setFormData] = useState({
    question: '',
    options: [] as string[],
    answer: '',
    explanation: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (question) {
      setFormData({
        question: question.question || '',
        options: question.options ? [...question.options] : [],
        answer: question.answer || '',
        explanation: question.explanation || ''
      });
    }
  }, [question]);

  if (!question) return null;

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3001/api/papers/${paperId}/questions/${question.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        onSave(data); // returns updated paper
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to save question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-2xl rounded-3xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white">Edit Question</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-start gap-3">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-2 mb-6">
            <span className="text-xs bg-white/5 text-gray-300 px-3 py-1 rounded-md border border-white/10">{question.topic}</span>
            <span className="text-xs bg-white/5 text-gray-300 px-3 py-1 rounded-md border border-white/10">{question.difficulty}</span>
            <span className="text-xs bg-white/5 text-gray-300 px-3 py-1 rounded-md border border-white/10">{question.type}</span>
            <span className="text-xs bg-white/5 text-gray-300 px-3 py-1 rounded-md border border-white/10">{question.marks} Marks</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Question Text</label>
            <textarea 
              value={formData.question}
              onChange={e => setFormData({...formData, question: e.target.value})}
              className="w-full glass-input min-h-[100px] resize-y"
            />
          </div>

          {question.type === 'mcq' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Options</label>
              <div className="space-y-3">
                {formData.options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-gray-400 font-medium w-6">{String.fromCharCode(65 + idx)}.</span>
                    <input 
                      type="text" 
                      value={opt}
                      onChange={e => {
                        const newOpts = [...formData.options];
                        newOpts[idx] = e.target.value;
                        setFormData({...formData, options: newOpts});
                      }}
                      className="flex-1 glass-input"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Correct Answer</label>
              <input 
                type="text" 
                value={formData.answer}
                onChange={e => setFormData({...formData, answer: e.target.value})}
                className="w-full glass-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Explanation</label>
            <textarea 
              value={formData.explanation}
              onChange={e => setFormData({...formData, explanation: e.target.value})}
              className="w-full glass-input min-h-[80px]"
            />
          </div>
        </div>

        <div className="p-6 border-t border-white/10 flex justify-end gap-3 bg-white/5">
          <button 
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl glass-button-secondary text-sm"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl glass-button-primary text-sm flex items-center gap-2"
          >
            {loading ? 'Saving...' : (
              <>
                <Save size={16} />
                Save Changes
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
