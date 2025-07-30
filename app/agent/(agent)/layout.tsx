


export default function AgentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>

        <main>{children}</main>
      </body>
    </html>
  )
}