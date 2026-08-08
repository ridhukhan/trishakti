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

  // Form states (Only date, joma, comments as requested)
  const [date, setDate] = useState("")
  const [joma, setJoma] = useState("")
  const [comments, setComments] = useState("")

  useEffect(() => {
    fetchMemberDetails()
    const adminState = localStorage.getItem("isAdmin")
    if (adminState === "true") setIsAdmin(true)
  }, [])

  const fetchMemberDetails = async () => {
    const res = await fetch(`/api/rin/${id}`)
    const data = await res.json()
    setMember(data)
  }

  const handleSaveTransaction = async (e) => {
    e.preventDefault()
    if (!date || !joma) return alert("তারিখ ও জমার পরিমাণ দিন!")

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

    resetForm()
    setShowpopup(false)
    fetchMemberDetails()
  }

  const handleDeleteTransaction = async (transactionId) => {
    if (!confirm("আপনি কি নিশ্চিত এই জমার হিসাবটি ডিলিট করতে চান?")) return
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

  // Calculations
  const totalPayable = (Number(member.ashol) || 0) + (Number(member.lab) || 0)
  const totalJoma = member.transactions?.reduce((acc, item) => acc + (Number(item.joma) || 0), 0) || 0
  const oboshishto = totalPayable - totalJoma

  return (
    <div className="bg-slate-900 min-h-screen text-white p-4 pb-12">
      {/* Header */}
      <div className="max-w-md mx-auto">
        <Link href="/rin" className="text-xs text-amber-400 hover:underline mb-3 inline-block">
          ← ব্যাক টু লিস্ট
        </Link>
        <nav className="bg-slate-800 border border-slate-700 p-4 text-center rounded-2xl shadow-lg">
          <h1 className="text-2xl font-bold text-amber-400">{member.name}</h1>
          <div className="flex justify-center gap-4 text-xs mt-3 bg-slate-900/80 p-2 rounded-xl text-gray-300">
            <p>আসল: <span className="font-bold text-white">৳{member.ashol}</span></p>
            <p>লাভ: <span className="font-bold text-emerald-400">৳{member.lab}</span></p>
            <p>মোট দেও: <span className="font-bold text-amber-300">৳{totalPayable}</span></p>
          </div>
        </nav>
      </div>

      {/* Transaction List */}
      <div className="mt-5 space-y-3 max-w-md mx-auto">
        <h3 className="text-sm font-bold text-gray-400 px-1">জমার বিবরণি:</h3>
        {member.transactions?.length === 0 && (
          <p className="text-center text-xs text-gray-500 py-4">এখনো কোনো জমা দেওয়া হয়নি।</p>
        )}
        {member.transactions?.map((item) => (
          <div key={item._id} className="bg-slate-800 border border-slate-700 text-white p-3.5 rounded-xl flex justify-between items-center shadow-md">
            <div>
              <p className="text-xs text-amber-400 font-semibold">📅 {item.date}</p>
              <p className="text-base font-bold text-emerald-400 mt-0.5">জমা: ৳{item.joma}</p>
              {item.comments && <p className="text-xs text-gray-400 italic mt-0.5">💬 {item.comments}</p>}
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
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-2.5 py-1.5 rounded-lg"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDeleteTransaction(item._id)}
                  className="bg-red-600 hover:bg-red-500 text-white text-xs px-2.5 py-1.5 rounded-lg"
                >
                  🗑️
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Remaining Balance Summary */}
      <div className="mt-6 text-center max-w-md mx-auto">
        <div className="bg-gradient-to-r from-red-600 to-amber-600 text-white text-lg font-bold px-6 py-3 rounded-2xl shadow-xl border border-red-500">
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
          <div className="bg-slate-800 text-white border border-slate-700 p-5 rounded-2xl w-80 shadow-2xl space-y-3">
            <h2 className="text-lg font-bold text-center text-amber-400">
              {editingTx ? "জমার হিসাব এডিট" : "নতুন জমা যোগ করুন"}
            </h2>

            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="তারিখ (যেমন: 08/08/2026)"
              className="bg-slate-900 border border-slate-700 w-full p-2.5 rounded-xl text-sm outline-none focus:border-amber-400"
            />
            <input
              type="number"
              value={joma}
              onChange={(e) => setJoma(e.target.value)}
              placeholder="জমার পরিমাণ (৳)"
              className="bg-slate-900 border border-slate-700 w-full p-2.5 rounded-xl text-sm outline-none focus:border-amber-400"
            />
            <input
              type="text"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="মন্তব্য (ঐচ্ছিক)"
              className="bg-slate-900 border border-slate-700 w-full p-2.5 rounded-xl text-sm outline-none focus:border-amber-400"
            />

            <div className="flex justify-between font-bold pt-2">
              <button onClick={handleSaveTransaction} className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl text-sm">
                SAVE
              </button>
              <button onClick={() => setShowpopup(false)} className="bg-gray-600 hover:bg-gray-500 text-white px-5 py-2 rounded-xl text-sm">
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}