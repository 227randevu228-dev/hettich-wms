"use client"
import { useRouter } from "next/navigation"

export function ProductActions({ id }: { id: string }) {
  const router = useRouter()
  const onDelete = async () => {
    if (!confirm("Точно удалить товар? Это нельзя отменить!")) return
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" })
    if (res.ok) {
      router.refresh()
    } else {
      alert("Ошибка удаления")
    }
  }

  return (
    <div style={{ display: "flex", gap: 6 }}>
      <a href={`/dashboard/products/${id}/edit`} style={{ padding: "4px 8px", background: "#eef", borderRadius: 4, fontSize: 12, textDecoration: "none" }}>Редакт.</a>
      <button onClick={onDelete} style={{ padding: "4px 8px", background: "#fee", color: "#d00", border: "1px solid #fcc", borderRadius: 4, fontSize: 12, cursor: "pointer" }}>Удалить</button>
    </div>
  )
}
