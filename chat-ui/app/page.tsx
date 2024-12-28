'use client';

import { useState } from "react";
import ChatArea from "./components/ChatArea";
import SideNav from "./components/SideNav";
import MainNav from "./components/MainNav";
import { FaCircleArrowUp } from 'react-icons/fa6';
import { FaStopCircle } from "react-icons/fa";

export default function Page() {
  const [message, setMessage] = useState("");
  // const [responseMessage, setResponseMessage] = useState("");
  const [messageHistory, setMessageHistory] = useState<{ message: string; sender: string }[]>([]);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const handleSubmit = async () => {
    // localStorage.setItem("timestamp", Date.now().toString());
    setIsInputDisabled(true);
    const newMessage = { message, sender: "user" };
    setMessageHistory((prev) => [...prev, newMessage]);
    setMessage("");
  
    const response = await fetch("http://localhost:8000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: message, history: messageHistory }),
    });
  
    if (response.ok && response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = "";
  
      while (true) {
        if (isPaused) 
          break;
        console.log('Generating response... isPaused:', isPaused);
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value, { stream: true });
        // setResponseMessage(result);
        const responseMessage = { message: result, sender: "assistant" };
        setMessageHistory((prev) => {
          if (prev.length > 0 && prev[prev.length - 1].sender === "assistant") {
            return [...prev.slice(0, -1), responseMessage];
          } else {
            return [...prev, responseMessage];
          }
        });
      }
  
      const finalResponseMessage = { message: result, sender: "assistant" };
      setMessageHistory((prev) => [...prev.slice(0, -1), finalResponseMessage]);
    } else {
      console.error("Failed to send message");
    }
    setIsInputDisabled(false);
  };

  const handleGenerationPause = () => {
    console.log('Generation paused');
    setIsPaused(true);
  };
  
  const handleClearChat = () => {
    console.log('New chat created');
    setMessageHistory([]);
  }

  return (
    <div className="flex flex-row h-screen">

      {/* SideNav */}
      <SideNav handleClearChat={handleClearChat} />

      {/* Main Area */}
      <div className="flex flex-col items-center justify-center min-h-screen p-b-2 w-full h-full bg-[#333333]">
        <MainNav />
        <ChatArea messageHistory={messageHistory} />
        
        {/* ChatInput */}
        <div className="flex w-full px-3 mt-auto py-5">
          <div className="flex flex-1 border-2 border-gray-300 rounded-md overflow-hidden">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && message.trim() !== "") {
                  handleSubmit();
                }
              }}
              disabled={isInputDisabled}
              className="flex-1 p-2 text-black"
            />
            <button 
              onClick={isInputDisabled ? handleGenerationPause : (message.trim() !== "" ? handleSubmit : undefined)} 
              className="p-2 bg-white text-black"
              disabled={message.trim() === "" && !isInputDisabled}
            >
              { isInputDisabled ? <FaStopCircle className="w-6 h-6" /> : <FaCircleArrowUp className="w-6 h-6" /> }
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
