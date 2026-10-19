import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await prisma.product.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json()
  delete data.id
  const updated = await prisma.product.update({
    where: { id: params.id },
    data: data
  })
  return NextResponse.json(updated)
}
