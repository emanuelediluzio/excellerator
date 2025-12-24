"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, FileSpreadsheet, Sparkles, Zap, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.4] pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100 group-hover:border-emerald-200 transition-colors">
            <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">
            Excellerator
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/login"
            className="hidden md:block text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/login"
            className="group px-6 py-2.5 text-sm font-semibold bg-gray-900 text-white rounded-lg hover:bg-emerald-600 transition-all flex items-center gap-2 shadow-lg shadow-gray-200 hover:shadow-emerald-200"
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
          className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-full border border-emerald-100"
        >
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Powered by Gemini 1.5 Flash</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="max-w-5xl text-6xl font-extrabold tracking-tight leading-[1.1] md:text-8xl text-gray-900"
        >
          <span className="block">From Paper to Excel</span>
          <span className="block text-emerald-600 mt-2 md:mt-4 pb-4">in Seconds.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="max-w-2xl mt-8 text-xl text-gray-500 md:text-2xl leading-relaxed font-light"
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
            className="h-14 px-10 flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold text-lg transition-all shadow-xl shadow-emerald-200 hover:shadow-2xl hover:shadow-emerald-300 hover:-translate-y-0.5"
          >
            Start Converting Free
          </Link>
          <a
            href="#demo"
            className="h-14 px-10 flex items-center justify-center bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 rounded-xl font-semibold text-lg transition-all hover:border-gray-300 shadow-sm"
          >
            Watch Demo
          </a>
        </motion.div>

        {/* Social Proof / Trusted By (Visual Filler) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-20 pt-10 border-t border-gray-100 w-full max-w-2xl"
        >
          <p className="text-sm text-gray-400 uppercase tracking-widest font-semibold mb-6">Trusted for accuracy</p>
          <div className="flex justify-center gap-8 opacity-40 grayscale mix-blend-multiply">
            {/* Placeholders for logos */}
            <div className="h-8 w-24 bg-gray-300 rounded"></div>
            <div className="h-8 w-24 bg-gray-300 rounded"></div>
            <div className="h-8 w-24 bg-gray-300 rounded"></div>
            <div className="h-8 w-24 bg-gray-300 rounded"></div>
          </div>
        </motion.div>
      </main>

      {/* Feature Grid */}
      <section className="relative z-10 py-32 bg-gray-50 border-t border-gray-200">
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
              className="group p-8 rounded-2xl bg-white border border-gray-200 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-100/50 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-emerald-100">
                <feature.icon className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed text-lg">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
