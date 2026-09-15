import { Download, LayoutTemplate } from 'lucide-react';
import { QuestionCard } from './QuestionCard';

export function PaperPreview({ paper, handleRegenerateQuestion, onEdit, onEditLayout }: { paper: any, handleRegenerateQuestion: (id: string) => Promise<void>, onEdit: (q: any) => void, onEditLayout: () => void }) {
  
  const handleDownloadPdf = () => {
      window.open(`http://localhost:3001/api/papers/${paper.id}/pdf`, '_blank');
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
          <div>
              <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">{paper.configuration.subject} — Class 10</h2>
              <p className="text-sm text-gray-400">{paper.configuration.totalMarks} Marks • 2 Hours</p>
          </div>
          <div className="flex gap-3">
              <button onClick={onEditLayout} className="flex items-center gap-2 glass-button-secondary px-4 py-2 rounded-full text-sm cursor-pointer">
                  <LayoutTemplate size={16} />
                  <span>Edit Layout</span>
              </button>
              <button onClick={handleDownloadPdf} className="flex items-center gap-2 glass-button-primary px-4 py-2 rounded-full text-sm cursor-pointer">
                  <Download size={16} />
                  <span>Download PDF</span>
              </button>
          </div>
      </div>

      <div className="flex-1 bg-white p-12 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-200 overflow-y-auto max-h-[800px] text-gray-800 scroll-smooth">
          <div className="text-center mb-16 border-b-2 border-black pb-8">
              <h2 className="text-4xl font-serif font-bold uppercase tracking-widest mb-4">
                  {paper.configuration.subject} Question Paper
              </h2>
              <div className="flex justify-between text-base font-semibold uppercase text-gray-700 tracking-wider">
                  <span>Time: 2 Hours</span>
                  <span>Max Marks: {paper.configuration.totalMarks}</span>
              </div>
          </div>
          
          <div className="mb-12 border border-gray-300 p-6 rounded-lg bg-gray-50/50">
              <h3 className="font-bold text-lg mb-3">General Instructions</h3>
              <ol className="list-decimal pl-5 space-y-1 text-gray-700">
                  <li>All questions are compulsory.</li>
                  <li>Read each question carefully.</li>
                  <li>Show necessary working where applicable.</li>
              </ol>
          </div>
          
          <div className="space-y-12">
            {paper.questions.map((q: any) => (
              <QuestionCard key={q.id} q={q} handleRegenerateQuestion={handleRegenerateQuestion} onEdit={onEdit} />
            ))}
          </div>
      </div>
    </div>
  );
}
