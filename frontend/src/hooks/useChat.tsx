import { useCallback, useState } from 'react';
import { chatService } from '../api/chatService';

interface Message {
    id: string;
    sender: 'user' | 'assistant';
    text: string;
    timestamp: Date;
}

export const useChat = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isThinking, setIsThinking] = useState<boolean>(false);

    const sendChatMessages = useCallback(async (input: string, snippet: string, output: string) => {
        if (!input.trim() || isThinking) return;

        const userMessage: Message = {
            id: crypto.randomUUID(),
            sender: 'user',
            text: input,
            timestamp: new Date()
        };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);

        const assistantResponseId = crypto.randomUUID();

        try {
            setIsThinking(true);

            const textMessages = newMessages.map(message => message.text);
            const result = await chatService.sendChat({ "messages": textMessages, snippet, output });

            if (!result.ok || !result.body) {
                throw new Error('Failed to initialize stream from server');
            }

            setMessages(prev => [
                ...prev,
                {
                    id: assistantResponseId,
                    sender: 'assistant',
                    text: '',
                    timestamp: new Date()
                }
            ]);

            const reader = result.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedText = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });

                accumulatedText += chunk;

                setMessages(prev =>
                    prev.map(msg =>
                        msg.id === assistantResponseId
                            ? { ...msg, text: accumulatedText }
                            : msg
                    )
                );
            }
        } catch (err) {
            alert(err.message || 'Something went wrong');
            setMessages(prev => prev.filter(msg => msg.id !== assistantResponseId));
        } finally {
            setIsThinking(false);
        }
    }, [messages, isThinking]);

    return { isOpen, setIsOpen, messages, setMessages, isThinking, setIsThinking, sendChatMessages };
};
