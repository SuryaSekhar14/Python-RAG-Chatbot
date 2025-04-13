'use client';

import { useState, useRef, useEffect } from "react";
import ChatArea from "./components/ChatArea";
import SideNav from "./components/SideNav";
import MainNav from "./components/MainNav";
import { FaCircleArrowUp } from 'react-icons/fa6';
import { FaStopCircle } from "react-icons/fa";
import { useAuth, useSession } from "@clerk/nextjs";
import Toast from "./components/Toast";

export default function Page() {
  const [message, setMessage] = useState("");
  const [messageHistory, setMessageHistory] = useState<{ message: string; sender: string }[]>([]);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"info" | "success" | "error" | "warning">("info");
  const inputRef = useRef<HTMLInputElement>(null);
  const { isSignedIn } = useAuth();
  const { session } = useSession();
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle sidebar with Cmd/Ctrl+B
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        setIsCollapsed(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  const handleShowToast = (message: string, type: "info" | "success" | "error" | "warning") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleSubmit = async () => {
    setIsInputDisabled(true);
    const newMessage = { message, sender: "user" };
    setMessageHistory((prev) => [...prev, newMessage]);
    setMessage("");
  
    const token = session ? await session.getToken() : null;
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {})
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
    } else if (response.status === 401) {
      console.error("Unauthorized: Authentication failed");
      handleShowToast("Authentication failed. Please sign in.", "error");
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
      <div className="flex flex-col items-center justify-center min-h-screen w-full h-full bg-background">
        <MainNav handleCollapseSidebar={handleCollapseSidebar} />
        <ChatArea messageHistory={messageHistory} />
        
        {/* ChatInput */}
        <div className="w-full px-4 py-4 mt-auto border-t border-border">
          <div className="chat-input">
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
              className="flex-1 p-3 bg-transparent outline-none form-input border-0 focus:ring-0"
              placeholder="Type your message..."
              ref={inputRef}
            />
            <button 
              onClick={isInputDisabled ? handleGenerationPause : (message.trim() !== "" ? handleSubmit : undefined)} 
              className={`p-3 flex items-center justify-center ${isInputDisabled ? 'text-destructive hover:text-red-500' : 'text-primary hover:text-blue-600'}`}
              disabled={message.trim() === "" && !isInputDisabled}
              aria-label={isInputDisabled ? "Stop generation" : "Send message"}
            >
              { isInputDisabled ? <FaStopCircle className="w-5 h-5" /> : <FaCircleArrowUp className="w-5 h-5" /> }
            </button>
          </div>
        </div>
        
        {showToast && <Toast message={toastMessage} type={toastType} />}
      </div>
    </div>
  );
}
