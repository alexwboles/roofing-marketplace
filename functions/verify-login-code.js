export async function onRequestPost(context) {
    const { request, env } = context
    const { email, code, type } = await request.json()

    if (!email || !code || !type) {
        return new Response("Missing fields", { status: 400 })
    }

    // Retrieve stored login code
    const record = await env.LOGIN_CODES.get(`${type}:${email}`, { type: "json" })

    if (!record || record.code !== code || Date.now() > record.expiresAt) {
        return new Response("Invalid or expired code", { status: 401 })
    }

    let user

    // Contractor login
    if (type === "contractor") {
        user = await env.CONTRACTORS.get(email, { type: "json" }) || {
            email,
            verificationStatus: "pending",
            subscriptionStatus: "trial",
            createdAt: Date.now()
        }

        await env.CONTRACTORS.put(email, JSON.stringify(user))
    }

    // Client login
    if (type === "client") {
        user = await env.CLIENTS.get(email, { type: "json" }) || {
            email,
            createdAt: Date.now()
        }

        await env.CLIENTS.put(email, JSON.stringify(user))
    }

    // Create session token
    const sessionToken = crypto.randomUUID()

    await env.SESSIONS.put(
        sessionToken,
        JSON.stringify({ email, type }),
        { expirationTtl: 60 * 60 * 24 * 7 } // 7 days
    )

    return new Response(JSON.stringify({ success: true }), {
        headers: {
            "Content-Type": "application/json",
            "Set-Cookie": `session=${sessionToken}; Path=/; HttpOnly; Secure; SameSite=Lax`
        }
    })
}
