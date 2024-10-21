"use client";

import { useState, useEffect, useRef } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { CreateMessageReq, Message, messageFromRes, MessageRes } from '@/features/message/type';

export const Chat = () => {
    const [name, setName] = useState('名無し');
    const [inputMessage, setInputMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const socket = useRef<ReconnectingWebSocket | null>(null);

    const fetchMessages = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages`);
        const data = await res.json();
        const messages_ = data.map((message: MessageRes) => {
            const res = MessageRes.parse(message);
            return messageFromRes(res);
        });
        setMessages(messages_);
    };

    useEffect(() => {
        fetchMessages();

        socket.current = new ReconnectingWebSocket(`${process.env.NEXT_PUBLIC_API_WS_URL}/messages/broadcast`);

        socket.current.onmessage = (event) => {
            const json = JSON.parse(event.data);
            const res = MessageRes.parse(json);
            const message = messageFromRes(res);
            setMessages((prev) => [...prev, message]);
        }

        return () => {
            socket.current?.close();
        };
    }, []);

    const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (socket.current && inputMessage.trim()) {
            const req = CreateMessageReq.parse({
                name: name,
                content: inputMessage,
            });
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(req),
            });
            socket.current.send(JSON.stringify(req));
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
