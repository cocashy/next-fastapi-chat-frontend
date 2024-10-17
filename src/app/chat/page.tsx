"use client";

import { useState, useEffect, useRef } from 'react';

type Message = {
    sessionID: string;
    name: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
};

const Chat = () => {
    const [name, setName] = useState('名無し');
    const [inputMessage, setInputMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const socket = useRef<WebSocket | null>(null);

    useEffect(() => {
        socket.current = new WebSocket('wss://next-fastapi-chat-backend.onrender.com/chat');

        socket.current.onmessage = (event) => {
            const json = JSON.parse(event.data);
            const message: Message = {
                sessionID: json["session_id"],
                name: json["name"],
                content: json["content"],
                createdAt: new Date(json["created_at"]),
                updatedAt: new Date(json["updated_at"]),
            };
            setMessages((prev) => [...prev, message]);
        }

        return () => {
            socket.current?.close();
        };
    }, []);

    const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (socket.current && inputMessage.trim()) {
            socket.current.send(JSON.stringify({
                name: name,
                content: inputMessage,
            }));
            setInputMessage('');  // メッセージ送信後に入力フィールドをクリア
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6 mb-4 h-3/5 flex flex-col">
                <h2 className="text-2xl font-bold text-center mb-4">チャット</h2>
                <div className="flex-1 overflow-y-auto border border-gray-300 rounded p-4 bg-gray-50 flex-col-reverse">
                  {messages.slice().reverse().map((message, index) => (
                    <div key={messages.length-index} className="p-2 border-b border-gray-200 break-words">
                      {message.name}: {message.content} --- <span className="text-sm">{message.createdAt.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
            </div>
            <form onSubmit={sendMessage} className="w-full max-w-lg flex space-x-2">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="名前を入力"
                    className="p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300 w-1/4"
                />
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="メッセージを入力"
                    className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
                />
                <button
                    type="submit"
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
                >
                    送信
                </button>
            </form>
        </div>
    );
};

export default Chat;
