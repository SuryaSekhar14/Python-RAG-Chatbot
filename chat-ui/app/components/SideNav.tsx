'use client';

import { useState, useEffect } from 'react';
import NewChatModal from './NewChatModal';
import Toast from './Toast';
import ChatHistory from './ChatHistory';
import { FaUpload, FaPlus, FaKey, FaBars, FaTimes, FaCheck } from 'react-icons/fa';

interface SideNavProps {
    handleClearChat: () => void;
    handleSuccessfulFileUpload: (filename: string) => void;
    isCollapsed: boolean;
}

const SideNav: React.FC<SideNavProps> = ({ handleClearChat, handleSuccessfulFileUpload, isCollapsed }) => {
    const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'info' | 'success' | 'error'>('info');
    const [showApiKeyInput, setShowApiKeyInput] = useState(false);
    const [apiKey, setApiKey] = useState('');

    useEffect(() => {
        // Load the API key from local storage on component mount
        const savedApiKey = localStorage.getItem('chatbot_api_key');
        if (savedApiKey) {
            setApiKey(savedApiKey);
        }
    }, []);

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

    const handleShowToast = (message: string, type: 'info' | 'success' | 'error') => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };

    const handleApiKeyButtonClick = () => {
        setShowApiKeyInput(true);
    };

    const handleApiKeyCancel = () => {
        setShowApiKeyInput(false);
        // Reset to the value from localStorage
        const savedApiKey = localStorage.getItem('chatbot_api_key') || '';
        setApiKey(savedApiKey);
    };

    const handleApiKeyConfirm = () => {
        if (apiKey.trim()) {
            localStorage.setItem('chatbot_api_key', apiKey);
            setShowApiKeyInput(false);
            handleShowToast('API Key saved successfully', 'success');
        } else {
            handleShowToast('Please enter a valid API Key', 'error');
        }
    };

    const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setApiKey(e.target.value);
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
        <div className={`side-nav ${isCollapsed ? 'w-0' : 'w-80'}`}>
            <div className="flex items-center justify-center p-4 border-b border-border h-16">
                {isCollapsed ? (
                    <FaBars className="text-2xl" />
                ) : (
                    <h1 className="text-2xl font-bold">Chatbot</h1>
                )}
            </div>

            <div className="flex-grow p-4 overflow-y-auto">
                {isCollapsed ? (
                    <ChatHistory isCollapsed={isCollapsed} />
                ) : (
                    <div className="space-y-1">
                        <ChatHistory isCollapsed={isCollapsed} />
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
                
                {showApiKeyInput && !isCollapsed ? (
                    <div className="flex items-center">
                        <input
                            type="text"
                            value={apiKey}
                            onChange={handleApiKeyChange}
                            placeholder="Enter API Key"
                            className="flex-grow px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary text-sm text-black"
                            autoFocus
                        />
                        <button 
                            onClick={handleApiKeyCancel}
                            className="p-2 text-destructive hover:bg-destructive/10 rounded"
                            title="Cancel"
                        >
                            <FaTimes />
                        </button>
                        <button 
                            onClick={handleApiKeyConfirm}
                            className="p-2 text-success hover:bg-success/10 rounded"
                            title="Confirm"
                        >
                            <FaCheck />
                        </button>
                    </div>
                ) : (
                    <button
                        className={`btn ${isCollapsed ? 'p-3' : 'btn-primary'} w-full flex items-center justify-center`}
                        onClick={handleApiKeyButtonClick}
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
                )}
            </div>

            {showToast && (
                <Toast message={toastMessage} type={toastType} />
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
