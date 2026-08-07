"use client"
import { useState, useEffect, use } from "react"

export default function MemberDetails({ params }) {
  const { id } = use(params)
  const [member, setMember] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  
  const [showpopup, setShowpopup] = useState(false)
  const [editingTx, setEditingTx] = useState(null) 
  const [date, setDate] = useState("")
  const [joma, setJoma] = useState("")
  const [uttolon, setUttolon] = useState("")
  const [comments,setComments]=useState("")

  useEffect(() => {
    fetchMemberDetails()
    const adminState = localStorage.getItem("isAdmin")
    if (adminState === "true") setIsAdmin(true)
  }, [])

  const fetchMemberDetails = async () => {
    const res = await fetch(`/api/members/${id}`)
    const data = await res.json()
    setMember(data)
  }

  // Save transaction (New or Edit)
  const handleSaveTransaction = async (e) => {
    e.preventDefault()
    if (!date) return alert("তারিখ দিন!")

    if (editingTx) {
      // Update transaction
      await fetch(`/api/members/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "edit",
          transactionId: editingTx._id,
          date,
          joma,
          uttolon,
          comments,
        }),
      })
    } else {
      // Add new transaction
      await fetch(`/api/members/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, joma, uttolon ,comments}),
      })
    }

    // Reset Form
    setDate("")
    setJoma("")
    setUttolon("")
    setComments("")
    setEditingTx(null)
    setShowpopup(false)
    fetchMemberDetails()
  }

  // Delete Transaction
  const handleDeleteTransaction = async (transactionId) => {
    if (!confirm("আপনি কি নিশ্চিত এই হিসাবটি মুছে ফেলতে চান?")) return
    await fetch(`/api/members/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "delete",
        transactionId,
      }),
    })
    fetchMemberDetails()
  }

  if (!member) return <div className="text-center mt-10 font-bold text-white">Loading...</div>

  // Total Calculation
  const totalBalance = member.transactions?.reduce((acc, item) => {
    return acc + (Number(item.joma) || 0) - (Number(item.uttolon) || 0)
  }, 0) || 0

  return (
    <div className="bg-blue-800 min-h-screen text-white p-4">
      {/* Header */}
      <nav className="bg-fuchsia-800 p-4 text-center rounded shadow">
        <h1 className="text-2xl font-bold text-yellow-400">{member.name}</h1>
        <p className="text-sm">{member.adress}</p>
        <p className="text-sm">{member.phone}</p>

      </nav>

      {/* Transaction List */}
      <div className="mt-5 space-y-3 max-w-md mx-auto">
        {member.transactions?.map((item) => (
          <div key={item._id} className="bg-amber-500 text-black p-3 rounded-lg flex justify-between items-center font-bold">
            <div>
              <p className="text-xs text-gray-800"> {item.date}</p>
              <div className="flex gap-3 text-sm mt-1">
                <span className="text-green-900">জমা: ৳{item.joma}</span>
                <span className="text-red-900">উত্তোলন: ৳{item.uttolon}</span>
                <span className="text-black-500">comment:-{item.comments}</span>

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
                    setUttolon(item.uttolon)
                    setComments(item.comments)
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

      {/* Total Balance */}
      <div className="mt-6 text-center">
        <div className="inline-block bg-yellow-400 text-black text-2xl font-bold px-6 py-2 rounded-full shadow-lg">
          Total: ৳{totalBalance}
        </div>
      </div>

      {/* Add Button (Admin Only) */}
      {isAdmin && (
        <div className="text-center text-4xl font-bold text-yellow-400 mt-6">
          <button
            onClick={() => {
              setEditingTx(null)
              setDate("")
              setJoma("")
              setUttolon("")
              setComments("")
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
              {editingTx ? "হিসাব এডিট করুন" : "নতুন হিসাব যোগ করুন"}
            </h2>

            {/* Manual Date Input */}
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="তারিখ লিখুন (যেমন: 05/08/2026)"
              className="border w-full p-2 mb-3 rounded"
            />
            <input
              type="number"
              value={joma}
              onChange={(e) => setJoma(e.target.value)}
              placeholder="জমা (৳)"
              className="border w-full p-2 mb-3 rounded"
            />
            <input
              type="number"
              value={uttolon}
              onChange={(e) => setUttolon(e.target.value)}
              placeholder="উত্তোলন (৳)"
              className="border w-full p-2 mb-4 rounded"
            />
             <input
              type="text"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="ENTER COMMENTS"
              className="border w-full p-2 mb-3 rounded"
            />
            <div className="flex justify-between font-bold">
              <button onClick={handleSaveTransaction} className="bg-green-600 text-white px-4 py-2 rounded">
                SAVE
              </button>
              <button onClick={() => setShowpopup(false)} className="bg-gray-500 text-white px-4 py-2 rounded">
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}