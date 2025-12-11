import React, { useState } from 'react';
import { summarizeContent } from '../services/geminiService';
import { FileText, Loader2, Copy, Check, Upload } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const Summarizer: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSummarize = async () => {
    if (!inputText.trim()) return;
    
    setLoading(true);
    setSummary('');
    try {
      const result = await summarizeContent(inputText);
      setSummary(result);
    } catch (error) {
      setSummary('Đã có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result;
        if (typeof text === 'string') {
          setInputText(text);
        }
      };
      reader.readAsText(file);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Tóm Tắt Bài Giảng</h2>
        <p className="text-slate-600">Dán nội dung hoặc tải lên file văn bản để nhận tóm tắt nhanh chóng.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[600px]">
        {/* Input Section */}
        <div className="flex flex-col bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <label className="font-semibold text-slate-700 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              Nội dung gốc
            </label>
            <div className="relative">
              <input 
                type="file" 
                accept=".txt,.md,.js,.java,.py"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <button className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors">
                <Upload className="w-4 h-4" />
                Upload File
              </button>
            </div>
          </div>
          <textarea
            className="flex-1 w-full p-4 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-sm leading-relaxed"
            placeholder="Dán nội dung bài học, code, hoặc ghi chú vào đây..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          ></textarea>
          <button
            onClick={handleSummarize}
            disabled={loading || !inputText}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-md"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Đang phân tích...
              </>
            ) : (
              'Tóm Tắt Ngay'
            )}
          </button>
        </div>

        {/* Output Section */}
        <div className="flex flex-col bg-white p-4 rounded-xl shadow-sm border border-slate-200 relative">
          <div className="flex justify-between items-center mb-4">
            <label className="font-semibold text-slate-700 flex items-center gap-2">
              <span className="bg-emerald-100 p-1 rounded">✨</span>
              Kết quả AI
            </label>
            {summary && (
              <button 
                onClick={copyToClipboard}
                className="text-slate-400 hover:text-blue-600 transition-colors"
                title="Sao chép"
              >
                {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
              </button>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto bg-slate-50 rounded-lg p-4 border border-slate-200">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin mb-2 text-blue-500" />
                <p>Gemini đang đọc hiểu nội dung...</p>
              </div>
            ) : summary ? (
              <div className="prose prose-sm max-w-none text-slate-700 prose-headings:text-slate-800 prose-a:text-blue-600">
                <ReactMarkdown>{summary}</ReactMarkdown>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 italic">
                Kết quả tóm tắt sẽ hiển thị ở đây
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
