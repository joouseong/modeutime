import React from 'react';
import { Users, CheckCircle2, Clock } from 'lucide-react';

export default function FriendStatus({ responses, currentUserId }) {
  const friends = Object.values(responses).sort((a, b) => {
    if (a.uid === currentUserId) return -1; // 내 이름을 가장 위로
    return 0;
  });

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <Users size={18} className="text-blue-500" />
          참여 현황
        </h3>
        <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full">
          {friends.length}명 참여 중
        </span>
      </div>

      <div className="space-y-4 max-h-[400px] md:max-h-none overflow-y-auto pr-1">
        {friends.length === 0 ? (
          <p className="text-center text-slate-400 text-sm py-10 italic">아직 참여한 친구가 없어요.</p>
        ) : (
          friends.map((friend) => (
            <div 
              key={friend.uid} 
              className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${friend.uid === currentUserId ? 'bg-blue-50 ring-1 ring-blue-100' : 'bg-slate-50'}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${friend.uid === currentUserId ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                {friend.name?.[0] || '?'}
              </div>
              <div className="flex flex-col flex-1">
                <span className={`text-sm font-bold ${friend.uid === currentUserId ? 'text-blue-900' : 'text-slate-700'}`}>
                  {friend.name} {friend.uid === currentUserId && '(나)'}
                </span>
                <span className="text-[10px] text-slate-400">
                  {friend.dates?.length > 0 ? `${friend.dates.length}일 선택 완료` : '날짜 선택 중...'}
                </span>
              </div>
              {friend.dates?.length > 0 ? (
                <CheckCircle2 size={16} className="text-green-500" />
              ) : (
                <Clock size={16} className="text-slate-300 animate-pulse" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}