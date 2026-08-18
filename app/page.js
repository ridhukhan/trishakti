'use client'

import { useState, useEffect } from "react"
import Link from "next/link"

export default function Home() {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const adminState = localStorage.getItem("isAdmin")
    if (adminState === "true") {
      setIsAdmin(true)
    }
  }, [])

  return (
    <div className="bg-slate-900 min-h-screen text-white flex flex-col justify-between font-sans pb-20">
      {/* Header Section */}
      <header className="bg-slate-800 border-b border-slate-700 shadow-lg py-6 text-center px-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-2">
          <img 
            src="https://res.cloudinary.com/dfzaefrkt/image/upload/v1787029233/WhatsApp_Image_2026-08-18_at_10.56.30_AM_s2jtbp.jpg"
            alt="Logo"
            className="rounded-full h-16 w-16 object-cover border-2 border-cyan-600 shadow-md"
          />
          <h1 className="font-extrabold text-2xl md:text-4xl text-amber-400 tracking-wide drop-shadow-md">
            রাধা-কৃষ্ণ সেবা সংঘ
          </h1>
        </div>
        <div>
          <h3 className="text-cyan-400 text-sm md:text-base font-semibold">(একটি ধর্মীয় সেবামূলক সংগঠন)</h3>
          <p className="text-slate-400 text-xs md:text-sm mt-1 font-medium tracking-wider">
            প্রতিষ্ঠাকাল - ২১/০৫/২০০৭
          </p>
        </div>
      </header>

      {/* Main Content Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          
          <Link href="/shonchoi" className="group">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 text-center shadow-xl hover:border-emerald-500 hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-2xl font-bold text-emerald-400 mb-2">সঞ্চয় হিসাব</h3>
              <p className="text-slate-400 text-sm">সকল সদস্যের সঞ্চয়, জমা ও উত্তোলনের সম্পূর্ণ হিসাব দেখুন</p>
            </div>
          </Link>

          <Link href="/rin" className="group">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 text-center shadow-xl hover:border-amber-500 hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-500 group-hover:text-white transition-all">
                <span className="text-3xl">📝</span>
              </div>
              <h3 className="text-2xl font-bold text-amber-400 mb-2">ঋণ হিসাব</h3>
              <p className="text-slate-400 text-sm">সদস্যদের দেওয়া ঋণ ও কিস্তির হিসাব পরিচালনা করুন</p>
            </div>
          </Link>

          <Link href="/shonchoi1" className="group">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 text-center shadow-xl hover:border-emerald-500 hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-2xl font-bold text-emerald-400 mb-2">সঞ্চয় হিসাব ১</h3>
              <p className="text-slate-400 text-sm">সকল সদস্যের সঞ্চয়, জমা ও উত্তোলনের সম্পূর্ণ হিসাব দেখুন</p>
            </div>
          </Link>

          <Link href="/rin1" className="group">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 text-center shadow-xl hover:border-amber-500 hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-500 group-hover:text-white transition-all">
                <span className="text-3xl">📝</span>
              </div>
              <h3 className="text-2xl font-bold text-amber-400 mb-2">ঋণ হিসাব ১</h3>
              <p className="text-slate-400 text-sm">সদস্যদের দেওয়া ঋণ ও কিস্তির হিসাব পরিচালনা করুন</p>
            </div>
          </Link>

          <Link href="/shonchoi2" className="group">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 text-center shadow-xl hover:border-emerald-500 hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-2xl font-bold text-emerald-400 mb-2">সঞ্চয় হিসাব ২</h3>
              <p className="text-slate-400 text-sm">সকল সদস্যের সঞ্চয়, জমা ও উত্তোলনের সম্পূর্ণ হিসাব দেখুন</p>
            </div>
          </Link>

          <Link href="/shonchoi3" className="group">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 text-center shadow-xl hover:border-emerald-500 hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-2xl font-bold text-emerald-400 mb-2">সঞ্চয় হিসাব ৩</h3>
              <p className="text-slate-400 text-sm">সকল সদস্যের সঞ্চয়, জমা ও উত্তোলনের সম্পূর্ণ হিসাব দেখুন</p>
            </div>
          </Link>

          {/* এডমিন লগইন থাকলে নোট অপশন দেখা যাবে */}
          {isAdmin && (
            <Link href="/note" className="group col-span-1 md:col-span-2">
              <div className="bg-slate-800 border border-amber-500/50 rounded-2xl p-6 text-center shadow-xl hover:border-amber-400 hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-500 group-hover:text-white transition-all">
                  <span className="text-3xl">📌</span>
                </div>
                <h3 className="text-2xl font-bold text-amber-400 mb-2">NOTE</h3>
                <p className="text-slate-400 text-sm">ব্যক্তিগত নোট তৈরি ও আপডেট করুন</p>
              </div>
            </Link>
          )}

        </div>
      </main>

      {/* Footer Section */}
      <footer className="bg-slate-800/50 border-t border-slate-800 py-4 text-center text-slate-500 text-xs">
        <p>© {new Date().getFullYear()} Trishakti Foundation. All rights reserved.</p>
      </footer>
    </div>
  )
}