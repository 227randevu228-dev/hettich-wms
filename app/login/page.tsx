
"use client"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("batyr@hettich.uz")
  const [password, setPassword] = useState("Batyr12345!")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const res = await signIn("credentials", { email, password, redirect: false })
    setLoading(false)
    if (res?.error) {
      setError("Неверный email или пароль")
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 20 }}>
      <div className="card" style={{ width: "100%", maxWidth: 380 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Hettich WMS</h1>
        <p style={{ color: "#666", marginBottom: 20, fontSize: 14 }}>Вход на склад фурнитуры</p>
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
          <input className="input" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <input className="input" type="password" placeholder="Пароль" value={password} onChange={e=>setPassword(e.target.value)} required />
          {error && <div style={{ color: "#b00", fontSize: 13 }}>{error}</div>}
          <button className="btn btn-primary" disabled={loading}>{loading ? "Вход..." : "Войти"}</button>
        </form>
        <div style={{ marginTop: 16, fontSize: 12, color: "#888" }}>
          Super admin по умолчанию: batyr@hettich.uz / Batyr12345!
        </div>
      </div>
    </div>
  )
}
