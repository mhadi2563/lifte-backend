import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import LiftE from "./Lift-E.png";
import "./App.css";

function App() {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatWindowRef = useRef(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [chatHistory]);

  async function sendMessage() {
    if (!userInput.trim()) return;

    const updatedChat = [...chatHistory, { sender: "User", message: userInput }];
    setChatHistory(updatedChat);
    setUserInput("");
    setIsTyping(true);

    try {
      const API_BASE_URL = "https://lifte-backend.onrender.com";
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });

      const data = await response.json();
      setChatHistory([
        ...updatedChat,
        { sender: "Bot", message: data.response, image: LiftE },
      ]);
    } catch (error) {
      setChatHistory([
        ...updatedChat,
        { sender: "Bot", message: "⚠️ Error: Could not reach server.", image: LiftE },
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <div className="chat-container">
      <h1 className="chat-title" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
  <img src={LiftE} alt="Lift-E" className="title-icon" style={{ width: '100px', height: '100px', borderRadius: '20%' }} />
  Lift-E</h1>
      <div className="chat-window" ref={chatWindowRef}>
        {chatHistory.map((chat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`chat-bubble ${chat.sender === "User" ? "user-bubble" : "bot-bubble"}`}
          >
            {chat.sender === "Bot" && <img src={chat.image} alt="Lift-E" className="bot-icon" />}
            <p>{chat.message}</p>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, duration: 0.5 }}
            className="typing-indicator"
          >
            Bot is typing...
          </motion.div>
        )}
      </div>

      <div className="input-area">
        <input
          type="text"
          placeholder="Ask me anything about fitness..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          className="chat-input"
        />
        <button onClick={sendMessage} className="send-button">Send</button>
      </div>
    </div>
  );
}

export default App;
