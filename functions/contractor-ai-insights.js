export async function onRequest(context) {
    const { request, env } = context

    // Session → contractor
    const cookie = request.headers.get("Cookie") || ""
    const session = cookie.match(/session=([^;]+)/)?.[1]
    if (!session) return unauthorized()

    const sessionData = await env.SESSIONS.get(session, { type: "json" })
    if (!sessionData || sessionData.type !== "contractor") return unauthorized()

    const contractorEmail = sessionData.email

    // Load bids for this contractor
    const list = await env.BIDS.list()
    const bids = []

    for (const item of list.keys) {
        const b = await env.BIDS.get(item.name, { type: "json" })
        if (b && b.contractorEmail === contractorEmail) bids.push(b)
    }

    const totalBids = bids.length
    const totalAmount = bids.reduce((sum, b) => sum + Number(b.amount || 0), 0)
    const avgAmount = totalBids ? totalAmount / totalBids : 0

    // Simple placeholder winRate (later: derive from accepted jobs)
    const winRate = 0.0

    // Ask OpenAI for a short insight summary
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: `You are analyzing a roofing contractor's bidding performance. Here are their stats as JSON: ${JSON.stringify({
                        totalBids,
                        totalAmount,
                        avgAmount,
                        winRate
                    })}. Provide a concise, 3–4 sentence insight with 1–2 specific suggestions to improve performance.`
                }
            ]
        })
    })

    const openaiJson = await openaiRes.json()
    const insightText = openaiJson.choices?.[0]?.message?.content || ""

    return new Response(JSON.stringify({
        totalBids,
        totalAmount,
        avgAmount,
        winRate,
        insight: insightText
    }), {
        headers: { "Content-Type": "application/json" }
    })
}

function unauthorized() {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
    })
}
