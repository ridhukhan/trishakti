'use client'
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Note() {
  const [fulltext, setFulltext] = useState("")
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  
  const router = useRouter()

  // Admin Check & Fetch Note Data
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin")
    if (!isAdmin) {
      router.push("/")
      return
    }

    fetch("/api/note")
      .then((res) => res.json())
      .then((data) => {
        setFulltext(data.text || "")
        setFetching(false)
      })
      .catch(() => setFetching(false))
  }, [router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: fulltext }),
      })

      if (res.ok) {
        alert("নোট সফলভাবে সংরক্ষণ করা হয়েছে!")
      } else {
        alert("সংরক্ষণ করতে সমস্যা হয়েছে।")
      }
    } catch (err) {
      alert("Error saving note")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="bg-slate-900 h-screen text-white flex items-center justify-center font-sans">
        <p className="text-xl font-semibold">loading...</p>
      </div>
    )
  }

  return (
    <div className="bg-slate-900 h-screen w-full text-white p-4 md:p-6 font-sans flex flex-col overflow-hidden">
      <div className="w-full h-full bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl flex flex-col">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-700">
          <h1 className="text-2xl md:text-3xl font-bold text-amber-400">
            📝 Personal Notebook
          </h1>
          <button
            type="submit"
            form="note-form"
            disabled={loading}
            className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2 px-6 rounded-xl transition duration-200 disabled:opacity-50"
          >
            {loading ? "saving..." : "Save Note"}
          </button>
        </div>
        
        {/* Full Height Form */}
        <form id="note-form" onSubmit={handleSubmit} className="flex-1 flex flex-col w-full h-full">
          <textarea
            value={fulltext}
            onChange={(e) => setFulltext(e.target.value)}
            className="w-full h-full flex-1 bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-400 font-mono leading-relaxed resize-none"
            placeholder="Type your notes here..."
          />
        </form>
      </div>
    </div>
  )
}