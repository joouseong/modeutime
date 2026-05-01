// import { useState, useEffect } from 'react';
// import { db } from '../firebase/config';
// import { doc, onSnapshot, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';

// export function useRoom(roomId) {
//   const [roomData, setRoomData] = useState(null);
//   const [responses, setResponses] = useState({});

//   // 방 데이터 실시간 구독
//   useEffect(() => {
//     if (!roomId) return;
//     const unsub = onSnapshot(doc(db, "rooms", roomId), (doc) => {
//       if (doc.exists()) {
//         setRoomData(doc.data());
//         setResponses(doc.data().responses || {});
//       }
//     });
//     return unsub;
//   }, [roomId]);

//   // 일정 저장 로직
//   const saveSchedule = async (userId, userName, password, dates) => {
//     const roomRef = doc(db, "rooms", roomId);
//     await updateDoc(roomRef, {
//       [`responses.${userId}`]: {
//         name: userName,
//         password: password, // 실제로는 암호화가 권장되나 우선 간단히 구현
//         dates: dates,
//         updatedAt: new Date()
//       }
//     });
//   };

//   return { roomData, responses, saveSchedule };
// }