
import React, { useState, useMemo } from 'react';
import { Participant, AppTab } from './types';
import NameInput from './components/NameInput';
import LuckyDraw from './components/LuckyDraw';
import TeamGrouping from './components/TeamGrouping';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.Names);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [drawHistory, setDrawHistory] = useState<string[]>([]);

  // Duplicate detection
  const duplicates = useMemo(() => {
    const counts: Record<string, number> = {};
    participants.forEach(p => {
      counts[p.name] = (counts[p.name] || 0) + 1;
    });
    return Object.keys(counts).filter(name => counts[name] > 1);
  }, [participants]);

  const removeDuplicates = () => {
    const seen = new Set<string>();
    const unique = participants.filter(p => {
      if (seen.has(p.name)) return false;
      seen.add(p.name);
      return true;
    });
    setParticipants(unique);
  };

  const handleUpdateNames = (names: string[]) => {
    const newParticipants = names.map(name => ({
      id: Math.random().toString(36).substr(2, 9),
      name: name.trim()
    })).filter(p => p.name !== "");
    setParticipants(newParticipants);
  };

  const useDemoData = () => {
    const demoNames = [
      "陳小明", "林美惠", "張大春", "王婉婷", "李志豪", 
      "周杰倫", "蔡依林", "蕭敬騰", "林俊傑", "田馥甄",
      "郭台銘", "張忠謀", "黃仁勳", "蘇姿丰", "馬斯克",
      "奧特曼", "賈伯斯", "蓋茲", "陳小明", "林美惠" // Intentional duplicates
    ];
    handleUpdateNames(demoNames);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-indigo-700 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h1 className="text-2xl font-bold tracking-tight">HR Event Master</h1>
          </div>
          
          <nav className="flex bg-indigo-800 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab(AppTab.Names)}
              className={`px-4 py-2 rounded-md transition-all ${activeTab === AppTab.Names ? 'bg-white text-indigo-700 shadow' : 'text-indigo-100 hover:text-white'}`}
            >
              名單管理
            </button>
            <button 
              onClick={() => setActiveTab(AppTab.LuckyDraw)}
              className={`px-4 py-2 rounded-md transition-all ${activeTab === AppTab.LuckyDraw ? 'bg-white text-indigo-700 shadow' : 'text-indigo-100 hover:text-white'}`}
            >
              抽籤大獎
            </button>
            <button 
              onClick={() => setActiveTab(AppTab.Grouping)}
              className={`px-4 py-2 rounded-md transition-all ${activeTab === AppTab.Grouping ? 'bg-white text-indigo-700 shadow' : 'text-indigo-100 hover:text-white'}`}
            >
              團隊分組
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-6xl mx-auto w-full p-4 md:p-8">
        {activeTab === AppTab.Names && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-semibold mb-4 text-slate-800">匯入人員名單</h2>
              <NameInput onUpdateNames={handleUpdateNames} onUseDemo={useDemoData} />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-slate-800">
                  目前名單 ({participants.length} 人)
                </h2>
                {duplicates.length > 0 && (
                  <div className="flex items-center gap-3">
                    <span className="text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-sm font-medium border border-amber-200">
                      發現 {duplicates.length} 個重複姓名
                    </span>
                    <button 
                      onClick={removeDuplicates}
                      className="text-white bg-amber-500 hover:bg-amber-600 px-4 py-1 rounded-md text-sm transition-colors"
                    >
                      移除重複
                    </button>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-96 overflow-y-auto p-2 bg-slate-50 rounded-lg">
                {participants.length > 0 ? (
                  participants.map((p) => (
                    <div 
                      key={p.id} 
                      className={`p-2 rounded bg-white border text-center text-sm shadow-sm ${duplicates.includes(p.name) ? 'border-amber-300 ring-1 ring-amber-100' : 'border-slate-200'}`}
                    >
                      {p.name}
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center text-slate-400">
                    尚未有任何人員，請從上方匯入。
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === AppTab.LuckyDraw && (
          <LuckyDraw participants={participants} />
        )}

        {activeTab === AppTab.Grouping && (
          <TeamGrouping participants={participants} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-400 py-6 text-center text-sm">
        <p>© 2024 HR Event Master - 為 HR 打造的活動利器</p>
      </footer>
    </div>
  );
};

export default App;
