
"use client"
import { useEffect, useState } from "react"

export default function OperationsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [form, setForm] = useState({ productId: "", type: "INBOUND", quantity: "1", comment: "" })

  useEffect(() => { fetch("/api/products").then(r=>r.json()).then(setProducts) }, [])

  async function submit(e: any) {
    e.preventDefault()
    const res = await fetch("/api/stock", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
    if (res.ok) { alert("Операция проведена"); location.reload() }
    else alert("Ошибка: " + await res.text())
  }

  return (
    <div style={{ maxWidth: 600, display: "grid", gap: 16 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800 }}>Приход / Расход</h1>
      <form onSubmit={submit} className="card" style={{ display: "grid", gap: 12 }}>
        <select className="input" value={form.productId} onChange={e=>setForm({...form, productId: e.target.value})} required>
          <option value="">Выберите товар</option>
          {products.map(p => <option key={p.id} value={p.id}>{p.name} — {p.sku} (остаток {p.currentStock})</option>)}
        </select>
        <select className="input" value={form.type} onChange={e=>setForm({...form, type: e.target.value})}>
          <option value="INBOUND">Приход</option>
          <option value="OUTBOUND_SALE">Продажа</option>
          <option value="OUTBOUND_ISSUE">Выдача</option>
          <option value="OUTBOUND_WRITEOFF">Списание</option>
          <option value="ADJUSTMENT">Корректировка</option>
          <option value="RETURN_FROM_CUSTOMER">Возврат от клиента</option>
        </select>
        <input className="input" type="number" placeholder="Количество" value={form.quantity} onChange={e=>setForm({...form, quantity: e.target.value})} required />
        <input className="input" placeholder="Комментарий / № документа" value={form.comment} onChange={e=>setForm({...form, comment: e.target.value})} />
        <button className="btn btn-primary">Провести</button>
      </form>
    </div>
  )
}
