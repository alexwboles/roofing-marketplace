export async function onRequest(context) {
    const { env } = context

    const list = await env.BIDS.list()
    const bids = []

    for (const item of list.keys) {
        const bid = await env.BIDS.get(item.name, { type: "json" })
        if (bid) bids.push(bid)
    }

    return new Response(JSON.stringify({ bids }), {
        headers: { "Content-Type": "application/json" }
    })
}
