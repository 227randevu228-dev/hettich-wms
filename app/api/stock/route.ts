
import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { executeStockOperation } from "@/lib/stock"

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return new NextResponse("UNAUTHORIZED", { status: 401 })
  const body = await req.json()
  try {
    const op = await executeStockOperation({
      productId: body.productId,
      type: body.type,
      quantity: parseInt(body.quantity),
      userId: (session.user as any).id,
      comment: body.comment,
      documentNumber: body.documentNumber
    })
    return NextResponse.json(op)
  } catch (e: any) {
    return new NextResponse(e.message, { status: 400 })
  }
}
