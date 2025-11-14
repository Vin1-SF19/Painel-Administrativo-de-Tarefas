// app/api/dated-tasks/list/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const tasks = await prisma.datedTask.findMany({ orderBy: { date: "asc" } });
    return NextResponse.json({ ok: true, tasks });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
