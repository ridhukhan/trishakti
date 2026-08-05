"use client"
import { useState, useEffect, use } from "react"

export default function MemberDetails({ params }) {
  const { id } = use(params)
  const [member, setMember] = useState(null)
  const [showpopup, setShowpopup] = useState(false)

  // Form states
  const [date, setDate] = useState("")
  const [joma, setJoma] = useState("")
  const [uttolon, setUttolon] = useState("")

  useEffect(() => {
    fetchMemberDetails()
  }, [])

  const fetchMemberDetails = async () => {
    const res = await fetch(`/api/members/${id}`)
    const data = await res.json()
    setMember(data)
  }

  const handleSaveTransaction = async (e) => {
    e.preventDefault()
    if (!date) return alert("তারিখ দিন!")

    await fetch(`/api/members/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, joma, uttolon }),
    })

    // Reset Form
    setDate("")
    setJoma("")
    setUttolon("")
    setShowpopup(false)
    fetchMemberDetails() // নতুন হিসাব সহ রিফ্রেশ
  }

  if (!member) return <div className="text-center mt-10 font-bold">Loading...</div>

  // Total Calculation (মোট জমা - মোট উত্তোলন)
  const totalBalance = member.transactions?.reduce((acc, item) => {
    return acc + (item.joma || 0) - (item.uttolon || 0)
  }, 0) || 0

  return (
    <div className="bg-blue-800 min-h-screen text-white p-4">
      {/* Header */}
      <nav className="bg-fuchsia-800 p-4 text-center rounded shadow">
        <h1 className="text-2xl font-bold text-yellow-400">{member.name}</h1>
        <p className="text-sm">{member.adress}</p>
      </nav>

      {/* Transaction List */}
      <div className="mt-5 space-y-3 max-w-md mx-auto">
        {member.transactions?.map((item, index) => (
          <div key={index} className="bg-amber-500 text-black p-3 rounded-lg flex justify-between font-bold">
            <span>📅 {item.date}</span>
            <span className="text-green-800">জমা: ৳{item.joma}</span>
            <span className="text-red-800">উত্তোলন: ৳{item.uttolon}</span>
          </div>
        ))}
      </div>

      {/* Total Balance Display */}
      <div className="mt-6 text-center">
        <div className="inline-block bg-yellow-400 text-black text-2xl font-bold px-6 py-2 rounded-full shadow-lg">
          Total: ৳{totalBalance}
        </div>
      </div>

      {/* Add Button */}
      <div className="text-center text-4xl font-bold text-yellow-400 mt-6">
        <button 
          onClick={() => setShowpopup(true)}
          className="bg-red-600 px-4 py-1 rounded-full shadow-lg hover:bg-red-700"
        >
          +
        </button>
      </div>

      {/* Popup Modal */}
      {showpopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white text-black p-5 rounded-lg w-80 shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-center">নতুন হিসাব যোগ করুন</h2>
            
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
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

            <div className="flex justify-between font-bold">
              <button 
                onClick={handleSaveTransaction}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                SAVE
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