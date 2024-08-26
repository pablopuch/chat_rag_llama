import { styles } from "./styles";
import { BsFillChatFill } from "react-icons/bs";
import ModalWindow from "./ModalWindow";
import { useEffect, useRef, useState } from "react";

function ChatWidget() {
    const [hovered, setHovered] = useState(false);
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState([]);

    const widgetRef = useRef(null);
    const inputRef = useRef(null);
    const chatEndRef = useRef(null);

    // Load chat history from localStorage on component mount
    useEffect(() => {
        const storedHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
        setChatHistory(storedHistory);
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (widgetRef.current && !widgetRef.current.contains(event.target)) {
                setVisible(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [widgetRef]);

    useEffect(() => {
        if (visible && inputRef.current) {
            inputRef.current.focus();
        }
    }, [visible]);

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }

        // Save chat history to localStorage
        localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    }, [chatHistory]);

    const handleSendMessage = async () => {
        if (message.trim() === "") return;

        const newChatHistory = [...chatHistory, { sender: "user", text: message }, { sender: "bot", text: "Espera un momento..." }];
        setChatHistory(newChatHistory);

        // Clear the input field immediately
        setMessage("");

        try {
            const response = await fetch("http://localhost:8000/ask-question/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: message }),
            });

            const data = await response.json();

            // Replace the "waiting" message with the actual response
            setChatHistory((prevChatHistory) =>
                prevChatHistory.map((chat, index) =>
                    index === prevChatHistory.length - 1 ? { sender: "bot", text: data.response } : chat
                )
            );
        } catch (error) {
            console.error("Error sending message:", error);
            alert("Failed to send message.");
            setChatHistory((prevChatHistory) =>
                prevChatHistory.map((chat, index) =>
                    index === prevChatHistory.length - 1 ? { sender: "bot", text: "Error al obtener la respuesta." } : chat
                )
            );
        }
    };

    return (
        <div ref={widgetRef}>
            <ModalWindow visible={visible}>
                <div style={{ padding: "10px", backgroundColor: "#f4f4f4", height: "100%", display: "flex", flexDirection: "column" }}>
                    <div style={{ flex: 1, overflowY: "auto", paddingBottom: "10px" }}>
                        {chatHistory.map((chat, index) => (
                            <div
                                key={index}
                                style={{
                                    display: "flex",
                                    justifyContent: chat.sender === "user" ? "flex-end" : "flex-start",
                                    marginBottom: "10px",
                                }}
                            >
                                <div
                                    style={{
                                        backgroundColor: chat.sender === "user" ? "#007bff" : "#e9ecef",
                                        color: chat.sender === "user" ? "white" : "black",
                                        borderRadius: "15px",
                                        padding: "10px",
                                        maxWidth: "70%",
                                    }}
                                >
                                    {chat.text}
                                </div>
                            </div>
                        ))}
                        <div ref={chatEndRef}></div>
                    </div>
                    <div style={{ display: "flex", marginTop: "10px" }}>
                        <input
                            type="text"
                            value={message}
                            ref={inputRef}
                            onChange={(e) => setMessage(e.target.value)}
                            style={{
                                width: "80%",
                                padding: "8px",
                                borderRadius: "5px",
                                border: "1px solid #ccc",
                                marginRight: "5px",
                            }}
                            placeholder="Type a message..."
                        />
                        <button
                            onClick={handleSendMessage}
                            style={{
                                width: "20%",
                                padding: "8px",
                                borderRadius: "5px",
                                backgroundColor: "#007bff",
                                color: "white",
                                border: "none",
                                cursor: "pointer",
                            }}
                        >
                            Send
                        </button>
                    </div>
                </div>
            </ModalWindow>
            <div
                onClick={() => setVisible(!visible)}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{
                    ...styles.chatWidget,
                    border: hovered ? "1px solid black" : "",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <BsFillChatFill size={20} color="white" />
                    <span style={styles.chatWidgetText}>Chat Now!!</span>
                </div>
            </div>
        </div>
    );
}

export default ChatWidget;
