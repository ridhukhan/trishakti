'use client'
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation" // ✅ সঠিক Import

export default function Note() {
  const [fulltext, setFulltext] = useState("")
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  
  const router = useRouter() // ✅ useRouter() ব্যবহার করা হয়েছে

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
        alert("ur note is sucessfuly saved in database")
      } else {
        alert("fuck u broo..")
      }
    } catch (err) {
      alert("Error saving note")
    }  finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="bg-slate-900 min-h-screen text-white flex items-center justify-center font-sans">
        <p className="text-xl font-semibold">loading...</p>
      </div>
    )
  }

  return (
    <div className="bg-slate-900 min-h-screen text-white p-4 md:p-8 font-sans flex flex-col items-center">
      <div className="w-full max-w-4xl bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl">
        <h1 className="text-2xl md:text-3xl font-bold text-amber-400 mb-4 text-center">
          📝 Notebook
        </h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            value={fulltext}
            onChange={(e) => setFulltext(e.target.value)}
            className="w-full h-96 bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-400 font-mono leading-relaxed resize-y"
            placeholder="type unlimited text ..."
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 px-6 rounded-xl transition duration-200 disabled:opacity-50"
          >
            {loading ? "saving..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  )
}