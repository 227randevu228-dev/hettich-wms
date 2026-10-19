"use client"
import { useState, useEffect } from "react"

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [form, setForm] = useState({ email: "", name: "", password: "", role: "STOREKEEPER" })
  const [loading, setLoading] = useState(false)

  const load = async () => {
    const res = await fetch("/api/users")
    const data = await res.json()
    setUsers(Array.isArray(data) ? data : [])
  }
  useEffect(() => { load() }, [])

  const submit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch("/api/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
    if (res.ok) {
      setForm({ email: "", name: "", password: "", role: "STOREKEEPER" })
      load()
    } else {
      alert("Ошибка: " + JSON.stringify(await res.json()))
    }
    setLoading(false)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Пользователи</h1>
      <form onSubmit={submit} className="bg-white p-4 rounded shadow mb-6 flex gap-3 flex-wrap">
        <input required placeholder="Email" className="border p-2 rounded" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} autoComplete="off" />
        <input required placeholder="Имя" className="border p-2 rounded" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} autoComplete="off" />
        <input required type="password" placeholder="Пароль" className="border p-2 rounded" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} autoComplete="new-password" />
        <select className="border p-2 rounded" value={form.role} onChange={e=>setForm({...form, role:e.target.value})}>
          <option value="STOREKEEPER">Кладовщик</option>
          <option value="MANAGER">Менеджер</option>
          <option value="VIEWER">Наблюдатель</option>
          <option value="SUPER_ADMIN">Главный админ</option>
        </select>
        <button disabled={loading} className="bg-black text-white px-4 py-2 rounded">{loading ? "..." : "Добавить"}</button>
      </form>
      <div className="bg-white rounded shadow">
        {users.map((u:any)=><div key={u.id} className="flex justify-between p-3 border-b"><span>{u.email} - {u.name}</span><span className="bg-gray-100 px-2 rounded text-sm">{u.role}</span></div>)}
      </div>
    </div>
  )
}
