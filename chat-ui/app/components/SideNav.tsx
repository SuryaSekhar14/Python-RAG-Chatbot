'use client';

import { useState, useEffect } from 'react';
import NewChatModal from './NewChatModal';
import Toast from './Toast';
import ChatHistory from './ChatHistory';
import { FaUpload, FaPlus, FaKey, FaBars, FaTimes, FaCheck } from 'react-icons/fa';
import { useAuth } from "@clerk/nextjs";

interface SideNavProps {
	handleClearChat: () => void;
	handleSuccessfulFileUpload: (filename: string) => void;
	isCollapsed: boolean;
}

// Add LoadingOverlay component
const LoadingOverlay = ({ message, progress }: { message: string; progress: number }) => {
	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<div className="bg-secondary p-6 rounded-lg shadow-lg w-[40%] text-center">
				<div className="mb-4 font-bold text-secondary-foreground">{message}</div>
				<div className="w-full h-2 bg-muted rounded-full">
					<div
						className="h-full bg-primary rounded-full transition-all duration-300"
						style={{ width: `${progress}%` }}
					/>
				</div>
			</div>
		</div>
	);
};

const SideNav: React.FC<SideNavProps> = ({ handleClearChat, handleSuccessfulFileUpload, isCollapsed }) => {
	const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
	const [showToast, setShowToast] = useState(false);
	const [toastMessage, setToastMessage] = useState('');
	const [toastType, setToastType] = useState<'info' | 'success' | 'error'>('info');
	const [showApiKeyInput, setShowApiKeyInput] = useState(false);
	const [apiKey, setApiKey] = useState('');
	// Add loading overlay state
	const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);
	const [loadingMessage, setLoadingMessage] = useState('Uploading...');
	const [uploadProgress, setUploadProgress] = useState(0);
	const { getToken } = useAuth();

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

				// Show loading overlay
				setLoadingMessage('Uploading...');
				setUploadProgress(0);
				setShowLoadingOverlay(true);

				// Simulate gradual progress
				const progressInterval = setInterval(() => {
					setUploadProgress(prev => {
						if (prev < 90) {
							return prev + 5;
						}
						return prev;
					});
				}, 300);

				try {
					const token = await getToken();
					const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload-file`, {
						method: 'POST',
						body: formData,
						headers: {
							"Authorization": `Bearer ${token}`
						}
					});

					clearInterval(progressInterval);

					if (response.ok) {
						console.log('PDF uploaded successfully');
						setUploadProgress(100);
						setLoadingMessage('Upload Complete');
						handleSuccessfulFileUpload(file.name);

						setTimeout(() => {
							setShowLoadingOverlay(false);
						}, 800);
					} else if (response.status === 401) {
						console.error('Unauthorized: Authentication failed');
						setLoadingMessage('Authentication Failed');
						setTimeout(() => {
							setShowLoadingOverlay(false);
							handleShowToast("Authentication failed. Please sign in.", "error");
						}, 1000);
					} else {
						console.error('Failed to upload PDF');
						setLoadingMessage('Upload Failed');
						setTimeout(() => {
							setShowLoadingOverlay(false);
							handleShowToast("Failed to upload document.", "error");
						}, 1000);
					}
				} catch (error) {
					clearInterval(progressInterval);
					console.error('Error uploading PDF:', error);
					setLoadingMessage('Upload Failed');
					setTimeout(() => {
						setShowLoadingOverlay(false);
						handleShowToast("Error uploading document.", "error");
					}, 1000);
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

			{showLoadingOverlay && (
				<LoadingOverlay message={loadingMessage} progress={uploadProgress} />
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
