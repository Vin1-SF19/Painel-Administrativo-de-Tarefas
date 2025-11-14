// app/api/dated-tasks/toggle/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const t = await prisma.datedTask.findUnique({ where: { id } });
    if (!t) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const updated = await prisma.datedTask.update({
      where: { id },
      data: { done: !t.done },
    });

    return NextResponse.json({ ok: true, task: updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
