import { NextResponse } from "next/server";
import {connectDB} from "@/lib/mongodb1"; // আপনার প্রজেক্টের DB কানেকশন পাথ
import Note from "@/models/note"; // আপনার Note মডেলের পাথ

export async function GET() {
  try {
    await connectDB();
    const note = await Note.findOne({});
    return NextResponse.json({ text: note ? note.text : "" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch note" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const { text } = await req.json();

    // ডাটাবেজে আগে কোনো নোট থাকলে সেটি আপডেট হবে, না থাকলে নতুন তৈরি হবে (Single Note)
    const existingNote = await Note.findOne({});
    if (existingNote) {
      existingNote.text = text;
      await existingNote.save();
    } else {
      await Note.create({ text });
    }

    return NextResponse.json({ message: "Note saved successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save note" }, { status: 500 });
  }
}