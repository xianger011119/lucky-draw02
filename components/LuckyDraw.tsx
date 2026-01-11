
import React, { useState, useEffect, useRef } from 'react';
import { Participant } from '../types';

interface LuckyDrawProps {
  participants: Participant[];
}

const LuckyDraw: React.FC<LuckyDrawProps> = ({ participants }) => {
  const [winner, setWinner] = useState<Participant | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [prizeName, setPrizeName] = useState('特等獎');
  const [allowDuplicateWinner, setAllowDuplicateWinner] = useState(false);
  const [history, setHistory] = useState<{ prize: string; name: string }[]>([]);
  const [rollingName, setRollingName] = useState('???');
  
  const timerRef = useRef<number | null>(null);

  const startDraw = () => {
    if (participants.length === 0) return;
    
    // Filter available participants if duplicates are not allowed
    const available = allowDuplicateWinner 
      ? participants 
      : participants.filter(p => !history.some(h => h.name === p.name));

    if (available.length === 0) {
      alert("所有人都已經中過獎了！");
      return;
    }

    setIsDrawing(true);
    setWinner(null);

    // Animation logic
    let counter = 0;
    const duration = 3000; // 3 seconds
    const startTime = Date.now();

    const roll = () => {
      const elapsed = Date.now() - startTime;
      const randomIdx = Math.floor(Math.random() * participants.length);
      setRollingName(participants[randomIdx].name);

      if (elapsed < duration) {
        timerRef.current = window.setTimeout(roll, 50);
      } else {
        const finalIdx = Math.floor(Math.random() * available.length);
        const finalWinner = available[finalIdx];
        setWinner(finalWinner);
        setIsDrawing(false);
        setHistory(prev => [{ prize: prizeName, name: finalWinner.name }, ...prev]);
      }
    };

    roll();
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Settings & Draw Area */}
      <div className="md:col-span-2 space-y-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-indigo-100 flex flex-col items-center justify-center min-h-[400px]">
          <div className="mb-6 text-center">
            <h3 className="text-2xl font-bold text-indigo-900 mb-2">{prizeName}</h3>
            <p className="text-slate-500">準備好揭曉幸運兒了嗎？</p>
          </div>

          <div className="w-full max-w-sm aspect-video bg-indigo-50 rounded-2xl border-4 border-indigo-200 flex items-center justify-center mb-8 relative overflow-hidden">
            {isDrawing ? (
              <div className="text-4xl md:text-5xl font-black text-indigo-600 animate-bounce">
                {rollingName}
              </div>
            ) : winner ? (
              <div className="text-center animate-in fade-in zoom-in duration-500">
                <div className="text-5xl md:text-6xl font-black text-indigo-700 mb-2 drop-shadow-md">
                  {winner.name}
                </div>
                <div className="inline-block px-4 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold">
                  恭喜獲獎！
                </div>
              </div>
            ) : (
              <div className="text-6xl font-bold text-indigo-200">?</div>
            )}
            
            {/* Visual Flair */}
            <div className="absolute top-0 left-0 w-2 h-full bg-indigo-200/50"></div>
            <div className="absolute top-0 right-0 w-2 h-full bg-indigo-200/50"></div>
          </div>

          <div className="flex gap-4 w-full max-w-sm">
            <button
              disabled={isDrawing || participants.length === 0}
              onClick={startDraw}
              className={`flex-grow py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${
                isDrawing 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:scale-105 active:scale-95'
              }`}
            >
              {isDrawing ? '正在開獎...' : '開始抽籤'}
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h4 className="text-lg font-semibold mb-4 text-slate-800">抽籤設定</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">獎品名稱</label>
              <input
                type="text"
                value={prizeName}
                onChange={(e) => setPrizeName(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={allowDuplicateWinner}
                  onChange={(e) => setAllowDuplicateWinner(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-slate-700">允許重複中獎</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* History Sidebar */}
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 h-[600px] flex flex-col">
        <h4 className="text-lg font-bold mb-4 text-slate-800 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          中獎紀錄
        </h4>
        <div className="flex-grow overflow-y-auto space-y-3 pr-2">
          {history.length > 0 ? (
            history.map((item, idx) => (
              <div key={idx} className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 animate-in slide-in-from-right duration-300">
                <div className="text-xs font-bold text-indigo-500 uppercase tracking-wider">{item.prize}</div>
                <div className="text-lg font-bold text-slate-800">{item.name}</div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-slate-400 text-sm">尚未產生中獎紀錄</div>
          )}
        </div>
        <button 
          onClick={() => setHistory([])}
          className="mt-4 text-xs text-slate-400 hover:text-slate-600 transition-colors underline"
        >
          清空紀錄
        </button>
      </div>
    </div>
  );
};

export default LuckyDraw;
