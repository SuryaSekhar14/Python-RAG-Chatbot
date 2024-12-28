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
        </div>
    );
};

export default ChatArea;
