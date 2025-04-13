'use client';

import { useState } from 'react';
import NewChatModal from './NewChatModal';
import Toast from './Toast';
import { FaUpload, FaPlus, FaKey, FaBars } from 'react-icons/fa';

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

    const handleUploadDocument = async () => {
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
                loadingBarContainer.style.backgroundColor = 'var(--secondary)';
                loadingBarContainer.style.padding = '20px';
                loadingBarContainer.style.borderRadius = '8px';
                loadingBarContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
                loadingBarContainer.style.textAlign = 'center';
                loadingBarContainer.style.color = 'var(--secondary-foreground)';
                loadingBarContainer.style.zIndex = '9999';

                const loadingText = document.createElement('div');
                loadingText.innerText = 'Uploading...';
                loadingText.style.marginBottom = '15px';
                loadingText.style.fontWeight = 'bold';
                loadingBarContainer.appendChild(loadingText);

                const loadingBarBackground = document.createElement('div');
                loadingBarBackground.style.width = '100%';
                loadingBarBackground.style.height = '8px';
                loadingBarBackground.style.backgroundColor = 'var(--muted)';
                loadingBarBackground.style.borderRadius = '4px';
                loadingBarContainer.appendChild(loadingBarBackground);

                const loadingBar = document.createElement('div');
                loadingBar.style.width = '0%';
                loadingBar.style.height = '8px';
                loadingBar.style.backgroundColor = 'var(--primary)';
                loadingBar.style.borderRadius = '4px';
                loadingBar.style.transition = 'width 0.3s ease';
                loadingBarBackground.appendChild(loadingBar);

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
                        }, 800);
                    } else {
                        console.error('Failed to upload PDF');
                        loadingText.innerText = 'Upload Failed';
                        loadingText.style.color = 'var(--destructive)';
                        setTimeout(() => {
                            document.body.removeChild(loadingBarContainer);
                        }, 1500);
                    }
                } catch (error) {
                    console.error('Error uploading PDF:', error);
                    loadingText.innerText = 'Upload Failed';
                    loadingText.style.color = 'var(--destructive)';
                    setTimeout(() => {
                        document.body.removeChild(loadingBarContainer);
                    }, 1500);
                }
            }
        };
        input.click();
    };

    return (
        <div className={`side-nav ${isCollapsed ? 'w-16' : 'w-80'}`}>
            <div className="flex items-center justify-center p-4 border-b border-border h-16">
                {isCollapsed ? (
                    <FaBars className="text-2xl" />
                ) : (
                    <h1 className="text-2xl font-bold">Chatbot</h1>
                )}
            </div>

            <div className="flex-grow p-4 overflow-y-auto">
                {!isCollapsed && (
                    <div className="space-y-1">
                        {/* Chat history would go here */}
                    </div>
                )}
            </div>

            <div className={`p-4 border-t border-border ${isCollapsed ? 'flex flex-col items-center space-y-4' : 'space-y-2'}`}>
                <button
                    className={`btn ${isCollapsed ? 'p-3' : 'btn-primary'} w-full flex items-center justify-center`}
                    onClick={handleUploadDocument}
                    title="Upload Document"
                >
                    {isCollapsed ? (
                        <FaUpload />
                    ) : (
                        <>
                            <FaUpload className="mr-2" />
                            Upload Document
                        </>
                    )}
                </button>
                <button
                    className={`btn ${isCollapsed ? 'p-3' : 'btn-primary'} w-full flex items-center justify-center`}
                    onClick={handleNewChat}
                    title="New Chat"
                >
                    {isCollapsed ? (
                        <FaPlus />
                    ) : (
                        <>
                            <FaPlus className="mr-2" />
                            New Chat
                        </>
                    )}
                </button>
                <button
                    className={`btn ${isCollapsed ? 'p-3' : 'btn-primary'} w-full flex items-center justify-center`}
                    onClick={handleShowToast}
                    title="API Key"
                >
                    {isCollapsed ? (
                        <FaKey />
                    ) : (
                        <>
                            <FaKey className="mr-2" />
                            API Key
                        </>
                    )}
                </button>
            </div>

            {showToast && (
                <Toast message="I got you covered :)" type="info" />
            )}

            <NewChatModal
                isOpen={isNewChatModalOpen}
                onCancel={handleCloseNewChatModal}
                onConfirm={handleCreateNewChat}
            />
        </div>
    );
};

export default SideNav;
