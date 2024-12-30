import { FaUser, FaRobot } from "react-icons/fa";
import ReactMarkdown from "react-markdown";

interface ChatBubbleProps {
    message: string;
    sender: string;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, sender }) => {
    return (
        <div className="flex items-center my-3">
            {sender !== "system" && (
                <div className="mr-4">
                    {sender === "assistant" ? <FaRobot /> : <FaUser />}
                </div>
            )}

            {sender !== "system" ? (
                <div className={`p-2 rounded-md ${sender === "user" ? "bg-[#484848]" : "bg-transparent"}`}>
                    <ReactMarkdown>{message}</ReactMarkdown>
                </div>
            ) : (
                <div className="flex justify-center w-full text-gray-400">
                    {message}
                </div>
            )}

        </div>
    );
};

export default ChatBubble;