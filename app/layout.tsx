
import "./globals.css"
export const metadata = { title: "Hettich WMS", description: "Склад Hettich и Blum" }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}
