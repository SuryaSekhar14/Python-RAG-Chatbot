import { FaUser, FaRobot } from "react-icons/fa";
import ReactMarkdown from "react-markdown";

interface ChatBubbleProps {
    message: string;
    sender: string;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, sender }) => {
    return (
        <div className={`flex my-4 ${sender === "user" ? "justify-end" : "justify-start"}`}>
            {sender === "system" ? (
                <div className="flex justify-center w-full text-muted-foreground text-sm py-2 italic">
                    {message}
                </div>
            ) : (
                <div className={`flex ${sender === "user" ? "flex-row-reverse" : "flex-row"} max-w-3xl`}>
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${sender === "user" ? "ml-3" : "mr-3"} ${sender === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"} shadow-sm`}>
                        {sender === "assistant" ? <FaRobot className="text-lg" /> : <FaUser className="text-lg" />}
                    </div>
                    <div className={`${sender === "user" ? "chat-bubble-user" : "chat-bubble-assistant"} shadow-sm`}>
                        <ReactMarkdown className="prose dark:prose-invert max-w-none">{message}</ReactMarkdown>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBubble;