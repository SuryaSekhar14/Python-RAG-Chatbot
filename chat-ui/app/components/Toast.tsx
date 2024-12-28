import React, { useState, useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'info' | 'success' | 'error' | 'warning';
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'info', duration = 3000 }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const toastClasses = `
    p-4
    rounded-md
    shadow-md
    text-white
    ${
      type === 'success'
        ? 'bg-green-500'
        : type === 'error'
        ? 'bg-red-500'
        : type === 'warning'
        ? 'bg-yellow-500'
        : 'bg-blue-500' 
    }
  `;

  return (
    <div className={`fixed bottom-5 right-5 ${show ? 'opacity-100' : 'opacity-0'}`}>
      <div className={toastClasses}>{message}</div>
    </div>
  );
};

export default Toast;