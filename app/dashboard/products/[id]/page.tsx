
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

export default async function ProductDetail({ params }: { params: { id: string } }) {
  const p = await prisma.product.findUnique({ where: { id: params.id }, include: { operations: { orderBy: { createdAt: "desc" }, take: 20, include: { user: true } } } })
  if (!p) return notFound()
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h1 style={{ fontSize: 24, fontWeight: 800 }}>{p.name}</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="card">
          <div>SKU: <b>{p.sku}</b></div>
          <div>Артикул Hettich: <b>{p.manufacturerArticle}</b></div>
          <div>Остаток: <b style={{ fontSize: 22 }}>{p.currentStock} {p.unit}</b></div>
          <div>Закупка: {String(p.purchasePrice)} | Продажа: {String(p.salePrice)} {p.currency}</div>
          <div>Мин. остаток: {p.minStock}</div>
          <div>Статус: {p.status}</div>
        </div>
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Операции</h3>
          {p.operations.map(op => (
            <div key={op.id} style={{ padding: "8px 0", borderBottom: "1px solid #eee", fontSize: 13 }}>
              {new Date(op.createdAt).toLocaleString("ru-RU")} — {op.type} — {op.quantity} — остаток {op.resultingStock} — {op.user.name}
            </div>
          ))}
          {p.operations.length === 0 && <div style={{ opacity: 0.5 }}>Нет операций</div>}
        </div>
      </div>
      <form action={`/api/products/${p.id}/stock`} method="post" style={{ display: "none" }} />
    </div>
  )
}
