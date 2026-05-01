import { useState, useEffect } from 'react';
import Calendar from './components/Calendar';
import FriendStatus from './components/FriendStatus';
import Layout from './components/Layout';
import { useRoom } from './hooks/useRoom';
import { Edit2, Check, Trophy, Lock } from 'lucide-react';

// --- 1. 로그인 컴포넌트 ---
function LoginComponent({ onLogin, roomTitle }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const password = e.target.password.value;
    if (!name || password.length !== 4) {
      alert("닉네임과 비밀번호 4자리를 입력해주세요.");
      return;
    }
    onLogin({ id: `${name}_${password}`, name, password });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 max-w-sm w-full text-center">
        <h2 className="text-2xl font-black mb-2" style={{ color: '#000000' }}>
          "{roomTitle || '약속 방'}"
        </h2>
        <p className="text-sm text-slate-400 mb-8 font-medium">입장 정보를 입력하세요.</p>
        <div className="space-y-4 text-left">
          <input name="name" type="text" placeholder="닉네임" className="w-full p-4 bg-slate-50 rounded-2xl outline-none text-slate-800 font-bold border-2 border-transparent focus:border-blue-500 transition" required />
          <input name="password" type="password" maxLength={4} placeholder="비밀번호 4자리" className="w-full p-4 bg-slate-50 rounded-2xl text-center tracking-[1em] outline-none text-slate-800 font-bold border-2 border-transparent focus:border-blue-500 transition" required />
          <button type="submit" className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl shadow-lg hover:bg-black transition">입장하기</button>
        </div>
      </form>
    </div>
  );
}

