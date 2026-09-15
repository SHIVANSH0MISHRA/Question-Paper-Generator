import { Bell, Search, Plus } from 'lucide-react';

export function TopBar({ onNewPaper }: { onNewPaper: () => void }) {
  return (
    <div className="flex justify-between items-center w-full mb-8">
      <div>
        <h2 className="text-xl font-medium text-white mb-1 tracking-tight">Welcome back, Teacher</h2>
        <p className="text-sm text-gray-400">Create a question paper that matches exactly what you need.</p>
      </div>
      
      <div className="flex items-center gap-3">
        <button 
            onClick={onNewPaper}
            className="hidden md:flex items-center gap-2 glass-button-primary px-4 py-2 rounded-full text-sm cursor-pointer"
        >
          <Plus size={16} />
          <span>New Paper</span>
        </button>
        
        <button className="w-10 h-10 rounded-full glass-panel-subtle flex items-center justify-center text-gray-300 hover:text-white transition-colors">
          <Search size={18} />
        </button>
        
        <button className="w-10 h-10 rounded-full glass-panel-subtle flex items-center justify-center text-gray-300 hover:text-white transition-colors relative">
          <Bell size={18} />
          <div className="absolute top-2 right-2 w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_5px_rgba(96,165,250,1)]"></div>
        </button>
      </div>
    </div>
  );
}
