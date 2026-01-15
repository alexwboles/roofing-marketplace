export async function onRequest(context) {
    const { env } = context

    const bidsList = await env.BIDS.list()
    const stats = {}

    for (const item of bidsList.keys) {
        const bid = await env.BIDS.get(item.name, { type: "json" })
        if (!bid) continue

        const email = bid.contractorEmail
        if (!stats[email]) {
            stats[email] = { email, bids: 0, totalAmount: 0 }
        }

        stats[email].bids += 1
        stats[email].totalAmount += Number(bid.amount || 0)
    }

    const contractorsList = await env.CONTRACTORS.list()
    const leaderboard = []

    for (const item of contractorsList.keys) {
        const c = await env.CONTRACTORS.get(item.name, { type: "json" })
        if (!c) continue

        const s = stats[c.email] || { bids: 0, totalAmount: 0 }
        leaderboard.push({
            email: c.email,
            businessName: c.businessName || c.email,
            bids: s.bids,
            totalAmount: s.totalAmount,
            verificationStatus: c.verificationStatus,
            subscriptionStatus: c.subscriptionStatus
        })
    }

    leaderboard.sort((a, b) => b.bids - a.bids)

    return new Response(JSON.stringify({ leaderboard }), {
        headers: { "Content-Type": "application/json" }
    })
}
