
"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function NewProductPage() {
  const router = useRouter()
  const [form, setForm] = useState({ sku: "", manufacturerArticle: "", name: "", purchasePrice: "0", salePrice: "0", currentStock: "0", unit: "шт" })
  const [loading, setLoading] = useState(false)

  async function submit(e: any) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
    setLoading(false)
    if (res.ok) router.push("/dashboard/products")
    else alert("Ошибка: " + await res.text())
  }

  return (
    <div style={{ maxWidth: 600 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Новый товар</h1>
      <form onSubmit={submit} className="card" style={{ display: "grid", gap: 12 }}>
        <input className="input" placeholder="SKU (уникальный, например HETT-001)" value={form.sku} onChange={e=>setForm({...form, sku: e.target.value})} required />
        <input className="input" placeholder="Артикул производителя (Hettich)" value={form.manufacturerArticle} onChange={e=>setForm({...form, manufacturerArticle: e.target.value})} required />
        <input className="input" placeholder="Название товара" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} required />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <input className="input" type="number" step="0.01" placeholder="Закупка" value={form.purchasePrice} onChange={e=>setForm({...form, purchasePrice: e.target.value})} />
          <input className="input" type="number" step="0.01" placeholder="Продажа" value={form.salePrice} onChange={e=>setForm({...form, salePrice: e.target.value})} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <input className="input" type="number" placeholder="Начальный остаток" value={form.currentStock} onChange={e=>setForm({...form, currentStock: e.target.value})} />
          <input className="input" placeholder="Ед. изм. (шт, компл.)" value={form.unit} onChange={e=>setForm({...form, unit: e.target.value})} />
        </div>
        <button className="btn btn-primary" disabled={loading}>{loading ? "Создание..." : "Создать товар"}</button>
      </form>
    </div>
  )
}
