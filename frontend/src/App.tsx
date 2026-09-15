import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { PaperConfigForm } from './components/PaperConfigForm';
import { GenerationProgress } from './components/GenerationProgress';
import { PaperPreview } from './components/PaperPreview';
import { BreakdownPanel } from './components/BreakdownPanel';
import { EditQuestionModal } from './components/EditQuestionModal';
import { QuestionBank } from './components/QuestionBank';

function App() {
  const [activeItem, setActiveItem] = useState('Generate Paper');
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  
  const [config, setConfig] = useState({
    subject: "Mathematics",
    totalMarks: 40,
    difficulty: { easy: 30, medium: 50, hard: 20 },
    topics: [
      { name: "Algebra", percentage: 40 },
      { name: "Geometry", percentage: 30 },
      { name: "Trigonometry", percentage: 30 }
    ],
    questionTypes: { mcq: 40, shortAnswer: 40, longAnswer: 20 }
  });

  const [loading, setLoading] = useState(false);
  const [paper, setPaper] = useState<any>(null);

  const handleGenerate = async () => {
    const diffSum = config.difficulty.easy + config.difficulty.medium + config.difficulty.hard;
    if (diffSum !== 100) {
        alert("Difficulty must sum to 100%");
        return;
    }

    setLoading(true);
    setPaper(null); 
    
    try {
      const response = await fetch('http://localhost:3001/api/papers/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      const data = await response.json();
      if (response.ok) {
        setPaper(data);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to connect to backend");
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateQuestion = async (questionId: string) => {
    if (!paper) return;
    try {
        const response = await fetch(`http://localhost:3001/api/papers/${paper.id}/questions/${questionId}/regenerate`, {
            method: 'POST'
        });
        const data = await response.json();
        if (response.ok) {
            setPaper(data);
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error(error);
        alert("Failed to regenerate question");
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 flex gap-6 overflow-hidden relative">
      
      {editingQuestion && paper && (
        <EditQuestionModal 
          question={editingQuestion}
          paperId={paper.id}
          onClose={() => setEditingQuestion(null)}
          onSave={(updatedPaper: any) => {
            setPaper(updatedPaper);
            setEditingQuestion(null);
          }}
        />
      )}

      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />

      <main className="flex-1 flex flex-col min-w-0 h-[calc(100vh-3rem)]">
        <TopBar onNewPaper={() => setPaper(null)} />
        
        <div className="flex-1 overflow-hidden relative">
          {activeItem === 'Generate Paper' && (
            <div className="absolute inset-0 grid grid-cols-1 xl:grid-cols-12 gap-8 h-full">
                
                <div className="xl:col-span-8 overflow-y-auto pr-2 pb-12 custom-scrollbar">
                    {loading ? (
                        <GenerationProgress />
                    ) : paper ? (
                        <PaperPreview 
                            paper={paper} 
                            handleRegenerateQuestion={handleRegenerateQuestion} 
                            onEdit={(q) => setEditingQuestion(q)}
                            onEditLayout={() => setPaper(null)}
                        />
                    ) : (
                        <div className="max-w-3xl glass-panel p-10 rounded-3xl">
                            <PaperConfigForm 
                                config={config} 
                                setConfig={setConfig} 
                                handleGenerate={handleGenerate} 
                                loading={loading} 
                            />
                        </div>
                    )}
                </div>

                <div className="xl:col-span-4 h-full overflow-y-auto pr-2 pb-12 custom-scrollbar">
                    {paper ? (
                        <BreakdownPanel 
                            config={paper.configuration} 
                            breakdown={paper.breakdown} 
                            conflicts={paper.conflicts} 
                        />
                    ) : (
                        <div className="h-full flex items-center justify-center glass-panel-subtle rounded-3xl opacity-50">
                            <p className="text-gray-400 text-sm">Configure and generate a paper to see insights.</p>
                        </div>
                    )}
                </div>
            </div>
          )}

          {activeItem === 'Question Bank' && (
              <div className="absolute inset-0">
                  <QuestionBank />
              </div>
          )}
        </div>
      </main>
      
    </div>
  );
}

export default App;
