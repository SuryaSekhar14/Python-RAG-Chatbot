import ChatBubble from './ChatBubble';

interface Message {
    message: string;
    sender: string;
}

const ChatArea: React.FC<{ messageHistory: Message[] }> = ({ messageHistory }) => {
    return (
        <div className="flex-grow h-0 overflow-y-auto px-4 overflow-x-hidden w-full">
            {messageHistory.map((msg, index) => (
                <ChatBubble key={index} sender={msg.sender} message={msg.message} />
            ))}
            {messageHistory.length === 0 && (
                <div className="h-full flex items-center justify-center">
                    <div className="text-center text-muted-foreground p-8 max-w-md">
                        <h2 className="text-2xl font-bold mb-2">Welcome to RAG Chatbot</h2>
                        <p className="mb-4">Upload documents and start chatting to get insights from your data.</p>
                        <p className="text-sm">Start by uploading a document using the button in the sidebar.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatArea;
