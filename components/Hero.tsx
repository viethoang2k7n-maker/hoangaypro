import React from 'react';
import { ViewType } from '../types';
import { BookOpen, Calendar, MessageCircle, Sparkles, ArrowRight } from 'lucide-react';

interface HeroProps {
  onNavigate: (view: ViewType) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Banner */}
      <section className="w-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-20 px-4 rounded-3xl shadow-2xl mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full -ml-10 -mb-10 blur-2xl"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-white/20">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>Được hỗ trợ bởi Google Gemini 2.5 Flash</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
            Giải Phóng Tiềm Năng <br/> Của Bạn Cùng AI
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Ứng dụng hỗ trợ sinh viên FPT Polytechnic tối ưu hóa thời gian học tập, tóm tắt kiến thức và giải đáp thắc mắc lập trình tức thì.
          </p>
          <button 
            onClick={() => onNavigate('chatbot')}
            className="group bg-white text-blue-700 hover:bg-blue-50 font-bold py-4 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2 mx-auto"
          >
            Trải Nghiệm Ngay
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl px-4 mb-20">
        <div 
          onClick={() => onNavigate('summarizer')}
          className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-slate-100 group"
        >
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-3">Tóm Tắt Bài Giảng</h3>
          <p className="text-slate-600 leading-relaxed">
            Sử dụng công nghệ NLP tiên tiến để rút gọn nội dung cốt lõi từ tài liệu dài chỉ trong vài giây.
          </p>
        </div>

        <div 
          onClick={() => onNavigate('scheduler')}
          className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-slate-100 group"
        >
          <div className="w-14 h-14 bg-violet-100 text-violet-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Calendar className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-3">Lên Lịch Thông Minh</h3>
          <p className="text-slate-600 leading-relaxed">
            Tự động sắp xếp thời gian biểu học tập và nghỉ ngơi khoa học dựa trên thói quen cá nhân của bạn.
          </p>
        </div>

        <div 
          onClick={() => onNavigate('chatbot')}
          className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-slate-100 group"
        >
          <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <MessageCircle className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-3">Trợ Lý 24/7</h3>
          <p className="text-slate-600 leading-relaxed">
            Giải đáp thắc mắc về lập trình Java, Python, JavaScript và các môn học khác bất cứ lúc nào.
          </p>
        </div>
      </div>
    </div>
  );
};
