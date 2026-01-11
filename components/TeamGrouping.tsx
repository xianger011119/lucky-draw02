
import React, { useState } from 'react';
import { Participant, GroupResult } from '../types';

interface TeamGroupingProps {
  participants: Participant[];
}

const TeamGrouping: React.FC<TeamGroupingProps> = ({ participants }) => {
  const [groupType, setGroupType] = useState<'count' | 'size'>('count');
  const [inputValue, setInputValue] = useState(2);
  const [groups, setGroups] = useState<GroupResult[]>([]);

  const generateGroups = () => {
    if (participants.length === 0) return;

    const shuffled = [...participants].sort(() => 0.5 - Math.random());
    const result: GroupResult[] = [];
    
    let numGroups = 0;
    if (groupType === 'count') {
      numGroups = Math.max(1, Math.min(participants.length, inputValue));
    } else {
      numGroups = Math.max(1, Math.ceil(participants.length / inputValue));
    }

    // Initialize groups
    for (let i = 0; i < numGroups; i++) {
      result.push({ groupName: `第 ${i + 1} 組`, members: [] });
    }

    // Distribute members
    shuffled.forEach((p, idx) => {
      result[idx % numGroups].members.push(p);
    });

    setGroups(result);
  };

  const downloadCSV = () => {
    if (groups.length === 0) return;

    let csvContent = "\uFEFF組別,成員姓名\n"; // Added BOM for Excel Chinese support
    groups.forEach(group => {
      group.members.forEach(member => {
        csvContent += `"${group.groupName}","${member.name}"\n`;
      });
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `分組結果_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Config Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-xl font-semibold mb-4 text-slate-800">分組設定</h3>
        <div className="flex flex-col md:flex-row items-end gap-6">
          <div className="w-full md:w-48">
            <label className="block text-sm font-medium text-slate-700 mb-1">分組方式</label>
            <select
              value={groupType}
              onChange={(e) => setGroupType(e.target.value as any)}
              className="w-full p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="count">設定分組總數</option>
              <option value="size">設定每組人數</option>
            </select>
          </div>
          <div className="w-full md:w-32">
            <label className="block text-sm font-medium text-slate-700 mb-1">數量 / 人數</label>
            <input
              type="number"
              min="1"
              value={inputValue}
              onChange={(e) => setInputValue(parseInt(e.target.value) || 1)}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={generateGroups}
              disabled={participants.length === 0}
              className="bg-indigo-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50"
            >
              隨機分組
            </button>
            {groups.length > 0 && (
              <button
                onClick={downloadCSV}
                className="bg-emerald-500 text-white px-8 py-2 rounded-lg font-bold hover:bg-emerald-600 transition-colors shadow-sm flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                導出 CSV
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Visualization */}
      {groups.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {groups.map((group, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 50}ms` }}>
              <div className="bg-slate-800 text-white px-4 py-2 font-bold flex justify-between items-center">
                <span>{group.groupName}</span>
                <span className="text-xs bg-slate-700 px-2 py-1 rounded">{group.members.length} 人</span>
              </div>
              <div className="p-4 flex-grow space-y-2 max-h-60 overflow-y-auto bg-slate-50">
                {group.members.map((member) => (
                  <div key={member.id} className="bg-white p-2 rounded border border-slate-200 text-sm font-medium shadow-xs">
                    {member.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl py-20 text-center text-slate-400">
          設定分組條件並點擊「隨機分組」以查看結果。
        </div>
      )}
    </div>
  );
};

export default TeamGrouping;
