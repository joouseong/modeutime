import React from 'react';
import { Calendar, Save, LogOut } from 'lucide-react';

export default function Layout({ children, userName, onSave, selectedCount }) {
  return (
    /* 1. 전체 화면을 Flex 구조로 잡고 최소 높이를 100% 화면 높이로 설정합니다. */
    <div className="min-h-screen bg-[#f8fafc] flex flex-col overflow-x-hidden">
      
      {/* 상단 네비게이션 바: sticky 설정 및 배경 반투명 처리 */}
      <nav className="sticky top-0 z-[100] bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-100">
              <Calendar size={18} />
            </div>
            <span className="font-black text-lg tracking-tight text-slate-800">모두의 시간</span>
          </div>

          <div className="flex items-center gap-3">
            {userName && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-xs font-bold text-slate-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                {userName} 접속 중
              </div>
            )}
            
            <button 
              onClick={onSave}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-200"
            >
              <Save size={16} />
              <span>저장하기 {selectedCount > 0 && `(${selectedCount})`}</span>
            </button>
            
            <button 
              onClick={() => window.location.reload()}
              className="p-2 text-slate-400 hover:text-red-500 transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* 2. 메인 컨텐츠 영역: flex-1을 통해 남는 공간을 차지하여 푸터를 바닥으로 밀어냅니다. */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        {children}
      </main>

      {/* 3. 하단 푸터: mt-auto를 통해 컨텐츠가 적어도 항상 바닥에 위치하게 합니다. */}
      <footer className="w-full bg-white border-t border-slate-200 py-10 mt-auto z-50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-400 font-semibold tracking-wide">
            © 2026 Modeu Time - Smart Scheduler
          </p>
        </div>
      </footer>
    </div>
  );
}