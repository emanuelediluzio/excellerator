"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Upload,
    FileSpreadsheet,
    Loader2,
    CheckCircle2,
    Download,
    MessageSquare,
    X,
    Save,
    Trash2,
    Sparkles,
    ArrowRight
} from "lucide-react";
import * as XLSX from "xlsx";
import { cn } from "@/lib/utils";

interface DataRow {
    [key: string]: string | number | boolean;
}

interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}

export default function Dashboard() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [data, setData] = useState<DataRow[]>([]);
    const [columns, setColumns] = useState<string[]>([]);
    const [showChat, setShowChat] = useState(false);

    // Chat State
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [messageInput, setMessageInput] = useState("");
    const [isChatLoading, setIsChatLoading] = useState(false);

    // Auth protection
    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
    }, [user, authLoading, router]);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = async (selectedFile: File) => {
        setFile(selectedFile);
        processDocument(selectedFile);
    };

    const processDocument = async (fileToProcess: File) => {
        setIsProcessing(true);
        const formData = new FormData();
        formData.append("file", fileToProcess);

        try {
            const response = await fetch("/api/process-document", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Failed to process");

            const result = await response.json();

            if (result.data && Array.isArray(result.data)) {
                setData(result.data);
                if (result.data.length > 0) {
                    setColumns(Object.keys(result.data[0]));
                }
            } else {
                // Handle non-array response (e.g. form data) by wrapping in array
                setData([result.data || result]);
                setColumns(Object.keys(result.data || result));
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to process document. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleExport = () => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, "excellerator-export.xlsx");
    };

    const updateCell = (rowIndex: number, column: string, value: string) => {
        const newData = [...data];
        newData[rowIndex] = { ...newData[rowIndex], [column]: value };
        setData(newData);
    };

    const handleSendMessage = async () => {
        if (!messageInput.trim()) return;

        const newMessage: ChatMessage = { role: "user", content: messageInput };
        setMessages(prev => [...prev, newMessage]);
        setMessageInput("");
        setIsChatLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: newMessage.content,
                    data: data,
                    history: messages.slice(-5) // Send last 5 messages for context
                }),
            });

            const result = await response.json();

            setMessages(prev => [...prev, { role: "assistant", content: result.response }]);

            if (result.updatedData) {
                setData(result.updatedData);
                // Refresh columns if schema changed
                if (result.updatedData.length > 0) {
                    setColumns(Object.keys(result.updatedData[0]));
                }
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I encountered an error processing your request." }]);
        } finally {
            setIsChatLoading(false);
        }
    };

    if (authLoading || !user) {
        return (
            <div className="min-h-screen aurora-bg flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-black/20 relative">
            <div className="flex h-screen overflow-hidden">
                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <header className={`px-6 py-4 flex items-center justify-between border-b ${data.length > 0 ? 'bg-white/80 backdrop-blur-md sticky top-0 z-20' : 'bg-transparent border-transparent absolute w-full z-20'}`}>
                        <div className="flex items-center gap-2">
                            <FileSpreadsheet className="w-6 h-6 text-indigo-600" />
                            <span className="font-bold text-lg text-gray-900">Excellerator Dashboard</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {data.length > 0 && (
                                <>
                                    <button
                                        onClick={() => setData([])}
                                        className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Clear
                                    </button>
                                    <button
                                        onClick={handleExport}
                                        className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                                    >
                                        <Download className="w-4 h-4" />
                                        Export Excel
                                    </button>
                                </>
                            )}
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                                {user.email?.[0].toUpperCase()}
                            </div>
                        </div>
                    </header>

                    {/* Body */}
                    <main className="flex-1 overflow-auto p-6 relative">

                        {data.length === 0 ? (
                            /* Upload State */
                            <div className="h-full flex flex-col items-center justify-center">
                                <div className="max-w-xl w-full">
                                    <div
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        className={cn(
                                            "relative group cursor-pointer flex flex-col items-center justify-center w-full h-80 rounded-3xl border-2 border-dashed transition-all duration-300 bg-white/50 backdrop-blur-sm",
                                            isDragging ? "border-indigo-500 bg-indigo-50/50 scale-[1.02]" : "border-gray-300 hover:border-indigo-400 hover:bg-white/80",
                                            isProcessing && "pointer-events-none opacity-50"
                                        )}
                                    >
                                        <input
                                            type="file"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={handleFileSelect}
                                            accept="image/*,.pdf"
                                            disabled={isProcessing}
                                        />

                                        {isProcessing ? (
                                            <div className="flex flex-col items-center gap-4">
                                                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                                                <div className="text-center">
                                                    <p className="text-lg font-semibold text-gray-900">Processing Document...</p>
                                                    <p className="text-sm text-gray-500">Extracting structured data with Gemini AI</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-4 text-center p-6">
                                                <div className="w-20 h-20 rounded-2xl bg-indigo-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                    <Upload className="w-10 h-10 text-indigo-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xl font-semibold text-gray-900">Drop your document here</p>
                                                    <p className="text-sm text-gray-500 mt-1">Supports JPG, PNG, PDF (Scans & Handwriting)</p>
                                                </div>
                                                <span className="px-4 py-2 bg-white border rounded-full text-xs font-medium text-gray-600 shadow-sm group-hover:shadow-md transition-all">
                                                    or click to browse
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Data State */
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="min-h-full bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col"
                            >
                                <div className="overflow-auto flex-1">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b sticky top-0 z-10">
                                            <tr>
                                                <th className="px-4 py-3 w-12 text-center text-gray-400">#</th>
                                                {columns.map((col) => (
                                                    <th key={col} className="px-4 py-3 font-semibold tracking-wider whitespace-nowrap">
                                                        {col}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {data.map((row, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                                                    <td className="px-4 py-3 text-center text-gray-400 text-xs">{idx + 1}</td>
                                                    {columns.map((col) => (
                                                        <td key={`${idx}-${col}`} className="p-0 relative">
                                                            <input
                                                                type="text"
                                                                value={String(row[col] ?? "")}
                                                                onChange={(e) => updateCell(idx, col, e.target.value)}
                                                                className="w-full h-full px-4 py-3 bg-transparent border-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 outline-none transition-all truncate"
                                                            />
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}
                    </main>
                </div>

                {/* Chat Sidebar Overlay */}
                <AnimatePresence>
                    {showChat && (
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            className="w-96 border-l bg-white shadow-xl absolute right-0 top-0 bottom-0 z-30 flex flex-col"
                        >
                            <div className="p-4 border-b flex items-center justify-between bg-gray-50">
                                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-purple-600" />
                                    AI Assistant
                                </h3>
                                <button onClick={() => setShowChat(false)} className="p-1 hover:bg-gray-200 rounded-lg">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/30">
                                {messages.length === 0 && (
                                    <div className="text-center text-gray-500 text-sm mt-8 px-4">
                                        <p>Ask me to fix data, calculate totals, or format columns.</p>
                                        <p className="mt-2 text-xs opacity-70">Example: "Fix the date format in the 3rd row"</p>
                                    </div>
                                )}
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={cn("flex flex-col max-w-[85%]", msg.role === "user" ? "ml-auto items-end" : "items-start")}>
                                        <div className={cn(
                                            "p-3 rounded-2xl text-sm",
                                            msg.role === "user" ? "bg-indigo-600 text-white rounded-tr-none" : "bg-white border shadow-sm text-gray-800 rounded-tl-none"
                                        )}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                                {isChatLoading && (
                                    <div className="flex items-start">
                                        <div className="bg-white border shadow-sm p-3 rounded-2xl rounded-tl-none">
                                            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 border-t bg-white">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Type a message..."
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                        className="flex-1 px-4 py-2 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={!messageInput.trim() || isChatLoading}
                                        className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                                    >
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>            </div>

            {/* Floating Action Button for Chat */}
            {data.length > 0 && !showChat && (
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    onClick={() => setShowChat(true)}
                    className="absolute bottom-8 right-8 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 z-30"
                >
                    <MessageSquare className="w-6 h-6" />
                </motion.button>
            )}
        </div>
    );
}
