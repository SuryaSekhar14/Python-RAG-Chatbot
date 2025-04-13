import React, { useEffect } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';

interface NewChatModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const NewChatModal: React.FC<NewChatModalProps> = ({ isOpen, onConfirm, onCancel }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onCancel]);

  if (!isOpen) return null;

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50 animate-fade-in"
      onClick={handleBackgroundClick}
    >
      <div className="flex flex-col p-6 w-80 rounded-lg shadow-lg bg-background border border-border animate-slide-in">
        <h2 className="text-xl font-semibold mb-6 text-center">Start a new chat?</h2>
        <p className="text-muted-foreground mb-6 text-center text-sm">
          This will clear your current conversation history.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onCancel}
            className="btn px-4 py-2 rounded-md border border-border hover:bg-secondary flex items-center"
          >
            <FaTimes className="mr-2" />
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="btn btn-primary px-4 py-2 rounded-md flex items-center"
          >
            <FaCheck className="mr-2" />
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewChatModal;