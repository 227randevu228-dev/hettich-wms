
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return new NextResponse("UNAUTHORIZED", { status: 401 })
  const body = await req.json()
  try {
    const product = await prisma.product.create({
      data: {
        sku: body.sku,
        manufacturerArticle: body.manufacturerArticle,
        name: body.name,
        purchasePrice: body.purchasePrice || 0,
        salePrice: body.salePrice || 0,
        currentStock: parseInt(body.currentStock || "0"),
        unit: body.unit || "шт",
        currency: "UZS"
      }
    })
    return NextResponse.json(product)
  } catch (e: any) {
    return new NextResponse(e.message, { status: 400 })
  }
}
export async function GET() {
  const products = await prisma.product.findMany({ orderBy: { name: "asc" } })
  return NextResponse.json(products)
}
