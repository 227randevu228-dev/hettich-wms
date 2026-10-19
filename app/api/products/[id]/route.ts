import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session || (session.user as any).role === "VIEWER") {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 })
  }
  await prisma.product.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "No auth" }, { status: 401 })
  
  const data = await req.json()
  // удаляем поля которые нельзя менять
  delete data.id
  delete data.createdAt

  const updated = await prisma.product.update({
    where: { id: params.id },
    data: data
  })
  return NextResponse.json(updated)
}
