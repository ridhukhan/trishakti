'use client'

import { useState, useEffect } from "react"

export default function Home() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [uploading, setUploading] = useState(false)

  // প্রাথমিক স্টেট (আপনি পরবর্তীতে ডাটাবেজ থেকে ডাটা লোড করতে পারবেন)
  const [founders, setFounders] = useState([
    { id: 1, name: "প্রতিষ্ঠাতা ১", image: "https://via.placeholder.com/150" },
    { id: 2, name: "প্রতিষ্ঠাতা ২", image: "https://via.placeholder.com/150" },
  ])

  const [directors, setDirectors] = useState([
    { id: 1, name: "পরিচালক ১", image: "https://via.placeholder.com/150" },
    { id: 2, name: "পরিচালক ২", image: "https://via.placeholder.com/150" },
    { id: 3, name: "পরিচালক ৩", image: "https://via.placeholder.com/150" },
  ])

  const [partners, setPartners] = useState([
    { id: 1, name: "অংশীদার ১", image: "https://via.placeholder.com/150" },
    { id: 2, name: "অংশীদার ২", image: "https://via.placeholder.com/150" },
    { id: 3, name: "অংশীদার ৩", image: "https://via.placeholder.com/150" },
    { id: 4, name: "অংশীদার ৪", image: "https://via.placeholder.com/150" },
    { id: 5, name: "অংশীদার ৫", image: "https://via.placeholder.com/150" },
    { id: 6, name: "অংশীদার ৬", image: "https://via.placeholder.com/150" },
    { id: 7, name: "অংশীদার ৭", image: "https://via.placeholder.com/150" },
    { id: 8, name: "অংশীদার ৮", image: "https://via.placeholder.com/150" },
    { id: 9, name: "অংশীদার ৯", image: "https://via.placeholder.com/150" },
  ])

  useEffect(() => {
    const adminState = localStorage.getItem("isAdmin")
    if (adminState === "true") {
      setIsAdmin(true)
    }
  }, [])

  // Cloudinary Direct Image Upload Functionality
  const handleImageUpload = async (e, category, index) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "ml_default") // Cloudinary te create kora Unsigned Upload Preset name dynamic rakhun

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dfzaefrkt/image/upload", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()

      if (data.secure_url) {
        const imageUrl = data.secure_url

        if (category === "founders") {
          const updated = [...founders]
          updated[index].image = imageUrl
          setFounders(updated)
        } else if (category === "directors") {
          const updated = [...directors]
          updated[index].image = imageUrl
          setDirectors(updated)
        } else if (category === "partners") {
          const updated = [...partners]
          updated[index].image = imageUrl
          setPartners(updated)
        }
      }
    } catch (err) {
      alert("ছবি আপলোড ব্যর্থ হয়েছে!")
    } finally {
      setUploading(false)
    }
  }

  // নতুন অংশীদার যোগ করার ফাংশন
  const handleAddPartner = () => {
    const newPartner = {
      id: partners.length + 1,
      name: `অংশীদার ${partners.length + 1}`,
      image: "https://via.placeholder.com/150",
    }
    setPartners([...partners, newPartner])
  }

  return (
    <div className="bg-slate-900 min-h-screen text-white flex flex-col justify-between font-sans pb-24">
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

      {/* Main Members Section */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 space-y-12">
        
        {/* ১. প্রতিষ্ঠাতা সেকশন (২ টি গোল) */}
        <section className="text-center">
          <h2 className="text-xl md:text-2xl font-bold text-amber-400 mb-6 border-b border-slate-700 pb-2 inline-block px-6">
            প্রতিষ্ঠাতা
          </h2>
          <div className="flex justify-center items-center gap-6 sm:gap-12 flex-wrap">
            {founders.map((item, idx) => (
              <div key={item.id} className="group relative flex flex-col items-center">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full p-1 bg-gradient-to-tr from-cyan-500 to-amber-400 shadow-xl group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full rounded-full object-cover border-2 border-slate-900"
                  />
                </div>
                {isAdmin && (
                  <label className="mt-2 text-xs bg-cyan-600 hover:bg-cyan-700 text-white py-1 px-3 rounded-full cursor-pointer transition shadow">
                    {uploading ? "..." : "Change Pic"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, "founders", idx)}
                    />
                  </label>
                )}
                <span className="mt-2 font-semibold text-slate-300 group-hover:text-amber-400 transition">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ২. পরিচালনায় সেকশন (৩ টি গোল) */}
        <section className="text-center">
          <h2 className="text-xl md:text-2xl font-bold text-amber-400 mb-6 border-b border-slate-700 pb-2 inline-block px-6">
            পরিচালনায়
          </h2>
          <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-lg mx-auto">
            {directors.map((item, idx) => (
              <div key={item.id} className="group flex flex-col items-center">
                <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-emerald-500 to-cyan-500 shadow-lg group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full rounded-full object-cover border-2 border-slate-900"
                  />
                </div>
                {isAdmin && (
                  <label className="mt-2 text-[10px] sm:text-xs bg-emerald-600 hover:bg-emerald-700 text-white py-0.5 px-2 rounded-full cursor-pointer transition">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, "directors", idx)}
                    />
                  </label>
                )}
                <span className="mt-2 text-xs sm:text-sm font-medium text-slate-300 group-hover:text-emerald-400 transition">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ৩. অংশীদারবৃন্দ সেকশন (৯ টি + Dynamic Add Option) */}
        <section className="text-center">
          <h2 className="text-xl md:text-2xl font-bold text-amber-400 mb-6 border-b border-slate-700 pb-2 inline-block px-6">
            অংশীদারবৃন্দ
          </h2>
          
          <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-xl mx-auto">
            {partners.map((item, idx) => (
              <div key={item.id} className="group flex flex-col items-center">
                <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-amber-500 to-red-500 shadow-md group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full rounded-full object-cover border-2 border-slate-900"
                  />
                </div>
                {isAdmin && (
                  <label className="mt-1 text-[10px] bg-amber-600 hover:bg-amber-700 text-slate-900 font-bold py-0.5 px-2 rounded-full cursor-pointer transition">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, "partners", idx)}
                    />
                  </label>
                )}
                <span className="mt-1 text-xs font-medium text-slate-300 group-hover:text-amber-400 transition">
                  {item.name}
                </span>
              </div>
            ))}

            {/* এডমিন হলে অতিরিক্ত অংশীদার যোগ করার জন্য '+' প্লাস চিহ্ন */}
            {isAdmin && (
              <div
                onClick={handleAddPartner}
                className="flex flex-col items-center justify-center cursor-pointer group"
              >
                <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-2 border-dashed border-slate-500 group-hover:border-amber-400 flex items-center justify-center transition-colors bg-slate-800/50">
                  <span className="text-3xl text-slate-400 group-hover:text-amber-400 font-bold">+</span>
                </div>
                <span className="mt-2 text-xs font-semibold text-slate-400 group-hover:text-amber-400">
                  নতুন যুক্ত করুন
                </span>
              </div>
            )}
          </div>
        </section>

      </main>

      {/* Footer Section */}
      <footer className="bg-slate-800/50 border-t border-slate-800 py-4 text-center text-slate-500 text-xs">
        <p>© {new Date().getFullYear()} Trishakti Foundation. All rights reserved.</p>
      </footer>
    </div>
  )
}