import { FaUser, FaRobot } from "react-icons/fa";
import ReactMarkdown from "react-markdown";

interface ChatBubbleProps {
    message: string;
    sender: string;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, sender }) => {
    return (
        <div className="flex items-center my-3">
            <div className="mr-4">
                {sender === "bot" ? <FaRobot /> : <FaUser />}
            </div>
            <div className={`p-2 rounded-md ${sender === "user" ? "bg-[#484848]" : "bg-transparent"}`}>
                <ReactMarkdown>{message}</ReactMarkdown>
            </div>
        </div>
    );
};

export default ChatBubble;