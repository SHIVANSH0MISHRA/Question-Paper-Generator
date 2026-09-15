import { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, Circle } from 'lucide-react';

export function GenerationProgress() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((s) => (s < 4 ? s + 1 : s));
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  const steps = [
    "Validating constraints",
    "Calculating question allocation",
    "Checking feasibility",
    "Generating questions with Gemini",
    "Building final paper"
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[500px]">
      <div className="glass-panel p-12 rounded-3xl max-w-md w-full text-center">
        <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-6" />
        <h2 className="text-2xl font-bold mb-8 text-white">Creating your paper...</h2>
        
        <div className="space-y-4 text-left">
          {steps.map((text, i) => (
            <div key={i} className={`flex items-center gap-4 transition-all duration-500 ${i <= step ? 'opacity-100 translate-x-0' : 'opacity-30 -translate-x-2'}`}>
              {i < step ? (
                <CheckCircle2 className="text-green-400 w-5 h-5 shrink-0" />
              ) : i === step ? (
                <Loader2 className="text-blue-400 w-5 h-5 animate-spin shrink-0" />
              ) : (
                <Circle className="text-gray-600 w-5 h-5 shrink-0" />
              )}
              <span className={`text-sm ${i === step ? 'text-white font-medium' : 'text-gray-400'}`}>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
