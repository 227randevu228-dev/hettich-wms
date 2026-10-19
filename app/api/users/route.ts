import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await auth()
  if (!session || (session.user as any).role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 })
  }
  const { email, name, password, role } = await req.json()
  const hashed = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { email, name, passwordHash: hashed, role, isActive: true }
  })
  return NextResponse.json(user)
}

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json([], { status: 401 })
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } })
  return NextResponse.json(users)
}
