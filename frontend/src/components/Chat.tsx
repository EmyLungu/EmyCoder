import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../hooks/useChat';

interface ChatOverlayProps {
    currentCode: string;
    currentOutput: string;
}

const ChatOverlay: React.FC<ChatOverlayProps> = ({ currentCode, currentOutput }) => {
    const [input, setInput] = useState<string>('');
    const { isOpen, setIsOpen, isThinking, messages, sendChatMessages } = useChat();

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const glassStyle = "bg-white/5 backdrop-blur-md border border-white/10";

    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen, isThinking]);

    const handleSendMessage = async (e: React.SubmitEvent) => {
        e.preventDefault();

        sendChatMessages(input, currentCode, currentOutput)
        setInput('');
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed right-12 z-50 p-3 rounded-full transition-all duration-300 shadow-xl flex items-center justify-center group cursor-pointer ${isOpen
                    ? 'bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-400 rotate-90 top-24'
                    : 'bg-btn hover:bg-btn/80 border border-white/10 text-white hover:scale-105 bottom-12'
                    }`}
            >
                {isOpen ? (
                    <svg className="h-4 w-4"><use href={`/icons.svg#close-icon`} /></svg>
                ) : (
                    <svg className="h-6 w-6"><use href={`/icons.svg#chat-icon`} /></svg>
                )}
            </button>

            <div
                className={`fixed top-0 right-0 h-full w-full sm:w-[450px] md:w-[35%] z-40 shadow-2xl transition-transform duration-300 ease-in-out transform flex flex-col pt-24 border-l border-white/10 ${glassStyle} ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Chat Panel Header */}
                <div className="px-6 pb-4 border-b border-white/5 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-btn animate-pulse" />
                            Copilot
                        </h3>
                        <p className="text-[10px] text-tsecondary/50 font-mono uppercase tracking-wider mt-0.5">Coding assistant</p>
                    </div>
                </div>

                {/* Messages Container Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                                }`}
                        >
                            <div
                                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.sender === 'user'
                                    ? 'bg-btn text-white rounded-br-none text-right'
                                    : 'bg-white/5 border border-white/5 text-gray-200 rounded-bl-none text-left'
                                    }`}
                            >
                                <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                            </div>
                            <span className="text-[9px] text-tsecondary/30 font-mono mt-1 px-1">
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    ))}

                    {/* Chatbot Thinking State Loader */}
                    {isThinking && (
                        <div className="flex items-center gap-2 mr-auto bg-white/5 border border-white/5 px-4 py-3 rounded-2xl rounded-bl-none">
                            <div className="w-1.5 h-1.5 bg-tsecondary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <div className="w-1.5 h-1.5 bg-tsecondary/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <div className="w-1.5 h-1.5 bg-tsecondary/40 rounded-full animate-bounce" />
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Control Box */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-black/10">
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about your code or errors..."
                            disabled={isThinking}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder-tsecondary/40 focus:outline-none focus:border-btn/50 disabled:opacity-50 transition-colors"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isThinking}
                            className="absolute right-2 p-2 rounded-lg bg-white/5 border border-white/5 text-tsecondary hover:text-white disabled:opacity-30 disabled:hover:text-tsecondary transition-colors cursor-pointer"
                        >
                            <svg className="h-4 w-4"><use href={`/icons.svg#right-arrow-icon`} /></svg>
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ChatOverlay;
