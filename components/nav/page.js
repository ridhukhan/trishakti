'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 w-full z-[1000] bg-slate-900 border-t border-slate-700 p-2 shadow-lg">
      <ul className="flex overflow-x-auto items-center whitespace-nowrap gap-2">
        
        <Link href="/">
           
            <img src="https://res.cloudinary.com/dfzaefrkt/image/upload/v1787029233/WhatsApp_Image_2026-08-18_at_10.56.30_AM_s2jtbp.jpg"
        className={`rounded-full h-10
        
         border-b-2 ${pathname === "/" ? " border-red-500" : "text-white border-transparent"}
        w-18  left-0 border-2 border-b-cyan-600 border-solid`}
        />
          
        </Link>

        <Link href="/shonchoi">
          <li className={`px-4 py-2 font-bold text-sm border-b-2 ${pathname === "/shonchoi" ? "text-red-500 border-red-500" : "text-white border-transparent"}`}>
            সঞ্চয়
          </li>
        </Link>

        <Link href="/shonchoi1">
          <li className={`px-4 py-2 font-bold text-sm border-b-2 ${pathname === "/shonchoi1" ? "text-red-500 border-red-500" : "text-white border-transparent"}`}>
            সঞ্চয় ১
          </li>
        </Link>

        <Link href="/shonchoi2">
          <li className={`px-4 py-2 font-bold text-sm border-b-2 ${pathname === "/shonchoi2" ? "text-red-500 border-red-500" : "text-white border-transparent"}`}>
            সঞ্চয় ২
          </li>
        </Link>

        <Link href="/shonchoi3">
          <li className={`px-4 py-2 font-bold text-sm border-b-2 ${pathname === "/shonchoi3" ? "text-red-500 border-red-500" : "text-white border-transparent"}`}>
            সঞ্চয় ৩
          </li>
        </Link>

        <Link href="/rin">
          <li className={`px-4 py-2 font-bold text-sm border-b-2 ${pathname === "/rin" ? "text-red-500 border-red-500" : "text-white border-transparent"}`}>
            ঋণ
          </li>
        </Link>

        <Link href="/rin1">
          <li className={`px-4 py-2 font-bold text-sm border-b-2 ${pathname === "/rin1" ? "text-red-500 border-red-500" : "text-white border-transparent"}`}>
            ঋণ ১
          </li>
        </Link>

      </ul>
    </nav>
  )
}