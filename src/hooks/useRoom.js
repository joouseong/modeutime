import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';

export function useRoom(roomId) {
  const [roomData, setRoomData] = useState(null);
  const [responses, setResponses] = useState({});

  useEffect(() => {
    if (!roomId) return;
    const roomRef = doc(db, "rooms", roomId);
    const unsub = onSnapshot(roomRef, async (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setRoomData(data);
        setResponses(data.responses || {});
      } else {
        const initialTitle = window.sessionStorage.getItem('pendingRoomName') || "새로운 약속";
        const adminId = window.sessionStorage.getItem('adminId'); // 방 생성 시 저장한 ID
        await setDoc(roomRef, {
          title: initialTitle,
          adminId: adminId, // 방장 고유 ID 저장
          status: 'collecting', // 초기 상태: 모집 중
          createdAt: new Date(),
          responses: {}
        });
      }
    });
    return () => unsub();
  }, [roomId]);

  const updateRoomTitle = (newTitle) => updateDoc(doc(db, "rooms", roomId), { title: newTitle });
  
  // 투표 시작 (모집 종료)
  const startVoting = async (topDates) => {
    await updateDoc(doc(db, "rooms", roomId), {
      status: 'voting',
      candidateDates: topDates,
      votes: {}
    });
  };

  // 투표하기
  const castVote = async (userId, dateStr) => {
    await updateDoc(doc(db, "rooms", roomId), { [`votes.${userId}`]: dateStr });
  };

  // 최종 확정
  const finalizeEvent = async (finalDate) => {
    await updateDoc(doc(db, "rooms", roomId), {
      status: 'finalized',
      confirmedDate: finalDate
    });
  };

  const saveSchedule = async (userId, userName, password, dates) => {
    if (roomData?.status !== 'collecting') return alert("이미 모집이 종료되었습니다.");
    await updateDoc(doc(db, "rooms", roomId), {
      [`responses.${userId}`]: { name: userName, password, dates, updatedAt: new Date() }
    });
    alert("일정이 저장되었습니다!");
  };

  return { roomData, responses, saveSchedule, updateRoomTitle, startVoting, castVote, finalizeEvent };
}