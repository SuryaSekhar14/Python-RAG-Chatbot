import React from 'react';

interface NewChatModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const NewChatModal: React.FC<NewChatModalProps> = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50" onClick={handleBackgroundClick}>
      <div className="flex flex-col p-6 w-64 rounded-lg shadow-lg bg-[#444444] justify-center items-center">
      <h2 className="text-xl font-semibold mb-4 text-center">Are you sure?</h2>
      <div className="flex justify-center">
        <button onClick={onConfirm} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Yep!</button>
        <button onClick={onCancel} className="bg-red-500 text-white px-4 py-2 rounded">Nope</button>
      </div>
      </div>
    </div>
  );
};

export default NewChatModal;