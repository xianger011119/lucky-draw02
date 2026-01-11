
import React, { useState } from 'react';

interface NameInputProps {
  onUpdateNames: (names: string[]) => void;
  onUseDemo: () => void;
}

const NameInput: React.FC<NameInputProps> = ({ onUpdateNames, onUseDemo }) => {
  const [inputText, setInputText] = useState('');

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const handleApply = () => {
    const lines = inputText.split(/\r?\n/).map(l => l.trim()).filter(l => l !== "");
    onUpdateNames(lines);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      // Basic CSV/Text parsing: split by newlines and commas
      const names = text.split(/[\r\n,]+/).map(n => n.trim()).filter(n => n !== "");
      setInputText(names.join('\n'));
      onUpdateNames(names);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <label className="block text-sm font-medium text-slate-700 mb-1">貼上名單 (每行一個姓名)</label>
          <textarea
            value={inputText}
            onChange={handleTextChange}
            placeholder="例如：&#10;王小明&#10;李大華&#10;陳小姐"
            className="w-full h-40 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
        </div>
        <div className="flex flex-col gap-3 justify-center">
          <button
            onClick={handleApply}
            className="w-full bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            套用名單
          </button>
          
          <div className="relative">
            <input
              type="file"
              accept=".csv,.txt"
              onChange={handleFileUpload}
              className="hidden"
              id="csv-upload"
            />
            <label
              htmlFor="csv-upload"
              className="w-full flex justify-center items-center bg-white border border-slate-300 text-slate-700 px-6 py-2 rounded-lg font-medium hover:bg-slate-50 cursor-pointer transition-colors shadow-sm"
            >
              上傳 CSV / TXT
            </label>
          </div>

          <button
            onClick={onUseDemo}
            className="w-full bg-slate-100 text-slate-600 px-6 py-2 rounded-lg font-medium hover:bg-slate-200 transition-colors"
          >
            試用模擬名單
          </button>
        </div>
      </div>
      <p className="text-xs text-slate-500">
        支援上傳單欄 CSV 或純文字檔。重複姓名將會自動標記，供您手動清理。
      </p>
    </div>
  );
};

export default NameInput;
