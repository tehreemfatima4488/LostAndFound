import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeNotification } from '../store/slices/notificationSlice';

const NotificationToast = () => {
  const dispatch = useDispatch();
  const messages = useSelector(state => state.notifications?.messages || []);

  useEffect(() => {
    const timers = messages.map(msg =>
      setTimeout(() => {
        dispatch(removeNotification(msg.id));
      }, 5000)
    );

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [messages, dispatch]);

  if (messages.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      {messages.map(msg => (
        <div
          key={msg.id}
          className={`px-4 py-3 rounded-lg shadow-lg text-white font-medium animate-slide-in ${
            msg.type === 'success'
              ? 'bg-green-500'
              : msg.type === 'error'
              ? 'bg-red-500'
              : msg.type === 'warning'
              ? 'bg-yellow-500'
              : 'bg-blue-500'
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <span>{msg.message}</span>
            <button
              onClick={() => dispatch(removeNotification(msg.id))}
              className="hover:opacity-80"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;
