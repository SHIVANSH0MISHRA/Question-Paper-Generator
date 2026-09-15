import { FileText, Database, LogOut, Hexagon } from 'lucide-react';

export function Sidebar({ activeItem, setActiveItem }: { activeItem: string, setActiveItem?: (item: string) => void }) {
  const items = [
    { name: 'Generate Paper', icon: FileText },
    { name: 'Question Bank', icon: Database },
  ];

  return (
    <div className="w-20 md:w-64 h-full glass-panel-subtle flex flex-col justify-between py-6 rounded-3xl overflow-hidden transition-all duration-300 relative border-r-0">
      <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
      
      <div>
        <div className="flex items-center gap-3 px-6 mb-12">
            <Hexagon className="text-blue-400" size={32} />
            <span className="font-bold text-xl tracking-tight hidden md:block bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Evalvia AI</span>
        </div>
        
        <nav className="flex flex-col gap-2 px-4">
          {items.map((item) => {
            const isActive = item.name === activeItem;
            return (
              <button 
                key={item.name}
                onClick={() => setActiveItem && setActiveItem(item.name)}
                className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 group relative overflow-hidden ${
                  isActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-400 rounded-r-full shadow-[0_0_10px_rgba(96,165,250,0.5)]"></div>
                )}
                <item.icon size={20} className={isActive ? 'text-blue-400' : 'group-hover:text-blue-400 transition-colors'} />
                <span className="font-medium text-sm hidden md:block">{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="px-4">
        <button className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-gray-400 hover:text-white hover:bg-white/5 transition-all group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-lg">TM</div>
            <span className="font-medium text-sm hidden md:block flex-1 text-left">Teacher Profile</span>
            <LogOut size={16} className="opacity-0 group-hover:opacity-100 transition-opacity hidden md:block" />
        </button>
      </div>
    </div>
  );
}
