import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        date: {
          not: null,
        },
      },
      select: {
        id: true,
        task: true,
        date: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Erro ao carregar tasks do calendário:", error);
    return NextResponse.error();
  }
}
