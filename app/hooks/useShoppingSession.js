import { useState, useEffect } from 'react';
import { useSocket } from './useSocket';

export function useShoppingSession(sessionId, userId) {
  const [participants, setParticipants] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [sessionInfo, setSessionInfo] = useState(null);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.emit('join-session', { sessionId, userId });

    socket.on('session-joined', (data) => {
      setIsConnected(true);
      setSessionInfo(data.session);
      setParticipants(data.participants);
    });

    socket.on('participant-joined', (data) => {
      setParticipants(prev => [...prev, data.participant]);
    });

    socket.on('participant-left', (data) => {
      setParticipants(prev => prev.filter(p => p.id !== data.participantId));
    });

    socket.on('participant-updated', (data) => {
      setParticipants(prev =>
        prev.map(p =>
          p.id === data.participant.id ? { ...p, ...data.participant } : p
        )
      );
    });

    return () => {
      socket.emit('leave-session', { sessionId, userId });
      socket.off('session-joined');
      socket.off('participant-joined');
      socket.off('participant-left');
      socket.off('participant-updated');
    };
  }, [socket, sessionId, userId]);

  const updateParticipantStatus = (status) => {
    socket?.emit('update-status', { sessionId, userId, ...status });
  };

  return {
    participants,
    isConnected,
    sessionInfo,
    updateParticipantStatus,
  };
}