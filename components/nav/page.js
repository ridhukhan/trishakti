'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const adminState = localStorage.getItem("isAdmin")
    if (adminState === "true") {
      setIsAdmin(true)
    }
  }, [])

  const handleAdminLogin = () => {
    if (isAdmin) {
      localStorage.removeItem("isAdmin")
      setIsAdmin(false)
      alert("লগআউট করা হয়েছে")
    } else {
      const pin = prompt("এডমিন পিন নম্বর দিন:")
      if (pin === "Samir82@") {
        localStorage.setItem("isAdmin", "true")
        setIsAdmin(true)
        alert("এডমিন লগইন সফল হয়েছে!")
      } else if (pin !== null) {
        alert("ভুল পিন!")
      }
    }
  }

  return (
    <nav className="fixed bottom-0 left-0 w-full z-[1000] bg-slate-900 border-t border-slate-700 p-2 shadow-lg flex items-center justify-between">
      <ul className="flex overflow-x-auto items-center whitespace-nowrap gap-2 scrollbar-none py-1">
        
        <Link href="/" className="shrink-0">
          <img 
            src="https://res.cloudinary.com/dfzaefrkt/image/upload/v1787029233/WhatsApp_Image_2026-08-18_at_10.56.30_AM_s2jtbp.jpg"
            alt="Logo"
            className={`rounded-full h-10 w-10 object-cover border-2 border-cyan-600 ${
              pathname === "/" ? "border-red-500" : "border-cyan-600"
            }`}
          />
        </Link>

        <Link href="/shonchoi">
          <li className={`px-3 py-2 font-bold text-sm border-b-2 rounded-t-md transition-colors ${
            pathname === "/shonchoi" ? "text-red-500 border-red-500" : "text-white border-transparent"
          }`}>
            সঞ্চয়
          </li>
        </Link>

        <Link href="/rin">
          <li className={`px-3 py-2 font-bold text-sm border-b-2 rounded-t-md transition-colors ${
            pathname === "/rin" ? "text-red-500 border-red-500" : "text-white border-transparent"
          }`}>
            ঋণ
          </li>
        </Link>

        <Link href="/shonchoi1">
          <li className={`px-3 py-2 font-bold text-sm border-b-2 rounded-t-md transition-colors ${
            pathname === "/shonchoi1" ? "text-red-500 border-red-500" : "text-white border-transparent"
          }`}>
            সঞ্চয় ১
          </li>
        </Link>

        <Link href="/rin1">
          <li className={`px-3 py-2 font-bold text-sm border-b-2 rounded-t-md transition-colors ${
            pathname === "/rin1" ? "text-red-500 border-red-500" : "text-white border-transparent"
          }`}>
          ঋণ ১
          </li>
        </Link>

        <Link href="/shonchoi2">
          <li className={`px-3 py-2 font-bold text-sm border-b-2 rounded-t-md transition-colors ${
            pathname === "/shonchoi2" ? "text-red-500 border-red-500" : "text-white border-transparent"
          }`}>
            সঞ্চয় ২
          </li>
        </Link>

        <Link href="/shonchoi3">
          <li className={`px-3 py-2 font-bold text-sm border-b-2 rounded-t-md transition-colors ${
            pathname === "/shonchoi3" ? "text-red-500 border-red-500" : "text-white border-transparent"
          }`}>
          সঞ্চয় ৩
          </li>
        </Link>

      </ul>

      {/* Admin Toggle Button in Navbar */}
      <button
        onClick={handleAdminLogin}
        className={`ml-2 shrink-0 text-xs font-bold px-3 py-2 rounded-lg transition ${
          isAdmin ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"
        }`}
      >
        {isAdmin ? "🚶‍♂️" : "👨‍💼"}
      </button>
    </nav>
  )
}