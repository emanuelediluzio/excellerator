"use client";

import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Chrome, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const { signInWithGoogle } = useAuth();

    return (
        <div className="min-h-screen aurora-bg flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md p-8 glass-panel rounded-2xl"
            >
                <Link
                    href="/"
                    className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Link>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-gray-400">Sign in to continue converting documents.</p>
                </div>

                <button
                    onClick={() => signInWithGoogle()}
                    className="w-full h-12 flex items-center justify-center gap-3 bg-white text-black font-medium rounded-xl hover:bg-gray-100 transition-colors"
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
