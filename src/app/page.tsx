"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, FileSpreadsheet, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="min-h-screen aurora-bg text-white relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md border border-white/20">
            <FileSpreadsheet className="w-6 h-6 text-purple-400" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            Excellerator
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="px-5 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/login"
            className="group px-5 py-2 text-sm font-medium bg-white text-black rounded-lg hover:bg-white/90 transition-all flex items-center gap-2"
          >
            Get Started
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-20 pb-32 text-center md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-xs font-medium text-purple-300 bg-purple-500/10 rounded-full border border-purple-500/20 backdrop-blur-md"
        >
          <Sparkles className="w-3 h-3" />
          <span>Powered by Gemini 1.5 Flash</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="max-w-4xl text-5xl font-extrabold tracking-tight md:text-7xl lg:text-8xl"
        >
          <span className="block text-white">Paper to Excel,</span>
          <span className="block aurora-gradient-text mt-2">Instantly.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl mt-6 text-lg text-gray-400 md:text-xl"
        >
          Stop typing data manually. Upload a photo of any document, and our AI will convert it into a perfectly formatted Excel spreadsheet in seconds.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col gap-4 mt-10 sm:flex-row"
        >
          <Link
            href="/login"
            className="h-12 px-8 flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] hover:shadow-[0_0_60px_-15px_rgba(99,102,241,0.6)]"
          >
            Start Converting Free
          </Link>
          <a
            href="#demo"
            className="h-12 px-8 flex items-center justify-center bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-semibold backdrop-blur-md transition-all"
          >
            Watch Demo
          </a>
        </motion.div>
      </main>

      {/* Feature Grid */}
      <section className="relative z-10 px-6 py-20 bg-black/20 backdrop-blur-sm border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Zap,
              title: "Lightning Fast",
              desc: "Powered by Gemini Flash 2.5, process documents in under 2 seconds."
            },
            {
              icon: FileSpreadsheet,
              title: "Native Excel Export",
              desc: "Download clean, formatted .xlsx files ready for your workflow."
            },
            {
              icon: Sparkles,
              title: "AI Corrections",
              desc: "Chat with the AI to fix specific rows or format data exactly how you need."
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
            >
              <feature.icon className="w-10 h-10 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
