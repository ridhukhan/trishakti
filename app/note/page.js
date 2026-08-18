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
      <div className="bg-slate-900 h-screen w-screen text-white flex items-center justify-center font-sans">
        <p className="text-xl font-semibold">loading...</p>
      </div>
    )
  }

  return (
    <div className="bg-slate-900 h-screen w-screen font-sans flex flex-col overflow-hidden">
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col h-full w-full">
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 px-6 rounded-xl transition duration-200 disabled:opacity-50"
          >
            {loading ? "saving..." : "Save Note"}
          </button>
        </div>
        {/* Full Screen Textarea (Top to Bottom gap space reduced) */}
        <textarea
          value={fulltext}
          onChange={(e) => setFulltext(e.target.value)}
          className="w-full flex-1 bg-slate-900 text-slate-100 p-4 border-none
           focus:outline-none font-mono leading-relaxed resize-none"
          placeholder="Type your notes here..."
        />

        
      </form>
    </div>
  )
}