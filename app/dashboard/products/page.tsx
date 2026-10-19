import { prisma } from "@/lib/prisma"
import { ProductActions } from "./ProductActions"
import Link from "next/link"

export default async function ProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { updatedAt: "desc" }, take: 100, include: { category: true } })
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Товары</h1>
        <Link href="/dashboard/products/new" className="btn btn-primary">+ Новый товар</Link>
      </div>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="table">
          <thead><tr><th>SKU</th><th>Название</th><th>Категория</th><th>Остаток</th><th>Цена продажи</th><th>Статус</th><th>Действия</th></tr></thead>
          <tbody>
            {products.map((p: any) => (
              <tr key={p.id}>
                <td style={{ fontFamily: "monospace", fontSize: 12 }}>{p.sku}</td>
                <td><Link href={`/dashboard/products/${p.id}`} style={{ fontWeight: 600, textDecoration: "underline" }}>{p.name}</Link><div style={{ opacity: 0.5, fontSize: 11 }}>{p.manufacturerArticle}</div></td>
                <td>{p.category?.name || "-"}</td>
                <td style={{ fontWeight: 700, color: p.currentStock <= p.minStock ? "#d00" : "#111" }}>{p.currentStock} {p.unit}</td>
                <td>{String(p.salePrice)} {p.currency}</td>
                <td><span className="badge">{p.status}</span></td>
                <td><ProductActions id={p.id} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <div style={{ padding: 30, textAlign: "center", opacity: 0.5 }}>Товаров пока нет. Создайте первый.</div>}
      </div>
    </div>
  )
}
