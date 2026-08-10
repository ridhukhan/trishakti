import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-slate-900 min-h-screen text-white flex flex-col justify-between font-sans">
      {/* Header Section */}
      <header className="bg-slate-800 border-b border-slate-700 shadow-lg py-6 text-center px-4">
        <h1 className="font-extrabold text-3xl md:text-5xl text-amber-400 tracking-wide drop-shadow-md">
          ত্রি-শক্তি ফাউন্ডেশন
        </h1>
        <h3 className="mt-5 text-cyan-400">(একটি ধর্মীয় সেবামূলক সংগঠন)</h3>
        <p className="text-slate-400 text-sm md:text-base mt-1 font-medium tracking-wider">
          প্রতিষ্ঠানকাল - ২১/০৫/২০০৭
        </p>
      </header>

      {/* Main Content Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        

        {/* Dashboard Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          
          {/* সঞ্চয় হিসাব Card */}
          <Link href="/shonchoi" className="group">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 text-center shadow-xl hover:border-emerald-500 hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-2xl font-bold text-emerald-400 mb-2">
                সঞ্চয় হিসাব
              </h3>
              <p className="text-slate-400 text-sm">
                সকল সদস্যের সঞ্চয়, জমা ও উত্তোলনের সম্পূর্ণ হিসাব দেখুন
              </p>
            </div>
          </Link>

          {/* ঋণ হিসাব Card */}
          <Link href="/rin" className="group">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 text-center shadow-xl hover:border-amber-500 hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-500 group-hover:text-white transition-all">
                <span className="text-3xl">📝</span>
              </div>
              <h3 className="text-2xl font-bold text-amber-400 mb-2">
                ঋণ হিসাব
              </h3>
              <p className="text-slate-400 text-sm">
                সদস্যদের দেওয়া ঋণ ও কিস্তির হিসাব পরিচালনা করুন
              </p>
            </div>
          </Link>
        <Link href="/shonchoi1" className="group">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 text-center shadow-xl hover:border-emerald-500 hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-2xl font-bold text-emerald-400 mb-2">
                সঞ্চয় হিসাব 1
              </h3>
              <p className="text-slate-400 text-sm">
                সকল সদস্যের সঞ্চয়, জমা ও উত্তোলনের সম্পূর্ণ হিসাব দেখুন
              </p>
            </div>
          </Link>
          <Link href="/rin1" className="group">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 text-center shadow-xl hover:border-amber-500 hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-500 group-hover:text-white transition-all">
                <span className="text-3xl">📝</span>
              </div>
              <h3 className="text-2xl font-bold text-amber-400 mb-2">
                ঋণ হিসাব 1
              </h3>
              <p className="text-slate-400 text-sm">
                সদস্যদের দেওয়া ঋণ ও কিস্তির হিসাব পরিচালনা করুন
              </p>
            </div>
          </Link>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="bg-slate-800/50 border-t border-slate-800 py-4 text-center text-slate-500 text-xs">
        <p>© {new Date().getFullYear()} Trishakti Foundation. All rights reserved.</p>
      </footer>
    </div>
  );
}