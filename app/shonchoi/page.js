"use client"
import { useState, useEffect } from "react"
import Link from "next/link"

export default function Shonchoi() {
  const [showpopup, setShowpopup] = useState(false)
  const [name, setName] = useState("")
  const [adress, setAdress] = useState("")
  const [list, setList] = useState([])

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      const res = await fetch("/api/members")
      const data = await res.json()
      setList(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch members:", error)
    }
  }

  const popup = (e) => {
    e.preventDefault()
    setShowpopup(true)
  }

  const handlesave = async (e) => {
    e.preventDefault()
    if (!name || !adress) {
      return alert("সব তথ্য পূরণ করুন!")
    }

    await fetch("/api/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, adress }),
    })

    setName("")
    setAdress("")
    setShowpopup(false)
    fetchMembers() // নতুন member সহ list আবার লোড হবে
  }

  // 🔥 সব মেম্বারের মোট ব্যালেন্স হিসাব করার লজিক (মোট জমা - মোট উত্তোলন)
  const grandTotal = list.reduce((totalAcc, member) => {
    const memberTotal = member.transactions?.reduce((acc, item) => {
      return acc + (Number(item.joma) || 0) - (Number(item.uttolon) || 0)
    }, 0) || 0
    return totalAcc + memberTotal
  }, 0)

  return (
    <div className="bg-blue-800 min-h-screen text-white pb-10">
      {/* Header Navigation */}
      <nav className="bg-red-700 py-3 font-bold text-center text-3xl shadow-md">
        <h1>সঞ্চয় হিসাব</h1>
      </nav>

      {/* 💰 সর্বমোট জমা ব্যালেন্স ডিসপ্লে */}
      <div className="text-center my-5">
        <div className="inline-block bg-yellow-400 text-black px-6 py-3 rounded-2xl shadow-xl font-bold text-2xl border-2 border-yellow-500">
          সর্বমোট জমা: ৳ {grandTotal}
        </div>
      </div>

      {/* Member List */}
      <div className="flex flex-col items-center gap-3">
        {list.map((item) => {
          // প্রতিটি মেম্বারের নিজস্ব ব্যালেন্স হিসাব
          const memberBalance = item.transactions?.reduce((acc, t) => {
            return acc + (Number(t.joma) || 0) - (Number(t.uttolon) || 0)
          }, 0) || 0

          return (
            <Link key={item._id} href={`/shonchoi/${item._id}`} className="w-80">
              <div className="flex justify-between items-center bg-amber-500 text-black p-4 rounded-2xl shadow-lg hover:bg-amber-400 transition">
                <div>
                  <h1 className="font-bold text-xl">{item.name}</h1>
                  <p className="text-sm text-gray-800">{item.adress}</p>
                </div>
                <div className="bg-amber-600 px-3 py-1 rounded-lg font-bold text-sm">
                  ৳ {memberBalance}
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Plus Button */}
      <div className="text-center text-4xl font-bold text-red-500 mt-6">
        <button 
          onClick={popup}
          className="bg-white px-4 py-1 rounded-full shadow-lg hover:bg-gray-200"
        >
          +
        </button>
      </div>

      {/* Add New Member Modal */}
      {showpopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white text-black p-5 rounded-lg w-80 shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-center">NEW ENTRY</h2>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
              className="border w-full p-2 mb-3 rounded"
            />
            <input
              type="text"
              name="address"
              value={adress}
              onChange={(e) => setAdress(e.target.value)}
              placeholder="Enter address"
              className="border w-full p-2 mb-4 rounded"
            />
            <div className="flex justify-between font-bold">
              <button 
                onClick={handlesave}
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