import React, { useEffect, useRef, useState } from "react";
import { BsFillChatFill, BsPaperclip } from "react-icons/bs";
import ModalWindow from "./ModalWindow";
import { styles } from "./styles";

function ChatWidget() {
    const [hovered, setHovered] = useState(false);
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [files, setFiles] = useState(null);

    const widgetRef = useRef(null);
    const inputRef = useRef(null);
    const chatEndRef = useRef(null);

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
        localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    }, [chatHistory]);

    const handleSendMessage = async () => {
        if (!message.trim() && !files) return;

        const isFileUpload = Boolean(files);

        if (isFileUpload) {
            const newChatHistory = [
                ...chatHistory,
                { sender: "user", text: `Subiendo archivo(s): ${Array.from(files).map(file => file.name).join(", ")}` },
                { sender: "bot", text: "Subiendo archivo(s), por favor espera..." }
            ];
            setChatHistory(newChatHistory);
            await handleFileUpload();
        } else {
            const newChatHistory = [
                ...chatHistory,
                { sender: "user", text: message },
                { sender: "bot", text: "Espera un momento..." }
            ];
            setChatHistory(newChatHistory);
            await handleTextMessage();
        }

        // Limpia el campo de entrada y los archivos
        setMessage("");
        setFiles(null);

        // Asegúrate de que el campo de entrada se limpie después de la renderización
        if (inputRef.current) {
            inputRef.current.value = ""; // Limpia el valor del campo de entrada
        }
    };


    const handleTextMessage = async () => {
        try {
            const response = await fetch("http://localhost:8000/ask-question/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: message }),
            });

            const data = await response.json();

            setChatHistory((prevChatHistory) =>
                prevChatHistory.map((chat, index) =>
                    index === prevChatHistory.length - 1 ? { sender: "bot", text: data.response } : chat
                )
            );
        } catch (error) {
            console.error("Error sending message:", error);
            setChatHistory((prevChatHistory) =>
                prevChatHistory.map((chat, index) =>
                    index === prevChatHistory.length - 1 ? { sender: "bot", text: "Error al obtener la respuesta." } : chat
                )
            );
        }

        // Limpia el campo de entrada y los archivos
        setMessage("");
        setFiles(null);

        // Asegúrate de que el campo de entrada se limpie después de la renderización
        if (inputRef.current) {
            inputRef.current.value = ""; // Limpia el valor del campo de entrada
        }
    };

    const handleFileUpload = async () => {
        if (!files) return;

        const formData = new FormData();
        Array.from(files).forEach(file => {
            formData.append("files", file);
        });

        try {
            const response = await fetch("http://localhost:8000/upload-docs/", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            setChatHistory((prevChatHistory) =>
                prevChatHistory.map((chat, index) =>
                    index === prevChatHistory.length - 1 ? { sender: "bot", text: data.message } : chat
                )
            );
        } catch (error) {
            console.error("Error uploading files:", error);
            setChatHistory((prevChatHistory) =>
                prevChatHistory.map((chat, index) =>
                    index === prevChatHistory.length - 1 ? { sender: "bot", text: "Error al subir los archivos." } : chat
                )
            );
        }
    };

    const handleFileChange = (event) => {
        setFiles(event.target.files);
        setMessage(`Subiendo: ${Array.from(event.target.files).map(file => file.name).join(", ")}`);
    };

    return (
        <div ref={widgetRef}>
            <ModalWindow visible={visible}>
                <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                    <div style={{ flex: 1, overflowY: "auto", padding: "10px 0", marginBottom: "10px" }}>
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
                                        borderRadius: chat.sender === "user" ? "15px 15px 0 15px" : "15px 15px 15px 0",
                                        padding: "10px",
                                        maxWidth: "70%",
                                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                        wordBreak: "break-word",
                                    }}
                                >
                                    {chat.text}
                                </div>
                            </div>
                        ))}
                        <div ref={chatEndRef}></div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center" }}>
                        <input
                            type="text"
                            value={message}
                            ref={inputRef}
                            onChange={(e) => setMessage(e.target.value)}
                            style={{
                                flex: 1,
                                padding: "12px 15px",
                                borderRadius: "20px",
                                border: "1px solid #ddd",
                                outline: "none",
                                marginRight: "10px",
                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                            }}
                            placeholder="Escribe un mensaje..."
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault(); // Previene el comportamiento por defecto del enter en campos de texto
                                    handleSendMessage();
                                }
                            }}
                        />

                        <input
                            type="file"
                            id="file-upload"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                        />
                        <label htmlFor="file-upload">
                            <BsPaperclip
                                size={20}
                                style={{
                                    cursor: "pointer",
                                    marginRight: "10px",
                                    color: "#007bff",
                                }}
                            />
                        </label>
                        <button
                            onClick={handleSendMessage}
                            style={{
                                padding: "10px",
                                borderRadius: "50%",
                                backgroundColor: "#007bff",
                                color: "white",
                                border: "none",
                                cursor: "pointer",
                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                style={{ width: "20px", height: "20px" }}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 12h13m0 0l-7-7m7 7l-7 7"
                                />
                            </svg>
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
                </div>
            </div>
        </div>
    );
}

export default ChatWidget;
