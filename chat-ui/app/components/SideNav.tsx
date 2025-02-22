'use client';

import { useState } from 'react';
import NewChatModal from './NewChatModal';
import Toast from './Toast';


interface SideNavProps {
    handleClearChat: () => void;
    handleSuccessfulFileUpload: (filename: string) => void;
    isCollapsed: boolean;
}

const SideNav: React.FC<SideNavProps> = ({ handleClearChat, handleSuccessfulFileUpload, isCollapsed }) => {
    const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const handleNewChat = () => {
        setIsNewChatModalOpen(true);
    };

    const handleCloseNewChatModal = () => {
        setIsNewChatModalOpen(false);
    };

    const handleCreateNewChat = () => {
        console.log('New chat created');
        handleClearChat();
        setIsNewChatModalOpen(false);
    };

    const handleShowToast = () => {
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 3000);
      };

    return (
        <div
            className={`flex flex-col h-full bg-[#1a1a1a] p-4 transition-all duration-300 ${
                isCollapsed ? 'w-8' : 'w-96'
            }`}
        >
            <div className="flex items-center justify-center">
                <h1 className="text-2xl text-white">
                    {isCollapsed ? '' : 'Chatbot'}
                </h1>
            </div>

            {!isCollapsed && (
                <>
                    <div className="border-b border-gray-600 mt-4"></div>

                    <div className="flex-grow"></div>
                    <div className="flex flex-col space-y-2">
                        <button
                            className="text-white py-2 px-4 rounded-md bg-[#3a3a3a] hover:bg-[#4a4a4a]"
                            onClick={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = 'application/pdf';
                                input.onchange = async (event) => {
                                    const file = (event.target as HTMLInputElement).files?.[0];
                                    if (file) {
                                        const formData = new FormData();
                                        formData.append('file', file);

                                        const loadingBarContainer = document.createElement('div');
                                        loadingBarContainer.style.position = 'fixed';
                                        loadingBarContainer.style.top = '50%';
                                        loadingBarContainer.style.left = '50%';
                                        loadingBarContainer.style.transform = 'translate(-50%, -50%)';
                                        loadingBarContainer.style.width = '40%';
                                        loadingBarContainer.style.backgroundColor = '#1a1a1a';
                                        loadingBarContainer.style.padding = '10px';
                                        loadingBarContainer.style.borderRadius = '5px';
                                        loadingBarContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
                                        loadingBarContainer.style.textAlign = 'center';
                                        loadingBarContainer.style.color = 'white';

                                        const loadingText = document.createElement('div');
                                        loadingText.innerText = 'Uploading...';
                                        loadingText.style.marginBottom = '10px';
                                        loadingBarContainer.appendChild(loadingText);

                                        const loadingBar = document.createElement('div');
                                        loadingBar.style.width = '0%';
                                        loadingBar.style.height = '5px';
                                        loadingBar.style.backgroundColor = '#4a4a4a';
                                        loadingBarContainer.appendChild(loadingBar);
                                        document.body.appendChild(loadingBarContainer);

                                        const updateProgress = () => {
                                            let progress = 0;
                                            const interval = setInterval(() => {
                                                if (progress < 90) {
                                                    progress += Math.random() * 10;
                                                    loadingBar.style.width = `${Math.min(progress, 90)}%`;
                                                } else {
                                                    clearInterval(interval);
                                                }
                                            }, 500);
                                        };

                                        updateProgress();

                                        try {
                                            const response = await fetch('https://permian.surya.dev/upload-file', {
                                                method: 'POST',
                                                body: formData,
                                            });

                                            if (response.ok) {
                                                console.log('PDF uploaded successfully');
                                                handleSuccessfulFileUpload(file.name);
                                                loadingBar.style.width = '100%';
                                                loadingText.innerText = 'Upload Complete';
                                                setTimeout(() => {
                                                    document.body.removeChild(loadingBarContainer);
                                                }, 500);
                                            } else {
                                                console.error('Failed to upload PDF');
                                                alert('Failed to upload PDF');
                                                document.body.removeChild(loadingBarContainer);
                                            }
                                        } catch (error) {
                                            console.error('Error uploading PDF:', error);
                                            document.body.removeChild(loadingBarContainer);
                                        }
                                    }
                                };
                                input.click();
                            }}
                        >
                            Upload Document
                        </button>
                        <button
                            className="text-white py-2 px-4 rounded-md bg-[#3a3a3a] hover:bg-[#4a4a4a]"
                            onClick={handleNewChat}
                        >
                            New Chat
                        </button>
                        <button
                            className="text-white py-2 px-4 rounded-md bg-[#3a3a3a] hover:bg-[#4a4a4a]"
                            onClick={handleShowToast}
                        >
                            API Key
                        </button>
                        {showToast && (
                            <Toast message="I got you covered :)" type="info" />
                        )}
                    </div>

                    <NewChatModal
                        isOpen={isNewChatModalOpen}
                        onCancel={handleCloseNewChatModal}
                        onConfirm={handleCreateNewChat}
                    />
                </>
            )}
        </div>
    );
};

export default SideNav;
