"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Reorder, useDragControls } from "framer-motion"

// 🔹 সিঙ্গেল কার্ড কম্পোনেন্ট (শুধুমাত্র আইকনে ড্রাগ অন করার জন্য)
function MemberCard({
  item,
  isAdmin,
  setEditMember,
  setName,
  setAdress,
  setPhone,
  setAshol,
  setLab,
  setDate,
  setShowAddPopup,
  handleDeleteMember,
}) {
  const dragControls = useDragControls()
const dragControls = useDragControls()
const totalAshol = Number(item.ashol) || 0
  const totalAdai = item.transactions?.reduce((acc, t) => acc + (Number(t.joma) || 0), 0) || 0
  const oboshishto = totalAshol - totalAdai
  return (
    <Reorder.Item
      key={item._id}
      value={item}
      dragListener={false} // 👈 কার্ডের অন্যান্য অংশ থেকে ড্রাগ ডিজেবল করা হলো
      dragControls={dragControls}
      whileDrag={{
        scale: 1.03,
        boxShadow: "0px 10px 25px rgba(0,0,0,0.3)",
        zIndex: 50,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="select-none"
    >
      <div className="flex items-center gap-2 bg-amber-500 text-black p-3.5 rounded-2xl shadow-lg hover:bg-amber-400 transition">
        
        {/* 🔹 শুধুমাত্র এই আইকনটি চেপে ধরে সরাতে পারবে */}
        {isAdmin && (
          <div
            onPointerDown={(e) => dragControls.start(e)} // 👈 আইকনে টাচ/ক্লিক করলে ড্রাগ চালু হবে
            className="text-gray-800 font-bold px-2 py-3 text-xl opacity-75 cursor-grab active:cursor-grabbing touch-none"
          >
            ⋮⋮
          </div>
        )}

        <Link href={`/rin1/${item._id}`} className="flex-1">
          <div>
            <div className="text-center mb-2 border-b border-black/10 pb-1">
              <h1 className="font-bold text-lg">{item.name}</h1>
           
           <div className="bg-red-700 text-white px-2.5 py-1 rounded-lg font-bold text-xs whitespace-nowrap shadow-sm">
                অবশিষ্ট: ৳{oboshishto}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1 text-xs text-gray-900 font-semibold">
              <p>
                আসল: <span className="font-bold">৳{item.ashol}</span>
              </p>
              <p>
                লাভ: <span className="font-bold text-green-900">৳{item.lab || 0}</span>
              </p>
              <p>তারিখ: {item.date}</p>
              <p>মোবাইল: {item.phone || "N/A"}</p>
              <p className="col-span-2 text-gray-800 border-t border-black/10 pt-1 mt-1">
                ঠিকানা: {item.adress}
              </p>
            </div>
          </div>
        </Link>

        {/* Admin Actions */}
        {isAdmin && (
          <div className="flex gap-1">
            <button
              onClick={() => {
                setEditMember(item)
                setName(item.name)
                setAdress(item.adress)
                setPhone(item.phone || "")
                setAshol(item.ashol)
                setLab(item.lab || "")
                setDate(item.date)
                setShowAddPopup(true)
              }}
              className="bg-blue-600 text-white text-xs px-2.5 py-3 rounded-xl font-bold hover:bg-blue-700"
            >
              ✏️
            </button>
            <button
              onClick={() => handleDeleteMember(item._id)}
              className="bg-red-600 text-white text-xs px-2.5 py-3 rounded-xl font-bold hover:bg-red-700"
            >
              🗑️
            </button>
          </div>
        )}
      </div>
    </Reorder.Item>
  )
}

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
      const res = await fetch("/api/rin1")
      const data = await res.json()
      setList(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error(error)
    }
  }

  // Admin Login Handle
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

  // Drag করে পজিশন পরিবর্তন করার পর ডাটাবেজে সেভ
  const handleReorder = async (newList) => {
    setList(newList)

    if (isAdmin) {
      try {
        await fetch("/api/rin1", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "reorder",
            items: newList.map((item, index) => ({ _id: item._id, order: index })),
          }),
        })
      } catch (error) {
        console.error("Failed to update order:", error)
      }
    }
  }

  const handleSaveMember = async (e) => {
    e.preventDefault()
    if (!name || !adress || !ashol || !date)
      return alert("নাম, ঠিকানা, আসল এবং তারিখ আবশ্যক!")

    const payload = { name, adress, phone, ashol, lab, date }

    if (editMember) {
      await fetch("/api/rin1", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editMember._id, ...payload }),
      })
    } else {
      await fetch("/api/rin1", {
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
    await fetch("/api/rin1", {
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

  // Calculate Grand Remaining
  const grandOboshishto = list.reduce((acc, item) => {
    const totalAshol = Number(item.ashol) || 0
    const totalJoma =
      item.transactions?.reduce((sum, t) => sum + (Number(t.joma) || 0), 0) || 0
    return acc + (totalAshol - totalJoma)
  }, 0)

  return (
    <div className="bg-blue-800 min-h-screen text-white pb-10 relative">
      <div className="max-w-md mx-auto mb-3 pt-3 px-4">
        <Link
          href="/"
          className="text-xs text-yellow-400 hover:underline inline-block font-semibold"
        >
          ← Back to HOME
        </Link>
      </div>

      {/* Header Navigation */}
      <nav className="bg-red-700 py-3 px-4 flex justify-between items-center shadow-md">
        <div className="w-16"></div>
        <h1 className="font-bold text-2xl md:text-3xl text-center">ঋণ হিসাব</h1>

        <div>
          {isAdmin ? (
            <button
              onClick={handleLogout}
              className="bg-black/40 text-xs px-3 py-1.5 rounded font-bold hover:bg-black/60"
            >
              LOGOUT
            </button>
          ) : (
            <button
              onClick={() => setShowLoginPopup(true)}
              className="bg-yellow-400 text-black text-xs px-3 py-1.5 rounded font-bold hover:bg-yellow-300"
            >
              LOGIN
            </button>
          )}
        </div>
      </nav>

      {/* Grand Total Banner */}
      <div className="text-center my-5">
        <div className="inline-block bg-yellow-400 text-black px-6 py-2.5 rounded-2xl shadow-xl font-bold text-xl border-2 border-yellow-500">
          সর্বমোট অবশিষ্ট ঋণ: ৳ {grandOboshishto}
        </div>
      </div>

      {/* Reorderable Member List */}
      <div className="flex flex-col items-center px-4">
        <Reorder.Group
          axis="y"
          values={list}
          onReorder={handleReorder}
          className="w-full max-w-sm space-y-3"
        >
          {list.map((item) => (
            <MemberCard
              key={item._id}
              item={item}
              isAdmin={isAdmin}
              setEditMember={setEditMember}
              setName={setName}
              setAdress={setAdress}
              setPhone={setPhone}
              setAshol={setAshol}
              setLab={setLab}
              setDate={setDate}
              setShowAddPopup={setShowAddPopup}
              handleDeleteMember={handleDeleteMember}
            />
          ))}
        </Reorder.Group>
      </div>

      {/* Add Button (Admin Only) */}
      {isAdmin && (
        <div className="text-center text-4xl font-bold text-red-500 mt-6">
          <button
            onClick={() => {
              resetForm()
              setShowAddPopup(true)
            }}
            className="bg-white text-red-600 px-4 py-1 rounded-full shadow-lg hover:bg-gray-100"
          >
            +
          </button>
        </div>
      )}

      {/* Add/Edit Popup */}
      {showAddPopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white text-black p-5 rounded-lg w-80 shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-center">
              {editMember ? "EDIT MEMBER" : "NEW ENTRY"}
            </h2>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="গ্রহীতার নাম *"
              className="border w-full p-2 mb-3 rounded text-sm"
            />
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="তারিখ (যেমন: 08/08/2026) *"
              className="border w-full p-2 mb-3 rounded text-sm"
            />
            <div className="grid grid-cols-2 gap-2 mb-3">
              <input
                type="number"
                value={ashol}
                onChange={(e) => setAshol(e.target.value)}
                placeholder="আসল টাকা *"
                className="border w-full p-2 rounded text-sm"
              />
              <input
                type="number"
                value={lab}
                onChange={(e) => setLab(e.target.value)}
                placeholder="লাভ (Optional)"
                className="border w-full p-2 rounded text-sm"
              />
            </div>
            <textarea
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="মোবাইল নম্বর"
              className="border w-full p-2 mb-3 rounded text-sm resize-none"
            />
            <textarea
              value={adress}
              onChange={(e) => setAdress(e.target.value)}
              placeholder="ঠিকানা *"
              rows={2}
              className="border w-full p-2 mb-4 rounded text-sm resize-none"
            />

            <div className="flex justify-between font-bold">
              <button
                onClick={handleSaveMember}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                SAVE
              </button>
              <button
                onClick={() => setShowAddPopup(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login Popup */}
      {showLoginPopup && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white text-black p-5 rounded-lg w-80 shadow-2xl">
            <h2 className="text-xl font-bold mb-3 text-center">ADMIN LOGIN</h2>
            <p className="text-xs text-gray-600 mb-3 text-center">
              ৮ অক্ষরের পাসওয়ার্ড পিন টাইপ করুন
            </p>
            <input
              type="password"
              maxLength={8}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Enter 8 digit code"
              className="border text-center tracking-widest text-lg w-full p-2 mb-4 rounded font-mono"
            />
            <div className="flex justify-between font-bold">
              <button
                onClick={handleLogin}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                LOGIN
              </button>
              <button
                onClick={() => setShowLoginPopup(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}