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

  // Form states
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

    setIsSaving(true)

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
      alert("সংরক্ষণে সমস্যা হয়েছে! আবার চেষ্টা করুন।")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteTransaction = async (transactionId) => {
    if (!confirm("আপনি কি নিশ্চিত এই আদায়ের হিসাবটি ডিলিট করতে চান?")) return
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

  if (!member) return <div className="text-center mt-10 font-bold text-white">Loading...</div>

  // Calculations
  const totalAshol = Number(member.ashol) || 0
  const totalAdai = member.transactions?.reduce((acc, item) => acc + (Number(item.joma) || 0), 0) || 0
  const oboshishto = totalAshol - totalAdai

  return (
    <div className="bg-blue-800 min-h-screen text-white p-4">
      {/* Back Button & Header */}
      <div className="max-w-md mx-auto mb-3">
        <Link href="/rin" className="text-xs text-yellow-400 hover:underline inline-block font-semibold">
          ← ব্যাক টু লিস্ট
        </Link>
      </div>

      <nav className="bg-fuchsia-800 p-4 text-center rounded shadow max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-yellow-400">{member.name}</h1>
        <p className="text-sm">{member.adress}</p>
                    <p> তারিখ: {member.date}</p>
                    <p>মোবাইল: {member.phone || "N/A"}</p>
                    <p>লাভ: <span className="font-bold text-green-900">৳{member.lab || 0}</span></p>
                    
        <div className="mt-2 font-bold text-center text-yellow-500 border-t border-fuchsia-700 pt-1 flex justify-center">
          <span>মোট ঋণ: ৳{member.ashol}</span>
        </div>
      </nav>

      {/* Transaction List */}
      <div className="mt-5 space-y-3 max-w-md mx-auto">
        {member.transactions?.map((item) => (
          <div key={item._id} className="bg-amber-500 text-black p-3 rounded-lg flex justify-between items-center font-bold">
            <div>
              <p className="text-xs text-gray-800">{item.date}</p>
              <div className="flex gap-3 text-sm mt-1">
                <span className="text-green-900">আদায়/জমা: ৳{item.joma}</span>
                {item.comments && <span className="text-black-500">comment: {item.comments}</span>}
              </div>
            </div>

            {/* Edit & Delete for Admin */}
            {isAdmin && (
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setEditingTx(item)
                    setDate(item.date)
                    setJoma(item.joma)
                    setComments(item.comments || "")
                    setShowpopup(true)
                  }}
                  className="bg-blue-600 text-white text-xs px-2 py-1 rounded"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDeleteTransaction(item._id)}
                  className="bg-red-600 text-white text-xs px-2 py-1 rounded"
                >
                  🗑️
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Remaining Total */}
      <div className="mt-6 text-center">
        <div className="inline-block bg-yellow-400 text-black text-2xl font-bold px-6 py-2 rounded-full shadow-lg">
          অবশিষ্ট ঋণ: ৳{oboshishto}
        </div>
      </div>

      {/* Add Button (Admin Only) */}
      {isAdmin && (
        <div className="text-center text-4xl font-bold text-yellow-400 mt-6">
          <button
            onClick={() => {
              resetForm()
              setShowpopup(true)
            }}
            className="bg-red-600 px-4 py-1 rounded-full shadow-lg hover:bg-red-700 text-white"
          >
            +
          </button>
        </div>
      )}

      {/* Add / Edit Transaction Modal */}
      {showpopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white text-black p-5 rounded-lg w-80 shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-center">
              {editingTx ? "হিসাব এডিট করুন" : "নতুন আদায় যোগ করুন"}
            </h2>

            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="তারিখ লিখুন (যেমন: 08/08/2026)"
              className="border w-full p-2 mb-3 rounded"
            />
            <input
              type="number"
              value={joma}
              onChange={(e) => setJoma(e.target.value)}
              placeholder="আদায়ের পরিমাণ (৳)"
              className="border w-full p-2 mb-3 rounded"
            />
            <input
              type="text"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="ENTER COMMENTS"
              className="border w-full p-2 mb-4 rounded"
            />

            <div className="flex justify-between font-bold">
              <button
                onClick={handleSaveTransaction}
                disabled={isSaving}
                className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {isSaving ? "SAVING..." : "SAVE"}
              </button>
              <button
                onClick={() => setShowpopup(false)}
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