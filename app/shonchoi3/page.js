"use client"
import { useState, useEffect } from "react"
import Link from "next/link"

export default function Shonchoi() {
  const [list, setList] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)
  
  // Modals state
  const [showAddPopup, setShowAddPopup] = useState(false)
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const [editMember, setEditMember] = useState(null) // Edit-এর জন্য মেম্বার অবজেক্ট

  // Form states
  const [name, setName] = useState("")
  const [adress, setAdress] = useState("")
  const [phone, setPhone] = useState("")

  const [pinInput, setPinInput] = useState("")

  useEffect(() => {
    fetchMembers()
    // LocalStorage থেকে Admin স্ট্যাটাস চেক
    const adminState = localStorage.getItem("isAdmin")
    if (adminState === "true") setIsAdmin(true)
  }, [])

  const fetchMembers = async () => {
    try {
      const res = await fetch("/api/members3")
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
      alert(data.message || "ভুল পাসওয়ার্ড!")
    }
  }

  const handleLogout = () => {
    setIsAdmin(false)
    localStorage.removeItem("isAdmin")
  }

  // Add or Edit Member Save
  const handleSaveMember = async (e) => {
    e.preventDefault()
    if (!name || !adress) return alert("সব তথ্য দিন!")

    if (editMember) {
      // Edit mode
      await fetch("/api/members3", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editMember._id, name, adress,phone }),
      })
    } else {
      // Add mode
      await fetch("/api/members3", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, adress ,phone}),
      })
    }

    setName("")
    setAdress("")
    setPhone("")
    setEditMember(null)
    setShowAddPopup(false)
    fetchMembers()
  }

  // Member Delete
  const handleDeleteMember = async (id) => {
    if (!confirm("আপনি কি নিশ্চিত এই মেম্বারটি মুছে ফেলতে চান?")) return
    await fetch("/api/members3", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    fetchMembers()
  }

  // Grand Total Calculation
  const grandTotal = list.reduce((totalAcc, member) => {
    const memberTotal = member.transactions?.reduce((acc, item) => {
      return acc + (Number(item.joma) || 0) - (Number(item.uttolon) || 0)
    }, 0) || 0
    return totalAcc + memberTotal
  }, 0)

  return (
    <div className="bg-blue-800 min-h-screen text-white pb-10 relative">
        <div className="max-w-md mx-auto mb-3">
        <Link href="/" className="text-xs text-yellow-400 hover:underline inline-block font-semibold">
          ← Back to HOME
        </Link>
        </div>
      {/* Header Navigation */}
      <nav className="bg-red-700 py-3 px-4 flex justify-between items-center shadow-md">
        <div className="w-16"></div> {/* Spacer */}
        <h1 className="font-bold text-2xl md:text-3xl text-center">সঞ্চয় হিসাব</h1>
        
        {/* Admin Login/Logout Button */}
        <div>
          {isAdmin ? (
            <button onClick={handleLogout} className="bg-black/40 text-xs px-3 py-1.5 rounded font-bold hover:bg-black/60">
              LOGOUT
            </button>
          ) : (
            <button onClick={() => setShowLoginPopup(true)} className="bg-yellow-400 text-black text-xs px-3 py-1.5 rounded font-bold hover:bg-yellow-300">
              LOGIN
            </button>
          )}
        </div>
      </nav>

      {/* Grand Total */}
      <div className="text-center my-5">
        <div className="inline-block bg-yellow-400 text-black px-6 py-2.5 rounded-2xl shadow-xl font-bold text-xl border-2 border-yellow-500">
          সর্বমোট জমা: ৳ {grandTotal}
        </div>
      </div>

      {/* Member List */}
      <div className="flex flex-col items-center gap-3 px-4">
        {list.map((item) => {
          const memberBalance = item.transactions?.reduce((acc, t) => {
            return acc + (Number(t.joma) || 0) - (Number(t.uttolon) || 0)
          }, 0) || 0

          return (
            <div key={item._id} className="w-full max-w-sm flex items-center gap-2">
              <Link href={`/shonchoi3/${item._id}`} className="flex-1">
                <div className="flex justify-between items-center bg-amber-500 text-black p-3.5 rounded-2xl shadow-lg hover:bg-amber-400 transition">
                  <div>
                    <h1 className="font-bold text-lg">{item.name}</h1>
                     <p className="text-xs text-gray-800">{item.phone}</p>
                    <p className="text-xs text-gray-800">{item.adress}</p>
                  </div>
                  <div className="bg-amber-600 text-white px-3 py-1 rounded-lg font-bold text-sm">
                    ৳ {memberBalance}
                  </div>
                </div>
              </Link>

              {/* Edit & Delete Buttons (Admin Only) */}
              {isAdmin && (
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setEditMember(item)
                      setName(item.name)
                      setAdress(item.adress)
                      setPhone(item.phone)

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
          )
        })}
      </div>

      {/* Add Button (Admin Only) */}
      {isAdmin && (
        <div className="text-center text-4xl font-bold text-red-500 mt-6">
          <button
            onClick={() => {
              setEditMember(null)
              setName("")
              setAdress("")
              setPhone("")
              setShowAddPopup(true)
            }}
            className="bg-white text-red-600 px-4 py-1 rounded-full shadow-lg hover:bg-gray-100"
          >
            +
          </button>
        </div>
      )}

      {/* Add/Edit Member Modal */}
      {showAddPopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white text-black p-5 rounded-lg w-80 shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-center">
              {editMember ? "EDIT MEMBER" : "NEW ENTRY"}
            </h2>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
              className="border w-full p-2 mb-3 rounded"
            />
            <input
              type="text"
              value={adress}
              onChange={(e) => setAdress(e.target.value)}
              placeholder="Enter address"
              className="border w-full p-2 mb-4 rounded"
            />
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="মোবাইল নাম্বার লিখুন "
              className="border w-full p-2 mb-4 rounded"
            />
            <div className="flex justify-between font-bold">
              <button onClick={handleSaveMember} className="bg-green-600 text-white px-4 py-2 rounded">
                SAVE
              </button>
              <button onClick={() => setShowAddPopup(false)} className="bg-gray-500 text-white px-4 py-2 rounded">
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Login Modal */}
      {showLoginPopup && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white text-black p-5 rounded-lg w-80 shadow-2xl">
            <h2 className="text-xl font-bold mb-3 text-center">ADMIN LOGIN</h2>
            <p className="text-xs text-gray-600 mb-3 text-center">৮ অক্ষরের পাসওয়ার্ড পিন টাইপ করুন</p>
            <input
              type="password"
              maxLength={8}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Enter 8 digit code"
              className="border text-center tracking-widest text-lg w-full p-2 mb-4 rounded font-mono"
            />
            <div className="flex justify-between font-bold">
              <button onClick={handleLogin} className="bg-blue-600 text-white px-4 py-2 rounded">
                LOGIN
              </button>
              <button onClick={() => setShowLoginPopup(false)} className="bg-gray-500 text-white px-4 py-2 rounded">
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}