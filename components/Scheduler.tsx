import React, { useState } from 'react';
import { generateSchedule } from '../services/geminiService';
import { ScheduleItem, SchedulePreferences } from '../types';
import { Clock, Book, Moon, Zap, Loader2, CalendarCheck } from 'lucide-react';

export const Scheduler: React.FC = () => {
  const [prefs, setPrefs] = useState<SchedulePreferences>({
    wakeUpTime: '07:00',
    sleepTime: '23:00',
    subjects: '',
    focusLevel: 'balanced',
  });
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await generateSchedule(prefs);
      setSchedule(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'study': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'break': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'personal': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'class': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Lên Lịch Tự Động</h2>
        <p className="text-slate-600">Nhập thông tin cá nhân để AI tối ưu hóa thời gian biểu cho bạn.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-5 sticky top-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Thời gian ngủ/nghỉ
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-slate-500 mb-1 block">Thức dậy</span>
                  <input
                    type="time"
                    value={prefs.wakeUpTime}
                    onChange={(e) => setPrefs({...prefs, wakeUpTime: e.target.value})}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <span className="text-xs text-slate-500 mb-1 block">Đi ngủ</span>
                  <input
                    type="time"
                    value={prefs.sleepTime}
                    onChange={(e) => setPrefs({...prefs, sleepTime: e.target.value})}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <Book className="w-4 h-4" /> Môn học / Nhiệm vụ
              </label>
              <textarea
                value={prefs.subjects}
                onChange={(e) => setPrefs({...prefs, subjects: e.target.value})}
                placeholder="VD: Java cơ bản, Ôn thi tiếng Anh, Làm Assignment..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4" /> Cường độ học
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['relaxed', 'balanced', 'intense'] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setPrefs({...prefs, focusLevel: level})}
                    className={`p-2 rounded-lg text-sm capitalize border transition-all ${
                      prefs.focusLevel === level 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {level === 'relaxed' ? 'Thoải mái' : level === 'balanced' ? 'Cân bằng' : 'Căng thẳng'}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CalendarCheck className="w-5 h-5" /> Tạo Lịch Trình</>}
            </button>
          </form>
        </div>

        {/* Schedule Output */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px] flex flex-col">
             <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
               <h3 className="font-bold text-slate-700">Lịch Trình Đề Xuất</h3>
               <span className="text-xs font-medium text-slate-500 px-2 py-1 bg-slate-200 rounded">
                 {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
               </span>
             </div>
             
             <div className="p-6 flex-1 overflow-y-auto">
                {loading ? (
                  <div className="h-full flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                    <p className="text-slate-500 animate-pulse">AI đang tính toán lộ trình tối ưu...</p>
                  </div>
                ) : schedule.length > 0 ? (
                  <div className="relative border-l-2 border-slate-200 ml-3 space-y-8">
                    {schedule.map((item, index) => (
                      <div key={index} className="relative pl-8">
                        {/* Timeline dot */}
                        <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                          item.category === 'study' ? 'bg-blue-500' : 
                          item.category === 'break' ? 'bg-emerald-400' : 'bg-slate-400'
                        }`}></div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6 group">
                          <div className="min-w-[120px]">
                            <span className="text-sm font-bold text-slate-900 block">{item.time}</span>
                            <span className={`text-xs inline-block px-2 py-0.5 rounded-full mt-1 border ${getCategoryColor(item.category)}`}>
                              {item.category === 'study' ? 'Học tập' : 
                               item.category === 'break' ? 'Nghỉ ngơi' : 
                               item.category === 'class' ? 'Lên lớp' : 'Cá nhân'}
                            </span>
                          </div>
                          <div className="flex-1 pb-6 border-b border-slate-100 group-last:border-0 group-last:pb-0">
                            <h4 className="text-lg font-semibold text-slate-800">{item.activity}</h4>
                            <p className="text-slate-500 text-sm mt-1">{item.notes}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400">
                    <Moon className="w-16 h-16 mb-4 opacity-20" />
                    <p>Chưa có lịch trình nào. Hãy điền thông tin bên trái!</p>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
