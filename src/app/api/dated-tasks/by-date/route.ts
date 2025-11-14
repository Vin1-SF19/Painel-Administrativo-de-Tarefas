// app/api/dated-tasks/by-date/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const dateStr = url.searchParams.get("date"); // 'YYYY-MM-DD'
    if (!dateStr) return NextResponse.json({ error: "Missing date" }, { status: 400 });

    const start = new Date(dateStr);
    start.setHours(0,0,0,0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const tasks = await prisma.datedTask.findMany({
      where: { date: { gte: start, lt: end } },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ ok: true, tasks });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
