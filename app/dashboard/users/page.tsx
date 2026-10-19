
import { prisma } from "@/lib/prisma"

export default async function UsersPage() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } })
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800 }}>Пользователи</h1>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="table">
          <thead><tr><th>Email</th><th>Имя</th><th>Роль</th><th>Активен</th><th>Создан</th></tr></thead>
          <tbody>{users.map(u => <tr key={u.id}><td>{u.email}</td><td>{u.name}</td><td>{u.role}</td><td>{u.isActive ? "Да" : "Нет"}</td><td>{new Date(u.createdAt).toLocaleDateString()}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  )
}
