import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("REQ BODY:", body);

    const { taskName, date } = body;

    const parsedDate = new Date(date);
    console.log("PARSED DATE:", parsedDate);

    const task = await prisma.task.create({
      data: {
        task: taskName,
        title: taskName,
        date: parsedDate,
        done: false,
      },
    });

    console.log("TASK CREATED:", task);

    return NextResponse.json({ success: true, task });
  } catch (err) {
    console.error("API ERROR:", err);
    return NextResponse.json({ error: "Erro" }, { status: 500 });
  }
}
