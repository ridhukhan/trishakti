"use client"
import { useState, useEffect, use } from "react"
import Link from "next/link"

export default function RinMemberDetails({ params }) {
  const { id } = use(params)
  const [member, setMember] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  // Modal State
  const [showpopup, setShowpopup] = useState(false)
  const [editingTx, setEditingTx] = useState(null)
  
  // Loading State for Save Button
  const [isSaving, setIsSaving] = useState(false)

  // Form states (Only date, joma, comments)
  const [date, setDate] = useState("")
  const [joma, setJoma] = useState("")
  const [comments, setComments] = useState("")

  useEffect(() => {
    fetchMemberDetails()
    const adminState = localStorage.getItem("isAdmin")
    if (adminState === "true") setIsAdmin(true)
  }, [])

  const fetchMemberDetails = async () => {
    try {
      const res = await fetch(`/api/rin/${id}`)
      const data = await res.json()
      setMember(data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleSaveTransaction = async (e) => {
    e.preventDefault()
    if (!date || !joma) return alert("তারিখ ও আদায়ের পরিমাণ দিন!")

    setIsSaving(true) // Loading ON

    try {
      if (editingTx) {
        await fetch(`/api/rin/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "edit",
            transactionId: editingTx._id,
            date,
            joma,
            comments,
          }),
        })
      } else {
        await fetch(`/api/rin/${id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date, joma, comments }),
        })
      }

      await fetchMemberDetails()
      resetForm()
      setShowpopup(false)
    } catch (error) {
      console.error(error)
      alert("সংরক্ষণে সমস্যা হয়েছে! আবার চেষ্টা করুন।")
    } finally {
      setIsSaving(false) // Loading OFF
    }
  }

  const handleDeleteTransaction = async (transactionId) => {
    if (!confirm("আপনি কি নিশ্চিত এই আদায়ের হিসাবটি ডিলিট করতে চান?")) return
    await fetch(`/api/rin/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "delete",
        transactionId,
      }),
    })
    fetchMemberDetails()
  }

  const resetForm = () => {
    setDate("")
    setJoma("")
    setComments("")
    setEditingTx(null)
  }

  if (!member) return <div className="text-center mt-12 font-bold text-amber-400">Loading...</div>

  // Calculations (Only Asol - Total Joma/Adai)
  const totalAshol = Number(member.ashol) || 0
  const totalAdai = member.transactions?.reduce((acc, item) => acc + (Number(item.joma) || 0), 0) || 0
  const oboshishto = totalAshol - totalAdai

  return (
    <div className="bg-slate-900 min-h-screen text-white p-4 pb-12">
      {/* Header & Member Summary Card */}
      <div className="max-w-md mx-auto">
        <Link href="/rin" className="text-xs text-amber-400 hover:underline mb-3 inline-block font-semibold">
          ← ব্যাক টু লিস্ট
        </Link>
        <nav className="bg-slate-800 border border-slate-700 p-5 text-center rounded-2xl shadow-xl">
          <h1 className="text-2xl md:text-3xl font-extrabold text-amber-400 tracking-wide">{member.name}</h1>
          
          {/* Prominent Total Debt Display */}
          <div className="mt-3 bg-slate-900/90 p-3.5 rounded-xl border border-slate-700/80 shadow-inner">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">মোট ঋণ</p>
            <p className="text-2xl font-black text-white">৳ {member.ashol}</p>
          </div>
        </nav>
      </div>

      {/* Transaction List / Adai Details */}
      <div className="mt-6 space-y-3 max-w-md mx-auto">
        <h3 className="text-sm font-bold text-gray-400 px-1">আদায়ের বিবরণি:</h3>
        {member.transactions?.length === 0 && (
          <p className="text-center text-xs text-gray-500 py-6 bg-slate-800/40 rounded-xl border border-slate-800">
            এখনো কোনো টাকা আদায় হয়নি।
          </p>
        )}
        {member.transactions?.map((item) => (
          <div key={item._id} className="bg-slate-800 border border-slate-700 text-white p-4 rounded-2xl flex justify-between items-center shadow-lg transition">
            <div>
              <p className="text-xs text-amber-400 font-semibold mb-1">📅 {item.date}</p>
              <p className="text-base font-bold text-emerald-400">আদায়: ৳{item.joma}</p>
              {item.comments && <p className="text-xs text-gray-400 italic mt-1">💬 {item.comments}</p>}
            </div>

            {/* Admin Actions */}
            {isAdmin && (
              <div className="flex gap-1.5">
                <button
                  onClick={() => {
                    setEditingTx(item)
                    setDate(item.date)
                    setJoma(item.joma)
                    setComments(item.comments || "")
                    setShowpopup(true)
                  }}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs p-2.5 rounded-xl font-bold transition"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDeleteTransaction(item._id)}
                  className="bg-red-600 hover:bg-red-500 text-white text-xs p-2.5 rounded-xl font-bold transition"
                >
                  🗑️
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Remaining Balance Summary Banner */}
      <div className="mt-6 text-center max-w-md mx-auto">
        <div className="bg-gradient-to-r from-red-600 to-amber-600 text-white text-lg font-extrabold px-6 py-3.5 rounded-2xl shadow-xl border border-red-500">
          অবশিষ্ট পাওনা: ৳ {oboshishto}
        </div>
      </div>

      {/* Floating Add Button */}
      {isAdmin && (
        <div className="text-center mt-6">
          <button
            onClick={() => {
              resetForm()
              setShowpopup(true)
            }}
            className="bg-emerald-500 hover:bg-emerald-400 text-black text-3xl font-extrabold w-14 h-14 rounded-full shadow-2xl transition"
          >
            +
          </button>
        </div>
      )}

      {/* Add / Edit Transaction Modal */}
      {showpopup && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 text-white border border-slate-700 p-6 rounded-2xl w-85 shadow-2xl space-y-3">
            <h2 className="text-lg font-bold text-center text-amber-400">
              {editingTx ? "আদায়ের হিসাব এডিট" : "নতুন টাকা আদায় এন্ট্রি"}
            </h2>

            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="তারিখ (যেমন: 08/08/2026) *"
              className="bg-slate-900 border border-slate-700 w-full p-2.5 rounded-xl text-sm outline-none focus:border-amber-400"
              disabled={isSaving}
            />
            <input
              type="number"
              value={joma}
              onChange={(e) => setJoma(e.target.value)}
              placeholder="আদায়ের পরিমাণ (৳) *"
              className="bg-slate-900 border border-slate-700 w-full p-2.5 rounded-xl text-sm outline-none focus:border-amber-400"
              disabled={isSaving}
            />
            <input
              type="text"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="মন্তব্য (ঐচ্ছিক)"
              className="bg-slate-900 border border-slate-700 w-full p-2.5 rounded-xl text-sm outline-none focus:border-amber-400"
              disabled={isSaving}
            />

            <div className="flex justify-between font-bold pt-2">
              <button 
                onClick={handleSaveTransaction} 
                disabled={isSaving}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2 rounded-xl text-sm flex items-center gap-2 transition"
              >
                {isSaving ? "SAVING..." : "SAVE"}
              </button>
              <button 
                onClick={() => !isSaving && setShowpopup(false)} 
                disabled={isSaving}
                className="bg-gray-600 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2 rounded-xl text-sm transition"
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