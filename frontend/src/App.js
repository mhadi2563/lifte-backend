import React, { useState } from 'react';
import liftE from './Lift-E.png'; // Adjust the path to your PNG file

function App() {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: "Bot", message: "Hello! How can I assist with your fitness needs today?" }
  ]);

  const handleSendMessage = async () => {
    const updatedChat = [...chatHistory, { sender: "User", message: userInput }];
    setChatHistory(updatedChat);

    try {
      const response = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Append chatbot response to chat history
      setChatHistory([...updatedChat, { sender: "Bot", message: data.response }]);
    } catch (error) {
      console.error("Error communicating with backend:", error);
      setChatHistory([...updatedChat, { sender: "Bot", message: "⚠️ Error: Could not reach server." }]);
    }

    // Clear user input
    setUserInput("");
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto", fontFamily: "Arial" }}>
      <h2>Lift-E</h2>
      <div>
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: chat.sender === "User" ? "flex-end" : "flex-start",
              alignItems: "center",
              margin: "10px 0",
              position: "relative"
            }}
          >
            {chat.sender === "Bot" && (
              <img
                src={liftE}
                alt="Lift-E"
                style={{ position: "absolute", top: "5px", left: "-80px", width: "70px", height: "70px" }}
              />
            )}
            <div
              style={{
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                backgroundColor: chat.sender === "User" ? "#e0f7fa" : "#fff",
                maxWidth: "70%"
              }}
            >
              <p>{chat.message}</p>
            </div>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{ width: "100%", padding: "10px", marginTop: "10px" }}
      />
      <button onClick={handleSendMessage} style={{ padding: "10px", marginTop: "10px" }}>
        Send
      </button>
    </div>
  );
}

export default App;
