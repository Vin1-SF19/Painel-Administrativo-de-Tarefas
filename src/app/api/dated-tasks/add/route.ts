// app/api/dated-tasks/add/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { title, date } = await req.json();
    if (!title || !date) return NextResponse.json({ error: "Missing" }, { status: 400 });

    const dt = new Date(date);
    dt.setHours(0,0,0,0);

    const today = new Date();
    today.setHours(0,0,0,0);
    if (dt < today) return NextResponse.json({ error: "Cannot add to past" }, { status: 400 });

    const task = await prisma.datedTask.create({
      data: { title, date: dt, done: false },
    });

    return NextResponse.json({ ok: true, task });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
