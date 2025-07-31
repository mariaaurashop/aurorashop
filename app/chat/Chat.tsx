"use client"
import React, { useRef, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
    id: number;
    sender: "user" | "bot";
    content: string;
}

const initialMessages: Message[] = [
    {
        id: 1,
        sender: "bot",
        content: "¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?",
    },
];

const Chats: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMessage: Message = {
            id: Date.now(),
            sender: "user",
            content: input,
        };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        // Simulate bot response (replace with real API call)
        setTimeout(() => {
            const botMessage: Message = {
                id: Date.now() + 1,
                sender: "bot",
                content: `Has dicho: "${userMessage.content}"`,
            };
            setMessages((prev) => [...prev, botMessage]);
            setLoading(false);
        }, 1200);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !loading) {
            handleSend();
        }
    };

    return (
        <Card className="max-w-xl mx-auto mt-10 flex flex-col h-[80vh] shadow-lg">
            <CardHeader className="border-b bg-muted font-semibold text-lg">
                ChatBot
            </CardHeader>
            <CardContent className="flex-1 p-0 bg-gray-50">
                <ScrollArea className="h-full max-h-[60vh] px-4 py-6">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} mb-4`}
                        >
                            <div
                                className={`max-w-[70%] px-4 py-3 rounded-2xl text-base whitespace-pre-wrap shadow-sm
                                    ${msg.sender === "user"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground"
                                    }`}
                            >
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex items-center mb-4">
                            <div className="bg-muted rounded-2xl px-4 py-3 text-base italic text-muted-foreground">
                                Escribiendo...
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </ScrollArea>
            </CardContent>
            <CardFooter className="border-t bg-muted flex gap-2">
                <Input
                    type="text"
                    placeholder="Escribe tu mensaje..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleInputKeyDown}
                    disabled={loading}
                    className="flex-1"
                />
                <Button
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    className="font-semibold"
                >
                    Enviar
                </Button>
            </CardFooter>
        </Card>
    );
};

export default Chats;
