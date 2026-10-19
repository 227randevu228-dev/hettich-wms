
import { prisma } from "@/lib/prisma"

export default async function DashboardPage() {
  const [productsCount, lowStock, opsToday, usersCount] = await Promise.all([
    prisma.product.count({ where: { status: "ACTIVE" } }),
    prisma.product.count({ where: { status: "ACTIVE", currentStock: { lte: 5 } } }),
    prisma.stockOperation.count({ where: { createdAt: { gte: new Date(new Date().setHours(0,0,0,0)) } } }),
    prisma.user.count()
  ])

  const latestOps = await prisma.stockOperation.findMany({ orderBy: { createdAt: "desc" }, take: 10, include: { product: true, user: true } })

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>Обзор склада</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <div className="card"><div style={{ opacity: 0.6, fontSize: 12 }}>Товаров активно</div><div style={{ fontSize: 28, fontWeight: 800 }}>{productsCount}</div></div>
        <div className="card"><div style={{ opacity: 0.6, fontSize: 12 }}>Низкий остаток ≤5</div><div style={{ fontSize: 28, fontWeight: 800, color: lowStock ? "#d00" : "#111" }}>{lowStock}</div></div>
        <div className="card"><div style={{ opacity: 0.6, fontSize: 12 }}>Операций сегодня</div><div style={{ fontSize: 28, fontWeight: 800 }}>{opsToday}</div></div>
        <div className="card"><div style={{ opacity: 0.6, fontSize: 12 }}>Пользователей</div><div style={{ fontSize: 28, fontWeight: 800 }}>{usersCount}</div></div>
      </div>

      <div className="card">
        <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Последние операции</h3>
        <table className="table">
          <thead><tr><th>Дата</th><th>Товар</th><th>Тип</th><th>Кол-во</th><th>Остаток</th><th>Пользователь</th></tr></thead>
          <tbody>
            {latestOps.map(o => (
              <tr key={o.id}>
                <td>{new Date(o.createdAt).toLocaleString("ru-RU")}</td>
                <td>{o.product.name}<div style={{ opacity: 0.5, fontSize: 11 }}>{o.product.sku}</div></td>
                <td><span className="badge">{o.type}</span></td>
                <td>{o.quantity}</td>
                <td>{o.resultingStock}</td>
                <td>{o.user.name}</td>
              </tr>
            ))}
            {latestOps.length === 0 && <tr><td colSpan={6} style={{ textAlign: "center", opacity: 0.5, padding: 20 }}>Пока нет операций — создайте товар и сделайте приход</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
