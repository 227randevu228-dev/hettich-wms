import { auth, signOut } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect("/login")
  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: "100vh" }}>
      <aside style={{ background: "#111", color: "white", padding: 20, display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ fontWeight: 800, fontSize: 18 }}>HETTICH WMS</div>
        <div style={{ fontSize: 12, opacity: 0.6 }}>{session.user?.email}<br/>{(session.user as any)?.role}</div>
        <nav style={{ display: "grid", gap: 8 }}>
          <Link href="/dashboard" style={{ padding: "8px 10px", background: "#222", borderRadius: 8, textDecoration: "none", color: "white" }}>📦 Склад</Link>
          <Link href="/dashboard/products" style={{ padding: "8px 10px", borderRadius: 8, textDecoration: "none", color: "white" }}>🗂 Товары</Link>
          <Link href="/dashboard/operations" style={{ padding: "8px 10px", borderRadius: 8, textDecoration: "none", color: "white" }}>📋 Операции</Link>
          <Link href="/dashboard/users" style={{ padding: "8px 10px", borderRadius: 8, textDecoration: "none", color: "white" }}>👥 Пользователи</Link>
        </nav>
        <form 
          action={async () => {
            "use server"
            await signOut({ redirectTo: "/login" })
          }} 
          style={{ marginTop: "auto" }}
        >
          <button type="submit" className="btn btn-ghost" style={{ width: "100%", background: "#222", color: "white", padding: "8px", borderRadius: 8, border: "1px solid #333", cursor: "pointer" }}>Выйти</button>
        </form>
      </aside>
      <main style={{ padding: 24 }}>{children}</main>
    </div>
  )
}
