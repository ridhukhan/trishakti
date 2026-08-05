import { NextResponse } from "next/server"

export async function POST(req) {
  try {
    const { pin } = await req.json()
    const adminPin = process.env.ADMIN_PIN// ডিফল্ট পিন (আপনার ইচ্ছেমতো পরিবর্তন করুন)

    if (pin === adminPin) {
      return NextResponse.json({ success: true, message: "Admin authenticated" }, { status: 200 })
    } else {
      return NextResponse.json({ success: false, message: "ভুল পাসওয়ার্ড!" }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}