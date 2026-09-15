import { Plus, X, Settings2 } from 'lucide-react';

export function PaperConfigForm({ config, setConfig, handleGenerate, loading }: any) {
  return (
    <div className="space-y-6">
      <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Design your question paper</h1>
          <p className="text-gray-400">Tell Evalvia how you want your paper structured.</p>
      </div>

      {/* Basic Details */}
      <div className="glass-panel-subtle p-6 rounded-2xl">
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2"><Settings2 size={16} /> Basic Details</h3>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-xs text-gray-400 mb-1 ml-1">Subject</label>
                <select 
                    value={config.subject} 
                    onChange={e => setConfig({...config, subject: e.target.value})}
                    className="w-full glass-input appearance-none"
                >
                    <option value="Mathematics" className="text-black">Mathematics</option>
                    <option value="Science" className="text-black">Science</option>
                </select>
            </div>
            <div>
                <label className="block text-xs text-gray-400 mb-1 ml-1">Total Marks</label>
                <input 
                    type="number" 
                    value={config.totalMarks} 
                    onChange={e => setConfig({...config, totalMarks: parseInt(e.target.value) || 0})}
                    className="w-full glass-input"
                />
            </div>
        </div>
      </div>

      {/* Difficulty Mix */}
      <div className="glass-panel-subtle p-6 rounded-2xl">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Difficulty Mix</h3>
            <div className="flex gap-2">
                <button onClick={() => setConfig({...config, difficulty: {easy: 30, medium: 50, hard: 20}})} className="text-xs bg-white/5 hover:bg-white/10 px-3 py-1 rounded-full border border-white/10 transition-colors">30/50/20</button>
                <button onClick={() => setConfig({...config, difficulty: {easy: 50, medium: 30, hard: 20}})} className="text-xs bg-white/5 hover:bg-white/10 px-3 py-1 rounded-full border border-white/10 transition-colors">50/30/20</button>
            </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <span className="block text-xs text-gray-400 mb-2">Easy</span>
                <input type="number" value={config.difficulty.easy} onChange={e => setConfig({...config, difficulty: {...config.difficulty, easy: parseInt(e.target.value) || 0}})} className="w-full bg-transparent text-2xl font-light text-center focus:outline-none" />
                <span className="text-xs text-gray-500">%</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <span className="block text-xs text-gray-400 mb-2">Medium</span>
                <input type="number" value={config.difficulty.medium} onChange={e => setConfig({...config, difficulty: {...config.difficulty, medium: parseInt(e.target.value) || 0}})} className="w-full bg-transparent text-2xl font-light text-center focus:outline-none" />
                <span className="text-xs text-gray-500">%</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <span className="block text-xs text-gray-400 mb-2">Hard</span>
                <input type="number" value={config.difficulty.hard} onChange={e => setConfig({...config, difficulty: {...config.difficulty, hard: parseInt(e.target.value) || 0}})} className="w-full bg-transparent text-2xl font-light text-center focus:outline-none" />
                <span className="text-xs text-gray-500">%</span>
            </div>
        </div>
        {(() => {
            const sum = config.difficulty.easy + config.difficulty.medium + config.difficulty.hard;
            return (
                <div className={`mt-3 text-xs flex items-center gap-2 ${sum === 100 ? 'text-green-400' : 'text-amber-400'}`}>
                    {sum === 100 ? '✓ Total: 100%' : `⚠ Total: ${sum}%. Must equal 100%.`}
                </div>
            );
        })()}
      </div>

      {/* Topic Weightage */}
      <div className="glass-panel-subtle p-6 rounded-2xl">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Topic Weightage</h3>
            <button onClick={() => setConfig({...config, topics: [...config.topics, {name: "New Topic", percentage: 0}]})} className="text-xs flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors bg-blue-400/10 px-3 py-1 rounded-full"><Plus size={12}/> Add Topic</button>
        </div>
        <div className="space-y-3">
          {config.topics.map((t: any, idx: number) => (
              <div key={idx} className="flex gap-3 items-center group">
                  <input type="text" value={t.name} onChange={e => { const newT = [...config.topics]; newT[idx].name = e.target.value; setConfig({...config, topics: newT}) }} className="flex-1 glass-input" placeholder="Topic Name"/>
                  <div className="relative w-24">
                      <input type="number" value={t.percentage} onChange={e => { const newT = [...config.topics]; newT[idx].percentage = parseInt(e.target.value) || 0; setConfig({...config, topics: newT}) }} className="w-full glass-input text-right pr-6"/>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                  </div>
                  <button onClick={() => { const newT = config.topics.filter((_: any, i: number) => i !== idx); setConfig({...config, topics: newT}) }} className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100"><X size={16}/></button>
              </div>
          ))}
        </div>
      </div>

      {/* Question Types */}
      <div className="glass-panel-subtle p-6 rounded-2xl">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Question Types</h3>
            <div className="flex gap-2">
                <button onClick={() => setConfig({...config, questionTypes: {mcq: 40, shortAnswer: 40, longAnswer: 20}})} className="text-xs bg-white/5 hover:bg-white/10 px-3 py-1 rounded-full border border-white/10 transition-colors">40/40/20</button>
            </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <span className="block text-xs text-gray-400 mb-2">MCQ</span>
                <input type="number" value={config.questionTypes.mcq} onChange={e => setConfig({...config, questionTypes: {...config.questionTypes, mcq: parseInt(e.target.value) || 0}})} className="w-full bg-transparent text-2xl font-light text-center focus:outline-none" />
                <span className="text-xs text-gray-500">%</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <span className="block text-xs text-gray-400 mb-2">Short Answer</span>
                <input type="number" value={config.questionTypes.shortAnswer} onChange={e => setConfig({...config, questionTypes: {...config.questionTypes, shortAnswer: parseInt(e.target.value) || 0}})} className="w-full bg-transparent text-2xl font-light text-center focus:outline-none" />
                <span className="text-xs text-gray-500">%</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <span className="block text-xs text-gray-400 mb-2">Long Answer</span>
                <input type="number" value={config.questionTypes.longAnswer} onChange={e => setConfig({...config, questionTypes: {...config.questionTypes, longAnswer: parseInt(e.target.value) || 0}})} className="w-full bg-transparent text-2xl font-light text-center focus:outline-none" />
                <span className="text-xs text-gray-500">%</span>
            </div>
        </div>
      </div>

      <button 
        onClick={handleGenerate}
        disabled={loading}
        className="w-full glass-button-primary py-4 rounded-xl text-lg flex items-center justify-center gap-2 group"
      >
        {loading ? 'Validating Constraints...' : 'Generate Question Paper'}
        {!loading && <span className="group-hover:translate-x-1 transition-transform">→</span>}
      </button>
    </div>
  );
}
