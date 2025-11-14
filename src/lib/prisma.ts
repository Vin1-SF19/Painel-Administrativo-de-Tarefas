// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // allow global `var` across module reloads in dev
  // eslint-disable-next-line no-var
  var __prisma__: PrismaClient | undefined;
}

export const prisma =
  global.__prisma__ ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query"] : [],
  });

if (process.env.NODE_ENV !== "production") global.__prisma__ = prisma;
