// frontend/src/pages/About.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowRight, Linkedin, Globe } from "lucide-react";
import { motion } from "framer-motion";

const techStack = [
  "Python",
  "FastAPI",
  "React + Vite",
  "Tailwind CSS",
  "PostgreSQL",
  "TensorFlow",
  "OpenCV",
  "WebSockets",
];

const achievements = [
  {
    title: "Machine Learning Developer",
    subtitle: "akshAI Technologies, Hyderabad (On-site)",
    period: "2024",
    detail:
      "Built, trained, and deployed ML models for real-world use cases and production pipelines.",
  },
  {
    title: "MEDINSIGHT AI",
    subtitle: "95% accuracy on Brain MRI tumors",
    period: "2023",
    detail:
      "End-to-end medical imaging tool covering preprocessing, model training, and clean UI for clinicians.",
  },
  {
    title: "Real-time Computer Vision",
    subtitle: "5+ production-ready models",
    period: "2022 – 2024",
    detail:
      "Developed real-time tracking, detection, and classification systems using TensorFlow and OpenCV.",
  },
  {
    title: "Data Analytics & Dashboards",
    subtitle: "10,000+ retail records",
    period: "2022",
    detail:
      "Combined Python and Power BI to build interactive business dashboards and insights.",
  },
  {
    title: "Self-taught Engineering",
    subtitle: "100+ Python projects",
    period: "Ongoing",
    detail:
      "Deep Learning, DSA, OS, Networks – learned by building and shipping projects, not just courses.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-gray-100 font-['Inter',system-ui,sans-serif] antialiased">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-700 to-indigo-800 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-black text-xl">A</span>
            </div>
            <span className="text-xl font-black text-gray-900 tracking-tight">
              AI Market Pro
            </span>
          </Link>
          <Link
            to="/"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-24 relative overflow-hidden">
        {/* background accents */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -right-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute bottom-0 -left-24 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <motion.div
            className="mb-10 flex justify-center"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="relative">
              <div className="w-48 h-48 mx-auto rounded-full bg-gradient-to-br from-blue-600 to-indigo-800 shadow-2xl flex items-center justify-center text-white text-7xl font-black border-8 border-white">
                VK
              </div>
              <div className="absolute -bottom-3 -right-3 px-4 py-1 rounded-full text-xs font-semibold bg-emerald-500 text-white shadow-lg">
                Building AI Finance
              </div>
            </div>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-tight"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Vishal Kadam
          </motion.h1>

          <motion.p
            className="mt-4 text-2xl font-medium text-blue-700"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Creator • AI Engineer • Full‑Stack Developer
          </motion.p>

          <motion.p
            className="mt-8 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            I built{" "}
            <span className="font-bold text-gray-900">AI-FinanceMI</span> — a
            real‑time, institutional‑grade trading intelligence platform —
            completely from scratch, without templates, to prove what one
            focused engineer can ship.
          </motion.p>

          <motion.div
            className="mt-12 flex flex-col sm:flex-row gap-6 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <a
              href="mailto:vishalkadamofficiall@gmail.com"
              className="group inline-flex items-center gap-3 px-10 py-5 bg-gray-900 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105"
            >
              Get In Touch
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </a>
            <a
              href="https://vishalkadam2003.github.io/Vishal-portfolio/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-5 border-2 border-gray-300 text-gray-800 font-bold text-lg rounded-2xl hover:border-gray-400 hover:bg-gray-50 transition-all"
            >
              <Globe className="w-5 h-5" /> View Portfolio
            </a>
          </motion.div>
        </div>
      </section>

      {/* Tagline / One Truth */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.h2
            className="text-4xl md:text-5xl font-black text-gray-900"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            Powering the Future of Intelligent Finance.
          </motion.h2>
          <motion.p
            className="mt-8 text-lg md:text-xl text-gray-600 leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            From live price streaming and AI signal generation to candlestick
            charts and sentiment analysis — every pixel and line of code in
            this platform was handcrafted, with an obsession for performance
            and clarity.
          </motion.p>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <motion.h3
            className="text-4xl font-black text-center text-gray-900 mb-12"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            Built With
          </motion.h3>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            {techStack.map((tech, index) => (
              <motion.div
                key={tech}
                className="bg-white rounded-2xl px-6 py-8 md:px-8 md:py-10 text-center shadow-sm border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-300"
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
              >
                <p className="text-lg md:text-xl font-bold text-gray-900">
                  {tech}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Achievements Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.h3
            className="text-4xl font-black text-center text-gray-900 mb-12"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            What I&apos;ve Done
          </motion.h3>

          <div className="relative">
            <div className="absolute left-4 sm:left-1/2 sm:-translate-x-px top-0 bottom-0 w-px bg-gradient-to-b from-blue-500 via-indigo-400 to-transparent" />

            <div className="space-y-10">
              {achievements.map((item, index) => (
                <motion.div
                  key={item.title}
                  className={`relative flex flex-col sm:flex-row gap-4 ${
                    index % 2 === 0
                      ? "sm:justify-start"
                      : "sm:justify-end sm:text-right"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                >
                  {/* Dot */}
                  <div
                    className={`absolute top-1.5 left-4 sm:left-1/2 sm:-translate-x-1/2 h-3 w-3 rounded-full border-2 border-white shadow-md ${
                      index === 0
                        ? "bg-emerald-500"
                        : "bg-blue-600/80"
                    }`}
                  />
                  {/* Card */}
                  <div
                    className={`sm:w-1/2 ${
                      index % 2 === 0 ? "sm:pl-10" : "sm:pr-10"
                    }`}
                  >
                    <div className="bg-gray-50 rounded-2xl border border-gray-200 px-5 py-4 shadow-sm hover:shadow-md transition">
                      <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">
                        {item.period}
                      </p>
                      <h4 className="text-lg font-bold text-gray-900">
                        {item.title}
                      </h4>
                      <p className="text-sm font-medium text-gray-700 mt-1">
                        {item.subtitle}
                      </p>
                      <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final Call */}
      <section className="py-28 bg-gradient-to-t from-gray-100 to-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            Let&apos;s Build Something Great
          </motion.h2>
          <motion.p
            className="mt-6 text-xl text-gray-600"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Open to full‑time roles, collaborations, or just a meaningful
            conversation about AI and markets.
          </motion.p>

          <motion.div
            className="mt-10"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <a
              href="mailto:vishalkadamofficiall@gmail.com"
              className="group inline-flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-blue-700 to-indigo-800 text-white font-black text-2xl rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110"
            >
              Say Hello
              <Mail className="w-8 h-8 group-hover:scale-110 transition" />
            </a>
          </motion.div>

          <motion.div
            className="mt-14 flex flex-wrap items-center justify-center gap-6 text-gray-600 text-sm md:text-base"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <a
              href="https://linkedin.com/in/vishal-kadam-"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-blue-700 transition"
            >
              <Linkedin className="w-5 h-5" /> LinkedIn
            </a>
            <span>•</span>
            <span className="font-medium text-gray-900">
              +91 80071 56407
            </span>
            <span>•</span>
            <span>vishalkadamofficiall@gmail.com</span>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-10 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-600">
          © 2025 AI-FinanceMI • Handcrafted with passion in India by Vishal
          Kadam
        </div>
      </footer>
    </div>
  );
}