// --- 2. 메인 App 컴포넌트 ---
function App() {
  const pathParts = window.location.pathname.split('/');
  const roomIdFromUrl = pathParts[1] === 'room' ? pathParts[2] : null;

  const [roomId, setRoomId] = useState(roomIdFromUrl);
  const [user, setUser] = useState(null);
  const [selectedDates, setSelectedDates] = useState([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitleValue, setEditTitleValue] = useState('');

  const { roomData, responses, saveSchedule, updateRoomTitle, startVoting, castVote, finalizeEvent } = useRoom(roomId);

  const isRoomAdmin = user && roomData?.adminId === user.id;

  const handleLogin = (userData) => {
    setUser(userData);
    if (responses[userData.id]) {
      setSelectedDates(responses[userData.id].dates || []);
    }
  };

  const createRoom = () => {
    if (!newRoomName.trim()) {
      alert("약속 이름을 입력해주세요!");
      return;
    }
    const tempName = prompt("방장으로 사용할 닉네임을 입력하세요");
    const tempPw = prompt("방장 비밀번호 4자리를 입력하세요");
    
    if (!tempName || tempPw?.length !== 4) return;

    const adminId = `${tempName}_${tempPw}`;
    const newRoomId = Math.random().toString(36).substring(2, 9);
    
    window.sessionStorage.setItem('adminId', adminId);
    window.sessionStorage.setItem('pendingRoomName', newRoomName);
    
    window.history.pushState({}, '', `/room/${newRoomId}`);
    setRoomId(newRoomId);
    setUser({ id: adminId, name: tempName, password: tempPw });
  };

  const getTopDates = () => {
    const counts = {};
    Object.values(responses).forEach(r => {
      r.dates.forEach(d => counts[d] = (counts[d] || 0) + 1);
    });
    const values = Object.values(counts);
    if (values.length === 0) return [];
    const max = Math.max(...values);
    return Object.keys(counts).filter(d => counts[d] === max);
  };

  if (!roomId) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl text-center max-w-sm w-full">
          <div className="text-5xl mb-6">📅</div>
          <h1 className="text-3xl font-black mb-3" style={{ color: '#1a1a1a' }}>모두의 시간</h1>
          <p className="text-slate-500 mb-8 text-sm font-medium leading-relaxed">약속 이름을 정하고<br/>방을 만들어보세요.</p>
          <input 
            type="text"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            placeholder="예: 우리 과 동기 모임"
            className="w-full p-4 mb-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-blue-500 outline-none text-slate-800 font-bold transition"
          />
          <button onClick={createRoom} className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-700 transition shadow-xl shadow-blue-100">
            새로운 약속 방 만들기
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginComponent onLogin={handleLogin} roomTitle={roomData?.title} />;
  }

  return (
    <Layout 
      userName={user.name + (isRoomAdmin ? " (방장)" : "")} 
      onSave={() => saveSchedule(user.id, user.name, user.password, selectedDates)}
      selectedCount={selectedDates.length}
    >
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          {isEditingTitle ? (
            <div className="flex items-center gap-2 bg-white p-1 rounded-xl border-2 border-blue-500 shadow-sm">
              <input 
                value={editTitleValue} 
                onChange={(e) => setEditTitleValue(e.target.value)}
                className="px-4 py-1 text-2xl font-black outline-none text-slate-900"
                autoFocus
              />
              <button onClick={() => { updateRoomTitle(editTitleValue); setIsEditingTitle(false); }} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"><Check size={20}/></button>
            </div>
          ) : (
            <div className="flex items-center gap-4 group cursor-pointer" onClick={() => isRoomAdmin && (setEditTitleValue(roomData?.title), setIsEditingTitle(true))}>
              <h2 className="text-4xl font-black tracking-tight" style={{ color: '#000000' }}>{roomData?.title}</h2>
              {isRoomAdmin && <Edit2 size={20} className="text-slate-300 group-hover:text-blue-500 transition" />}
            </div>
          )}
        </div>

        {roomData?.status === 'voting' && (
          <div className="bg-orange-50 border-2 border-orange-100 p-5 rounded-[2rem] flex items-center gap-4 text-orange-800 animate-pulse">
            <Lock size={24} className="flex-shrink-0" /> 
            <span className="font-bold">일정 모집이 종료되었습니다. 아래에서 최종 투표를 진행해 주세요!</span>
          </div>
        )}
        {roomData?.status === 'finalized' && (
          <div className="bg-green-600 text-white p-8 rounded-[2.5rem] shadow-2xl shadow-green-100 flex flex-col items-center gap-3">
            <Trophy size={48} />
            <h2 className="text-3xl font-black">우리들의 약속 확정!</h2>
            <p className="text-2xl font-bold bg-white/20 px-6 py-2 rounded-full">{roomData.confirmedDate}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        <div className="lg:col-span-2 space-y-8">
          <div className={`transition-all duration-500 ${roomData?.status !== 'collecting' ? "pointer-events-none opacity-40 grayscale" : ""}`}>
            <Calendar 
              selectedDates={selectedDates} 
              onToggleDate={(dateStr) => setSelectedDates(prev => prev.includes(dateStr) ? prev.filter(d => d !== dateStr) : [...prev, dateStr])}
              allResponses={responses}
            />
          </div>

          {roomData?.status === 'voting' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                🗳️ 후보 날짜 투표
              </h3>
              <div className="grid gap-4">
                {roomData.candidateDates?.map(date => {
                  const voteCount = Object.values(roomData.votes || {}).filter(v => v === date).length;
                  const hasVoted = roomData.votes?.[user.id] === date;
                  return (
                    <div key={date} className={`p-6 rounded-3xl border-2 transition-all flex justify-between items-center bg-white ${hasVoted ? 'border-blue-500 shadow-lg' : 'border-slate-100 hover:border-slate-200'}`}>
                      <span className="text-xl font-bold text-slate-800">{date}</span>
                      <div className="flex items-center gap-4">
                        <span className="font-black text-blue-600 text-lg">{voteCount}표</span>
                        <button onClick={() => castVote(user.id, date)} className={`px-6 py-2.5 rounded-xl font-bold transition ${hasVoted ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                          {hasVoted ? '투표함' : '투표하기'}
                        </button>
                        {isRoomAdmin && <button onClick={() => finalizeEvent(date)} className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-green-700 transition">확정</button>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6 lg:sticky lg:top-24">
          <FriendStatus responses={responses} currentUserId={user.id} />

          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
            <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-widest">링크 공유하기</h3>
            <div className="flex gap-2 mb-4">
              <input readOnly value={window.location.href} className="flex-1 bg-slate-50 p-4 rounded-xl text-[10px] text-slate-500 outline-none border-2 border-slate-100" />
              <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert("복사되었습니다!"); }} className="bg-slate-900 text-white px-6 py-2 rounded-xl text-xs font-bold hover:bg-black transition">복사</button>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">💡 카톡방에 링크를 공유하여 친구들을 초대하세요!</p>
          </div>

          {isRoomAdmin && roomData?.status === 'collecting' && (
            <button 
              onClick={() => {
                const topDates = getTopDates();
                if (topDates.length === 0) return alert("선택된 날짜가 없습니다.");
                startVoting(topDates);
              }}
              className="w-full bg-blue-600 text-white font-black py-6 rounded-[2rem] shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all transform hover:-translate-y-1"
            >
              일정 모집 종료 및 투표 시작
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default App;