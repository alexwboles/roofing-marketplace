export async function onRequest(context) {
    const { env } = context

    // Load all contractors
    const list = await env.CONTRACTORS.list()
    const contractors = []

    for (const item of list.keys) {
        const c = await env.CONTRACTORS.get(item.name, { type: "json" })
        if (c) contractors.push(c)
    }

    return new Response(JSON.stringify({ contractors }), {
        headers: { "Content-Type": "application/json" }
    })
}
