"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, FileSpreadsheet, Sparkles, Zap, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="min-h-screen aurora-bg text-white relative overflow-hidden font-sans selection:bg-indigo-500/30">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="p-2 bg-white/5 rounded-xl backdrop-blur-md border border-white/10 group-hover:border-white/20 transition-colors">
            <FileSpreadsheet className="w-6 h-6 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            Excellerator
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/login"
            className="hidden md:block text-sm font-medium text-white/70 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/login"
            className="group px-6 py-2.5 text-sm font-semibold bg-white text-black rounded-full hover:bg-white/90 transition-all flex items-center gap-2 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_-5px_rgba(255,255,255,0.4)]"
          >
            Get Started
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-24 pb-32 text-center md:pt-40 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-sm font-medium text-indigo-200 bg-indigo-900/30 rounded-full border border-indigo-500/30 backdrop-blur-md"
        >
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Powered by Gemini 1.5 Flash</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="max-w-5xl text-6xl font-extrabold tracking-tight leading-[1.1] md:text-8xl"
        >
          <span className="block text-white drop-shadow-2xl">From Paper to Excel</span>
          <span className="block aurora-gradient-text mt-2 md:mt-4 pb-4">in Seconds.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="max-w-2xl mt-8 text-xl text-gray-300 md:text-2xl leading-relaxed font-light"
        >
          Stop manual data entry. Upload any document and let AI convert it into a perfectly formatted, editable spreadsheet instantly.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-5 mt-12 w-full justify-center"
        >
          <Link
            href="/login"
            className="h-14 px-10 flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-semibold text-lg transition-all shadow-[0_0_40px_-5px_rgba(99,102,241,0.4)] hover:shadow-[0_0_60px_-10px_rgba(99,102,241,0.5)] hover:-translate-y-0.5 active:translate-y-0"
          >
            Start Converting Free
          </Link>
          <a
            href="#demo"
            className="h-14 px-10 flex items-center justify-center bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-semibold text-lg backdrop-blur-md transition-all hover:border-white/20"
          >
            Watch Demo
          </a>
        </motion.div>

        {/* Social Proof / Trusted By (Visual Filler) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-20 pt-10 border-t border-white/5 w-full max-w-2xl"
        >
          <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold mb-6">Trusted for accuracy</p>
          <div className="flex justify-center gap-8 opacity-40 grayscale mix-blend-screen">
            {/* Placeholders for logos */}
            <div className="h-8 w-24 bg-white/20 rounded"></div>
            <div className="h-8 w-24 bg-white/20 rounded"></div>
            <div className="h-8 w-24 bg-white/20 rounded"></div>
            <div className="h-8 w-24 bg-white/20 rounded"></div>
          </div>
        </motion.div>
      </main>

      {/* Feature Grid */}
      <section className="relative z-10 py-32 bg-black/20 backdrop-blur-sm border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Zap,
              title: "Lightning Fast",
              desc: "Powered by Gemini Flash 2.5. Process complex documents in under 2 seconds with 99% accuracy."
            },
            {
              icon: FileSpreadsheet,
              title: "Native Excel Export",
              desc: "Don't settle for CSV. Download fully formatted .xlsx files with correct columns and data types."
            },
            {
              icon: Sparkles,
              title: "AI Corrections",
              desc: "Chat with the AI to fix specific rows, split columns, or format dates exactly how you need."
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/[0.07] transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/5">
                <feature.icon className="w-7 h-7 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed text-lg">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
