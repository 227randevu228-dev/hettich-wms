import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { revalidatePath } from "next/cache"

async function deleteProduct(formData: FormData) {
  "use server"
  const id = formData.get("id") as string
  if (!id) return
  try {
    await prisma.$transaction(async (tx: any) => {
      try { await tx.stockMovement?.deleteMany({ where: { productId: id } }) } catch {}
      try { await tx.inventoryMovement?.deleteMany({ where: { productId: id } }) } catch {}
      try { await tx.inventoryTransaction?.deleteMany({ where: { productId: id } }) } catch {}
      try { await tx.orderItem?.deleteMany({ where: { productId: id } }) } catch {}
      await tx.product.delete({ where: { id } })
    })
  } catch (e) {
    await prisma.product.update({ where: { id }, data: { status: "ARCHIVED" as any } })
  }
  revalidatePath("/dashboard/products")
}

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
          <thead><tr><th>SKU</th><th>Название</th><th>Категория</th><th>Остаток</th><th>Цена продажи</th><th>Статус</th><th style={{ textAlign: "right" }}>Действия</th></tr></thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td style={{ fontFamily: "monospace", fontSize: 12 }}>{p.sku}</td>
                <td><Link href={`/dashboard/products/${p.id}`} style={{ fontWeight: 600, textDecoration: "underline" }}>{p.name}</Link><div style={{ opacity: 0.5, fontSize: 11 }}>{p.manufacturerArticle}</div></td>
                <td>{p.category?.name || "-"}</td>
                <td style={{ fontWeight: 700 }}>{p.currentStock} {p.unit}</td>
                <td>{String(p.salePrice)} {p.currency}</td>
                <td><span className="badge">{p.status}</span></td>
                <td>
                  <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <Link href={`/dashboard/products/${p.id}/edit`} style={{ padding: "4px 8px", border: "1px solid #ddd", borderRadius: 6, fontSize: 12, textDecoration: "none" }}>Редакт.</Link>
                    <form action={deleteProduct}>
                      <input type="hidden" name="id" value={p.id} />
                      <button type="submit" style={{ padding: "4px 8px", border: "1px solid #f99", background: "#fff0f0", borderRadius: 6, fontSize: 12, cursor: "pointer" }}>Удалить</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
