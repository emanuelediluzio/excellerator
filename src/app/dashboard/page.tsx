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
    ArrowRight,
    Send,
    LogOut,
    Settings,
    User
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
    const { user, logout, loading: authLoading } = useAuth();
    const router = useRouter();

    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [data, setData] = useState<DataRow[]>([]);
    const [columns, setColumns] = useState<string[]>([]);
    const [showChat, setShowChat] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    // Template State
    const [templateHeaders, setTemplateHeaders] = useState<string[]>([]);
    const [templateName, setTemplateName] = useState<string | null>(null);

    // Chat State
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [messageInput, setMessageInput] = useState("");
    const [isChatLoading, setIsChatLoading] = useState(false);

    const chatEndRef = useRef<HTMLDivElement>(null);

    // Auth protection
    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
    }, [user, authLoading, router]);

    // Scroll to bottom of chat
    useEffect(() => {
        if (showChat) {
            chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, showChat]);

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

    const handleTemplateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (evt) => {
                const bstr = evt.target?.result;
                const wb = XLSX.read(bstr, { type: "binary" });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
                if (data && data.length > 0) {
                    const headers = data[0] as string[];
                    setTemplateHeaders(headers);
                    setTemplateName(file.name);
                }
            };
            reader.readAsBinaryString(file);
        }
    };

    const processDocument = async (fileToProcess: File) => {
        setIsProcessing(true);

        try {
            const headerInstruction = templateHeaders.length > 0
                ? `IMPORTANT: You MUST extract data using EXACTLY these column headers: ${JSON.stringify(templateHeaders)}. Do not add or remove columns. Map the document data to these headers best as possible.`
                : "Analyze the document structure and generate appropriate headers.";

            const prompt = `
            You are an expert data entry AI. Your task is to extract data from this document image into a structured JSON format that can be easily converted to an Excel spreadsheet.
            
            RULES:
            1. ${headerInstruction}
            2. If it's a table, return an array of objects.
            3. Handle handwritten text carefully. If illegible, use "[?]" or make a best guess.
            4. OUTPUT MUST BE PURE JSON. No markdown backticks.
            5. The root of the JSON should be an object with a "data" property containing the main array of rows.
               Example: { "data": [ { "Column1": "Value1" }, ... ] }
            `;

            // Use Puter.js directly on client
            const response = await window.puter.ai.chat(prompt, {
                model: "gemini-2.0-flash-exp",
                image: fileToProcess,
                temperature: 0.1
            });

            const text = response.message.content || response.toString();

            // Clean markdown if present
            const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();
            const result = JSON.parse(jsonString);

            if (result.data && Array.isArray(result.data)) {
                setData(result.data);
                if (result.data.length > 0) {
                    setColumns(Object.keys(result.data[0]));
                }
            } else {
                setData([result.data || result]);
                setColumns(Object.keys(result.data || result));
            }
        } catch (error: any) {
            console.error("Error:", error);
            alert(`Processing Failed: ${error.message || "Unknown error"}. Ensure Puter.js has loaded.`);
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
            const prompt = `
            You are an intelligent data assistant helping a user manage an Excel-like dataset.
            
            CURRENT DATA:
            ${JSON.stringify(data)}

            USER REQUEST: "${newMessage.content}"

            INSTRUCTIONS:
            1. Analyze the user's request.
            2. If the user asks to modify the data (e.g., "Change row 1 price to 500", "Fix the typo in Name"), PERFORM THE MODIFICATION.
            3. If the user asks a question, answer it.
            4. RETURN A JSON OBJECT:
                {
                "response": "Your conversational response.",
                "updatedData": [ ... modified dataset ... ] (OR null if no changes)
                }
            5. BE STRICT: "updatedData" must be the COMPLETE dataset.
            `;

            const response = await window.puter.ai.chat(prompt, {
                model: "gemini-2.0-flash-exp",
                temperature: 0.1
            });

            const text = response.message.content || response.toString();
            const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

            let result;
            try {
                result = JSON.parse(jsonString);
            } catch {
                result = { response: text }; // Fallback
            }

            setMessages(prev => [...prev, { role: "assistant", content: result.response }]);

            if (result.updatedData) {
                setData(result.updatedData);
                if (result.updatedData.length > 0) {
                    setColumns(Object.keys(result.updatedData[0]));
                }
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I encountered an error with Puter.js." }]);
        } finally {
            setIsChatLoading(false);
        }
    };

    if (authLoading || !user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background relative font-sans text-foreground">
            <div className="flex h-screen overflow-hidden">
                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden relative">

                    {/* Header */}
                    <header className={cn(
                        "px-8 py-5 flex items-center justify-between transition-all duration-300 z-20",
                        data.length > 0 ? "bg-white/90 backdrop-blur-md border-b border-gray-200" : "absolute w-full"
                    )}>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100">
                                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                            </div>
                            <span className="font-bold text-lg tracking-tight text-gray-900">Excellerator</span>
                        </div>

                        <div className="flex items-center gap-3">
                            {data.length > 0 && (
                                <>
                                    <button
                                        onClick={() => setData([])}
                                        className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Clear
                                    </button>
                                    <button
                                        onClick={handleExport}
                                        className="px-5 py-2 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center gap-2 shadow-sm shadow-emerald-200"
                                    >
                                        <Download className="w-4 h-4" />
                                        Export Excel
                                    </button>
                                </>
                            )}
                            <div className="relative">
                                <button
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-sm font-bold ring-2 ring-white shadow-sm hover:ring-emerald-200 transition-all"
                                >
                                    {user.email?.[0].toUpperCase()}
                                </button>

                                <AnimatePresence>
                                    {showProfileMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 origin-top-right"
                                        >
                                            <div className="px-4 py-3 border-b border-gray-100 mb-1">
                                                <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                                            </div>

                                            <button
                                                onClick={() => logout()}
                                                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Logout
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </header>

                    {/* Body */}
                    <main className="flex-1 overflow-auto relative bg-gray-50/50">
                        {/* Background Grid */}
                        <div className="absolute inset-0 bg-grid-pattern opacity-[0.3] pointer-events-none fixed" />

                        {data.length === 0 ? (
                            /* Upload State */
                            <div className="h-full flex flex-col items-center justify-center p-6 relative z-10">
                                <div className="max-w-xl w-full">
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-center mb-8"
                                    >
                                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Upload a Document</h2>
                                        <p className="text-gray-500">We'll convert it to a spreadsheet instantly.</p>
                                    </motion.div>

                                    <div
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        className={cn(
                                            "relative group cursor-pointer flex flex-col items-center justify-center w-full h-72 rounded-3xl border-2 border-dashed transition-all duration-300 bg-white shadow-sm",
                                            isDragging ? "border-emerald-500 bg-emerald-50/30 scale-[1.01] shadow-lg" : "border-gray-200 hover:border-emerald-400 hover:shadow-md",
                                            isProcessing && "pointer-events-none opacity-80"
                                        )}
                                    >
                                        <input
                                            type="file"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            onChange={handleFileSelect}
                                            accept="image/*,.pdf"
                                            disabled={isProcessing}
                                        />

                                        {isProcessing ? (
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="relative">
                                                    <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-75"></div>
                                                    <div className="relative p-4 bg-white rounded-full shadow-sm border">
                                                        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <p className="font-semibold text-gray-900">Analyzing Document...</p>
                                                    <p className="text-sm text-gray-400 mt-1">This takes about 2-3 seconds</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-5 text-center p-6">
                                                <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-100 transition-all duration-300">
                                                    <Upload className="w-8 h-8 text-emerald-500" />
                                                </div>
                                                <div>
                                                    <p className="text-lg font-medium text-gray-900">Drag & drop or click to upload</p>
                                                    <p className="text-sm text-gray-400 mt-2">Supports PDF, PNG, JPG (Handwritten or Typed)</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Template Upload Input */}
                                    <div className="mt-6 flex items-center justify-center">
                                        <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm flex items-center gap-3">
                                            <div className="bg-emerald-50 p-1.5 rounded-md">
                                                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-xs font-semibold text-gray-700">Use Excel Template</p>
                                                <p className="text-[10px] text-gray-400">
                                                    {templateName ? `Selected: ${templateName}` : "Optional: Enforce headers"}
                                                </p>
                                            </div>
                                            <label className="ml-2 cursor-pointer px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-medium rounded-md transition-colors border border-gray-200">
                                                Browse
                                                <input
                                                    type="file"
                                                    accept=".xlsx,.xls"
                                                    onChange={handleTemplateUpload}
                                                    className="hidden"
                                                />
                                            </label>
                                            {templateName && (
                                                <button
                                                    onClick={() => { setTemplateName(null); setTemplateHeaders([]); }}
                                                    className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded transition-colors"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ) : (
                            /* Data Grid State - Full Width, Minimalist */
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-full flex flex-col bg-white relative z-10"
                            >
                                <div className="overflow-auto flex-1">
                                    <table className="w-full text-sm text-left border-collapse">
                                        <thead className="bg-gray-50/80 sticky top-0 z-10 backdrop-blur-sm shadow-sm ring-1 ring-black/5">
                                            <tr>
                                                <th className="w-12 px-4 py-3 text-center border-b border-r border-gray-100 text-xs font-semibold text-gray-400 bg-gray-50">
                                                    #
                                                </th>
                                                {columns.map((col) => (
                                                    <th key={col} className="px-4 py-3 border-b border-r border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap bg-gray-50">
                                                        {col}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.map((row, idx) => (
                                                <tr key={idx} className="group hover:bg-emerald-50/10">
                                                    <td className="px-4 py-3 text-center border-b border-r border-gray-100 text-xs text-gray-400 bg-gray-50/30 font-mono">
                                                        {idx + 1}
                                                    </td>
                                                    {columns.map((col) => (
                                                        <td key={`${idx}-${col}`} className="border-b border-r border-gray-100 p-0 relative min-w-[150px]">
                                                            <input
                                                                type="text"
                                                                value={String(row[col] ?? "")}
                                                                onChange={(e) => updateCell(idx, col, e.target.value)}
                                                                className="w-full h-full px-4 py-2.5 bg-transparent border-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-white outline-none transition-all truncate text-gray-700 font-mono text-xs md:text-sm"
                                                            />
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {/* Empty state padding at bottom */}
                                    <div className="h-32"></div>
                                </div>
                            </motion.div>
                        )}
                    </main>
                </div>

                {/* Chat Sidebar Overlay */}
                <AnimatePresence>
                    {showChat && (
                        <motion.div
                            initial={{ x: "100%", opacity: 0.5 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: "100%", opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="w-[400px] border-l border-gray-200 bg-white/95 backdrop-blur-xl shadow-2xl absolute right-0 top-0 bottom-0 z-30 flex flex-col"
                        >
                            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white/50">
                                <div>
                                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-emerald-500" />
                                        AI Assistant
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">Ask me to format or fix your data.</p>
                                </div>
                                <button
                                    onClick={() => setShowChat(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-1 p-5 overflow-y-auto space-y-6 bg-gray-50/30">
                                {messages.length === 0 && (
                                    <div className="flex flex-col items-center justify-center h-full text-center p-4">
                                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4 border border-emerald-100">
                                            <Sparkles className="w-6 h-6 text-emerald-500" />
                                        </div>
                                        <h4 className="font-medium text-gray-900 mb-2">How can I help?</h4>
                                        <div className="space-y-2 w-full">
                                            {["Split the 'Name' column", "Format dates as DD/MM/YYYY", "Remove rows with empty Price"].map((suggestion) => (
                                                <button
                                                    key={suggestion}
                                                    onClick={() => setMessageInput(suggestion)}
                                                    className="block w-full text-sm p-3 bg-white border border-gray-200 rounded-xl hover:border-emerald-300 hover:shadow-sm transition-all text-gray-600 hover:text-emerald-700 text-left"
                                                >
                                                    "{suggestion}"
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={cn("flex flex-col max-w-[90%]", msg.role === "user" ? "ml-auto items-end" : "items-start")}>
                                        <div className={cn(
                                            "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                                            msg.role === "user"
                                                ? "bg-emerald-600 text-white rounded-tr-sm"
                                                : "bg-white border border-gray-100 text-gray-800 rounded-tl-sm"
                                        )}>
                                            {msg.content}
                                        </div>
                                        <span className="text-[10px] text-gray-400 mt-1 px-1">
                                            {msg.role === "user" ? "You" : "Gemini"}
                                        </span>
                                    </div>
                                ))}
                                {isChatLoading && (
                                    <div className="flex items-start">
                                        <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                                            <span className="text-sm text-gray-500">Processing changes...</span>
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            <div className="p-4 border-t border-gray-100 bg-white">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Type a message..."
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                        className="w-full pl-4 pr-12 py-3.5 bg-gray-50 border-transparent focus:bg-white border focus:border-emerald-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 text-sm transition-all"
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={!messageInput.trim() || isChatLoading}
                                        className="absolute right-2 top-2 p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600 transition-colors"
                                    >
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div >

            {/* Floating Action Button for Chat */}
            {
                data.length > 0 && !showChat && (
                    <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        onClick={() => setShowChat(true)}
                        className="absolute bottom-8 right-8 w-14 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg shadow-emerald-500/30 flex items-center justify-center transition-all hover:scale-105 z-30 group"
                    >
                        <MessageSquare className="w-6 h-6 group-hover:hidden" />
                        <Sparkles className="w-6 h-6 hidden group-hover:block" />
                    </motion.button>
                )
            }
        </div >
    );
}
