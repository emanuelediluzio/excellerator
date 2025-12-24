"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { motion } from "framer-motion";
import { Chrome, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const { signInWithGoogle } = useAuth();
    const [error, setError] = useState("");

    const handleLogin = async () => {
        try {
            setError("");
            await signInWithGoogle();
        } catch (err: any) {
            console.error(err);
            if (err.code === 'auth/popup-closed-by-user') {
                setError("Login cancelled.");
            } else if (err.code === 'auth/unauthorized-domain') {
                setError("Domain not authorized in Firebase Console.");
            } else {
                setError("Failed to sign in. Please try again.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.4] pointer-events-none" />
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md p-8 bg-white border border-gray-200 shadow-xl rounded-2xl relative z-10"
            >
                <Link
                    href="/"
                    className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Link>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                    <p className="text-gray-500">Sign in to continue converting documents.</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">
                        {error}
                    </div>
                )}

                <button
                    onClick={handleLogin}
                    className="w-full h-12 flex items-center justify-center gap-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-emerald-600 transition-colors shadow-lg shadow-gray-200"
                >
                    <Chrome className="w-5 h-5" />
                    Continue with Google
                </button>

                <div className="mt-8 text-center text-sm text-gray-500">
                    By clicking continue, you agree to our Terms of Service and Privacy Policy.
                </div>
            </motion.div>
        </div>
    );
}
