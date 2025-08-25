// app/not-found.tsx
"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  Home,
  Phone,
  ArrowLeft,
  Search,
  Calendar,
  Stethoscope,
  AlertCircle,
} from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gold-50/20 flex items-center justify-center px-4 py-16">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header Section with Gold Accent */}
          <div className="bg-gradient-to-r from-gold-500 to-gold-600 p-8 text-white text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full mb-4"
            >
              <AlertCircle size={48} className="text-white" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-6xl font-bold mb-2"
            >
              404
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl font-medium text-white/90"
            >
              Pagină Negăsită
            </motion.p>
          </div>

          {/* Content Section */}
          <div className="p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                Ne pare rău!
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Pagina pe care o căutați nu există sau a fost mutată. Vă rugăm
                să verificați adresa URL sau să navigați către una dintre
                paginile noastre principale.
              </p>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
            >
              <Link
                href="/"
                className="group flex items-center gap-3 p-4 bg-gray-50 hover:bg-gold-50 rounded-xl transition-all duration-300 hover:shadow-md"
              >
                <div className="w-10 h-10 bg-gold-100 group-hover:bg-gold-200 rounded-lg flex items-center justify-center transition-colors">
                  <Home size={20} className="text-gold-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-800">Pagina Principală</p>
                  <p className="text-sm text-gray-500">Înapoi acasă</p>
                </div>
              </Link>

              <Link
                href="/servicii"
                className="group flex items-center gap-3 p-4 bg-gray-50 hover:bg-teal-50 rounded-xl transition-all duration-300 hover:shadow-md"
              >
                <div className="w-10 h-10 bg-teal-100 group-hover:bg-teal-200 rounded-lg flex items-center justify-center transition-colors">
                  <Stethoscope size={20} className="text-teal-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-800">Servicii</p>
                  <p className="text-sm text-gray-500">Vezi tratamentele</p>
                </div>
              </Link>

              <Link
                href="/contact"
                className="group flex items-center gap-3 p-4 bg-gray-50 hover:bg-gold-50 rounded-xl transition-all duration-300 hover:shadow-md"
              >
                <div className="w-10 h-10 bg-gold-100 group-hover:bg-gold-200 rounded-lg flex items-center justify-center transition-colors">
                  <Phone size={20} className="text-gold-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-800">Contact</p>
                  <p className="text-sm text-gray-500">Contactează-ne</p>
                </div>
              </Link>

              <Link
                href="/#contact"
                className="group flex items-center gap-3 p-4 bg-gray-50 hover:bg-teal-50 rounded-xl transition-all duration-300 hover:shadow-md"
              >
                <div className="w-10 h-10 bg-teal-100 group-hover:bg-teal-200 rounded-lg flex items-center justify-center transition-colors">
                  <Calendar size={20} className="text-teal-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-800">Programare</p>
                  <p className="text-sm text-gray-500">Fă o programare</p>
                </div>
              </Link>
            </motion.div>

            {/* Primary CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
              >
                <ArrowLeft size={20} />
                <span>Înapoi la Pagina Principală</span>
              </Link>

              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-300"
              >
                <Search size={20} />
                <span>Pagina Anterioară</span>
              </button>
            </motion.div>

            {/* Help Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 pt-6 border-t border-gray-200 text-center"
            >
              <p className="text-sm text-gray-500">
                Aveți nevoie de ajutor? Sunați-ne la{" "}
                <a
                  href="tel:+37361234555"
                  className="text-gold-600 hover:text-gold-700 font-medium transition-colors"
                >
                  +373 61 234 555
                </a>
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Floating Tooth Animation */}
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [-5, 5, -5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-8 -right-8 w-24 h-24 opacity-10"
        >
          <svg
            viewBox="0 0 100 100"
            fill="currentColor"
            className="text-gold-500"
          >
            <path d="M50 10c-8 0-15 5-15 15 0 5 2 10 2 20 0 15-3 25-3 35 0 8 7 15 16 15s16-7 16-15c0-10-3-20-3-35 0-10 2-15 2-20 0-10-7-15-15-15z" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
}
