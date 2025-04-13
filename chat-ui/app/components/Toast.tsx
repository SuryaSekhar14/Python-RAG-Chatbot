import React, { useState, useEffect } from 'react';
import { FaInfoCircle, FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';

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
  }, [duration]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="text-green-500" />;
      case 'error':
        return <FaTimesCircle className="text-destructive" />;
      case 'warning':
        return <FaExclamationTriangle className="text-amber-500" />;
      default:
        return <FaInfoCircle className="text-primary" />;
    }
  };

  return (
    <div
      className={`fixed bottom-5 right-5 transition-opacity duration-300 z-50 ${show ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="flex items-center gap-3 p-4 rounded-lg shadow-lg bg-secondary border border-border">
        <div className="text-xl">{getIcon()}</div>
        <div>{message}</div>
      </div>
    </div>
  );
};

export default Toast;