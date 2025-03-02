'use client';

import { useState, useRef, useEffect } from "react";
import ChatArea from "./components/ChatArea";
import SideNav from "./components/SideNav";
import MainNav from "./components/MainNav";
import { FaCircleArrowUp } from 'react-icons/fa6';
import { FaStopCircle } from "react-icons/fa";

export default function Page() {
  const [message, setMessage] = useState("");
  const [messageHistory, setMessageHistory] = useState<{ message: string; sender: string }[]>([]);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedHistory = localStorage.getItem("messageHistory");
    if (storedHistory) {
      setMessageHistory(JSON.parse(storedHistory));
    }
  }, []);

  useEffect(() => {
    if (!isInputDisabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isInputDisabled]);

  useEffect(() => {
    localStorage.setItem("messageHistory", JSON.stringify(messageHistory));
  }, [messageHistory]);

  const handleSubmit = async () => {
    setIsInputDisabled(true);
    const newMessage = { message, sender: "user" };
    setMessageHistory((prev) => [...prev, newMessage]);
    setMessage("");
  
    const response = await fetch("https://permian.surya.dev/api/chat", {
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

  const handleSuccessfulFileUpload = (filename: string) => {
    setMessageHistory((prev) => [...prev, { message: `File uploaded successfully: ${filename}`, sender: "system" }]);
  }

  const handleCollapseSidebar = () => {
    setIsCollapsed((prev) => !prev);
  }

  return (
    <div className="flex flex-row h-screen">

      {/* SideNav */}
      <SideNav handleClearChat={handleClearChat} handleSuccessfulFileUpload={handleSuccessfulFileUpload} isCollapsed={isCollapsed} />

      {/* Main Area */}
      <div className="flex flex-col items-center justify-center min-h-screen p-b-2 w-full h-full bg-[#333333]">
        <MainNav handleCollapseSidebar={handleCollapseSidebar} />
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
              ref={inputRef}
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
