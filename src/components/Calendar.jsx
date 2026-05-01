import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Calendar({ selectedDates, onToggleDate, allResponses = {} }) {
  // 1. 현재 표시할 연도와 월 상태 추가
  const [viewDate, setViewDate] = useState(new Date(2026, 4)); // 2026년 5월 (월은 0부터 시작)

  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();

  // 해당 월의 마지막 날짜와 시작 요일 계산
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const startDay = new Date(viewYear, viewMonth, 1).getDay();

  // 'YYYY-MM-DD' 형식의 키 생성을 위한 유틸리티
  const formatDate = (day) => {
    return `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const totalUsers = Object.keys(allResponses).length || 1;

  // 히트맵 계산: 특정 날짜(YYYY-MM-DD)에 몇 명이 가능한지 반환
  const getDayCount = (dateStr) => {
    return Object.values(allResponses).filter(resp => resp.dates?.includes(dateStr)).length;
  };

  const getDayStyle = (dateStr) => {
    const count = getDayCount(dateStr);
    if (selectedDates.includes(dateStr)) return 'bg-blue-600 text-white shadow-md scale-105 z-10';
    
    if (count === 0) return 'bg-white text-slate-700 hover:bg-slate-100';
    if (count === totalUsers && totalUsers > 1) return 'bg-green-500 text-white font-bold';
    if (count >= totalUsers * 0.6) return 'bg-green-200 text-green-800';
    return 'bg-green-50 text-green-700';
  };

  // 달 이동 함수
  const changeMonth = (offset) => {
    setViewDate(new Date(viewYear, viewMonth + offset, 1));
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-5 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold">{viewYear}년 {viewMonth + 1}월</h3>
        <div className="flex gap-2">
          <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-slate-100 rounded-full transition">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => changeMonth(1)} className="p-2 hover:bg-slate-100 rounded-full transition">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4 text-center text-xs font-bold text-slate-400">
        {['일', '월', '화', '수', '목', '금', '토'].map(d => <div key={d}>{d}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-2 md:gap-3">
        {/* 시작 요일에 따른 빈 칸 생성 */}
        {[...Array(startDay)].map((_, i) => <div key={`empty-${i}`} className="aspect-square"></div>)}
        
        {[...Array(daysInMonth)].map((_, i) => {
          const day = i + 1;
          const dateStr = formatDate(day);
          const count = getDayCount(dateStr);
          return (
            <button
              key={dateStr}
              onClick={() => onToggleDate(dateStr)}
              className={`aspect-square flex flex-col items-center justify-center rounded-xl md:rounded-2xl text-sm transition-all duration-200 ${getDayStyle(dateStr)}`}
            >
              <span className="font-semibold">{day}</span>
              {count > 0 && !selectedDates.includes(dateStr) && (
                <span className="text-[10px] mt-0.5 opacity-80">{count}명</span>
              )}
            </button>
          );
        })}
      </div>
      {/* 범례 생략 (기존과 동일) */}
    </div>
  );
}