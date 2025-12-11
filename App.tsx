import React, { useState } from 'react';
import { ViewType } from './types';
import { Hero } from './components/Hero';
import { Summarizer } from './components/Summarizer';
import { Scheduler } from './components/Scheduler';
import { Chatbot } from './components/Chatbot';
import { GraduationCap, LayoutGrid, FileText, Calendar, MessageSquare } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');

  const renderContent = () => {
    switch (currentView) {
      case 'home': return <Hero onNavigate={setCurrentView} />;
      case 'summarizer': return <Summarizer />;
      case 'scheduler': return <Scheduler />;
      case 'chatbot': return <Chatbot />;
      default: return <Hero onNavigate={setCurrentView} />;
    }
  };

  const NavItem = ({ view, icon: Icon, label }: { view: ViewType; icon: any; label: string }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
        currentView === view 
          ? 'bg-blue-100 text-blue-700 font-bold' 
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setCurrentView('home')}
            >
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
                SmartStudy
              </span>
            </div>

            <nav className="hidden md:flex gap-1">
              <NavItem view="home" icon={LayoutGrid} label="Trang Chủ" />
              <NavItem view="summarizer" icon={FileText} label="Tóm Tắt" />
              <NavItem view="scheduler" icon={Calendar} label="Lên Lịch" />
              <NavItem view="chatbot" icon={MessageSquare} label="Chatbot" />
            </nav>

            <div className="md:hidden">
              {/* Mobile menu could go here, simplified for this demo */}
              <button onClick={() => setCurrentView(currentView === 'home' ? 'chatbot' : 'home')} className="text-slate-600">
                 {currentView === 'home' ? 'Start' : 'Back'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 mb-2">
            Bản quyền thuộc về Thái Triêk Việt Hoàng (Pk04665) &copy; 2025.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
            <span>Powered by</span>
            <span className="font-semibold text-slate-600">Google Gemini API</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
