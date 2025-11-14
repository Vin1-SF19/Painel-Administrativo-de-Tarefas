export async function POST(req) {
  const { user, pass } = await req.json()

  if (user === process.env.LOGIN_USER && pass === process.env.LOGIN_PASS) {
    // Cria o cookie "auth" para marcar que está logado
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        "Set-Cookie": `auth=1; Path=/; HttpOnly; SameSite=Lax;`,
        "Content-Type": "application/json",
      },
    })
  }

  return new Response(JSON.stringify({ ok: false }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  })
}
