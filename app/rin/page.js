"use client"
import { useState, useEffect } from "react"
import Link from "next/link"

export default function RinPage() {
  const [list, setList] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)

  // Modals state
  const [showAddPopup, setShowAddPopup] = useState(false)
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const [editMember, setEditMember] = useState(null)

  // Form states
  const [name, setName] = useState("")
  const [adress, setAdress] = useState("")
  const [phone, setPhone] = useState("")
  const [ashol, setAshol] = useState("")
  const [lab, setLab] = useState("")
  const [date, setDate] = useState("")
  const [pinInput, setPinInput] = useState("")

  useEffect(() => {
    fetchMembers()
    const adminState = localStorage.getItem("isAdmin")
    if (adminState === "true") setIsAdmin(true)
  }, [])

  const fetchMembers = async () => {
    try {
      const res = await fetch("/api/rin")
      const data = await res.json()
      setList(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error(error)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    const res = await fetch("/api/admin/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin: pinInput }),
    })
    const data = await res.json()

    if (res.ok && data.success) {
      setIsAdmin(true)
      localStorage.setItem("isAdmin", "true")
      setShowLoginPopup(false)
      setPinInput("")
      alert("Admin Login Successful!")
    } else {
      alert(data.message || "ভুল পাসওয়ার্ড!")
    }
  }

  const handleLogout = () => {
    setIsAdmin(false)
    localStorage.removeItem("isAdmin")
  }

  const handleSaveMember = async (e) => {
    e.preventDefault()
    if (!name || !adress || !ashol || !date) return alert("নাম, ঠিকানা, আসল এবং তারিখ আবশ্যক!")

    const payload = { name, adress, phone, ashol, lab, date }

    if (editMember) {
      await fetch("/api/rin", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editMember._id, ...payload }),
      })
    } else {
      await fetch("/api/rin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
    }

    resetForm()
    setShowAddPopup(false)
    fetchMembers()
  }

  const handleDeleteMember = async (id) => {
    if (!confirm("আপনি কি নিশ্চিত এই ঋণ গ্রহীতাকে মুছে ফেলতে চান?")) return
    await fetch("/api/rin", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    fetchMembers()
  }

  const resetForm = () => {
    setName("")
    setAdress("")
    setPhone("")
    setAshol("")
    setLab("")
    setDate("")
    setEditMember(null)
  }

  // Calculate Grand Remaining / Oboshishto
  const grandOboshishto = list.reduce((acc, item) => {
    const totalPayable = (Number(item.ashol) || 0) + (Number(item.lab) || 0)
    const totalJoma = item.transactions?.reduce((sum, t) => sum + (Number(t.joma) || 0), 0) || 0
    return acc + (totalPayable - totalJoma)
  }, 0)

  return (
    <div className="bg-slate-900 min-h-screen text-white pb-12 relative">
      {/* Header */}
      <nav className="bg-emerald-800 py-3.5 px-4 flex justify-between items-center shadow-lg border-b border-emerald-700">
        <div className="w-16"></div>
        <h1 className="font-bold text-2xl md:text-3xl text-center tracking-wide text-amber-300">ঋণ হিসাব</h1>

        <div>
          {isAdmin ? (
            <button onClick={handleLogout} className="bg-red-600/80 hover:bg-red-600 text-xs px-3 py-1.5 rounded font-bold transition">
              LOGOUT
            </button>
          ) : (
            <button onClick={() => setShowLoginPopup(true)} className="bg-amber-400 text-black text-xs px-3 py-1.5 rounded font-bold hover:bg-amber-300 transition">
              LOGIN
            </button>
          )}
        </div>
      </nav>

      {/* Member Cards */}
      <div className="flex flex-col items-center gap-3.5 px-4 max-w-md mx-auto mt-6">
        {list.map((item) => {
          const totalPayable = (Number(item.ashol) || 0) + (Number(item.lab) || 0)
          const totalJoma = item.transactions?.reduce((sum, t) => sum + (Number(t.joma) || 0), 0) || 0
          const oboshishto = totalPayable - totalJoma

          return (
            <div key={item._id} className="w-full flex items-center gap-2">
              <Link href={`/rin/${item._id}`} className="flex-1">
                <div className="bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-white p-4 rounded-2xl shadow-lg transition">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h1 className="font-bold text-lg text-amber-400">{item.name}</h1>
                    </div>
                    <div className="text-right">
                      <span className="text-xs bg-red-950 text-red-300 border border-red-800 px-2.5 py-1 rounded-full font-bold">
                        অবশিষ্ট: ৳ {oboshishto}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900/60 p-2.5 rounded-xl text-gray-300 my-2">
                    <p>আসল: <span className="font-bold text-white">৳{item.ashol}</span></p>
                    <p>লাভ: <span className="font-bold text-emerald-400">৳{item.lab}</span></p>
                      <p className="text-xs text-gray-400">📅 তারিখ: {item.date}</p>

                    <p>মোবাইল: <span className="text-white">{item.phone || "N/A"}</span></p>

                    <p className="col-span-2 whitespace-pre-line">
                      ঠিকানা: <span className="text-white">{item.adress}</span>
                    </p>
                  </div>
                </div>
              </Link>

              {/* Admin Actions */}
              {isAdmin && (
                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() => {
                      setEditMember(item)
                      setName(item.name)
                      setAdress(item.adress)
                      setPhone(item.phone || "")
                      setAshol(item.ashol)
                      setLab(item.lab)
                      setDate(item.date)
                      setShowAddPopup(true)
                    }}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs p-2.5 rounded-xl font-bold"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteMember(item._id)}
                    className="bg-red-600 hover:bg-red-500 text-white text-xs p-2.5 rounded-xl font-bold"
                  >
                    🗑️
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Grand Total Oboshishto Banner (Placed below all members) */}
      <div className="text-center my-6 px-4 max-w-md mx-auto">
        <div className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black py-3 rounded-2xl shadow-xl font-extrabold text-xl border-2 border-yellow-300">
          সর্বমোট অবশিষ্ট: ৳ {grandOboshishto}
        </div>
      </div>

      {/* Floating Add Button */}
      {isAdmin && (
        <div className="text-center mt-4">
          <button
            onClick={() => {
              resetForm()
              setShowAddPopup(true)
            }}
            className="bg-emerald-500 hover:bg-emerald-400 text-black text-3xl font-extrabold w-14 h-14 rounded-full shadow-2xl transition"
          >
            +
          </button>
        </div>
      )}

      {/* Add/Edit Popup */}
      {showAddPopup && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 text-white border border-slate-700 p-6 rounded-2xl w-85 shadow-2xl space-y-3">
            <h2 className="text-xl font-bold text-center text-amber-400">
              {editMember ? "ঋণ গ্রহীতা এডিট" : "নতুন ঋণ এন্ট্রি"}
            </h2>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="গ্রহীতার নাম *"
              className="bg-slate-900 border border-slate-700 w-full p-2.5 rounded-xl text-sm outline-none focus:border-amber-400"
            />
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="ঋণ দেওয়ার তারিখ (যেমন: 08/08/2026) *"
              className="bg-slate-900 border border-slate-700 w-full p-2.5 rounded-xl text-sm outline-none focus:border-amber-400"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={ashol}
                onChange={(e) => setAshol(e.target.value)}
                placeholder="আসল টাকা *"
                className="bg-slate-900 border border-slate-700 w-full p-2.5 rounded-xl text-sm outline-none focus:border-amber-400"
              />
              <input
                type="number"
                value={lab}
                onChange={(e) => setLab(e.target.value)}
                placeholder="লাভ / মুনাফা"
                className="bg-slate-900 border border-slate-700 w-full p-2.5 rounded-xl text-sm outline-none focus:border-amber-400"
              />
            </div>
            <textarea
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="মোবাইল নম্বর"
              className="bg-slate-900 border border-slate-700 w-full p-2.5 rounded-xl text-sm outline-none focus:border-amber-400"
            />
            
            {/* Address Textarea */}
            <textarea
              value={adress}
              onChange={(e) => setAdress(e.target.value)}
              placeholder="ঠিকানা *"
              rows={3}
              className="bg-slate-900 border border-slate-700 w-full p-2.5 rounded-xl text-sm outline-none focus:border-amber-400 resize-none"
            />

            <div className="flex justify-between font-bold pt-2">
              <button onClick={handleSaveMember} className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl text-sm">
                SAVE
              </button>
              <button onClick={() => setShowAddPopup(false)} className="bg-gray-600 hover:bg-gray-500 text-white px-5 py-2 rounded-xl text-sm">
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login Popup */}
      {showLoginPopup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 text-white p-6 rounded-2xl w-80 shadow-2xl border border-slate-700">
            <h2 className="text-xl font-bold mb-2 text-center text-amber-400">ADMIN LOGIN</h2>
            <p className="text-xs text-gray-400 mb-4 text-center">৮ অক্ষরের সিক্রেট পিন টাইপ করুন</p>
            <input
              type="password"
              maxLength={8}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="8 Digit Code"
              className="bg-slate-900 border border-slate-700 text-center tracking-widest text-lg w-full p-2.5 mb-5 rounded-xl font-mono outline-none focus:border-amber-400"
            />
            <div className="flex justify-between font-bold">
              <button onClick={handleLogin} className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl text-sm">
                LOGIN
              </button>
              <button onClick={() => setShowLoginPopup(false)} className="bg-gray-600 hover:bg-gray-500 text-white px-5 py-2 rounded-xl text-sm">
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}