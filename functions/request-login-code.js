export async function onRequestPost(context) {
    const { request, env } = context
    const { email, type } = await request.json() // type: contractor | client

    if (!email || !type) {
        return new Response("Email and type required", { status: 400 })
    }

    // Generate 6‑digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // Store in KV for 10 minutes
    await env.LOGIN_CODES.put(
        `${type}:${email}`,
        JSON.stringify({
            code,
            expiresAt: Date.now() + 10 * 60 * 1000
        }),
        { expirationTtl: 600 }
    )

    // For now, log the code (later: email/SMS)
    console.log(`Login code for ${type} ${email}: ${code}`)

    return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" }
    })
}
