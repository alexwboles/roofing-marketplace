export async function onRequest(context) {
    const { env } = context

    // Load all bids
    const list = await env.BIDS.list()
    const bids = []

    for (const item of list.keys) {
        const b = await env.BIDS.get(item.name, { type: "json" })
        if (b) bids.push(b)
    }

    // Aggregate by contractor
    const totals = {}

    for (const bid of bids) {
        if (!totals[bid.contractorEmail]) {
            totals[bid.contractorEmail] = {
                contractorEmail: bid.contractorEmail,
                bids: 0,
                totalAmount: 0
            }
        }

        totals[bid.contractorEmail].bids += 1
        totals[bid.contractorEmail].totalAmount += Number(bid.amount || 0)
    }

    // Load contractor profiles
    const contractorList = await env.CONTRACTORS.list()
    const contractors = {}

    for (const item of contractorList.keys) {
        const c = await env.CONTRACTORS.get(item.name, { type: "json" })
        if (c) contractors[item.name] = c
    }

    // Build leaderboard rows
    const leaderboard = Object.values(totals)
        .map(row => ({
            ...row,
            businessName: contractors[row.contractorEmail]?.businessName || row.contractorEmail
        }))
        .sort((a, b) => b.totalAmount - a.totalAmount)

    return new Response(JSON.stringify({ leaderboard }), {
        headers: { "Content-Type": "application/json" }
    })
}
