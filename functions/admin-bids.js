export async function onRequest(context) {
    const { env } = context

    // Load all bids
    const list = await env.BIDS.list()
    const bids = []

    for (const item of list.keys) {
        const b = await env.BIDS.get(item.name, { type: "json" })
        if (b) bids.push(b)
    }

    return new Response(JSON.stringify({ bids }), {
        headers: { "Content-Type": "application/json" }
    })
}
