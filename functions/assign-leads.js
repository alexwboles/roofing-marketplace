export async function onRequestPost(context) {
    const { request, env } = context
    const lead = await request.json()

    const allContractors = await env.CONTRACTORS.list()
    const contractors = []

    for (const item of allContractors.keys) {
        const c = await env.CONTRACTORS.get(item.name, { type: "json" })
        if (!c) continue

        if (c.verificationStatus !== "approved") continue
        if (!["trial", "active"].includes(c.subscriptionStatus)) continue

        const zips = (c.serviceArea || "").split(",").map(z => z.trim())
        if (!zips.includes(lead.zip)) continue

        contractors.push(c)
    }

    contractors.sort((a, b) => (a.lastAssignedAt || 0) - (b.lastAssignedAt || 0))

    const assigned = contractors.slice(0, 3)

    for (const c of assigned) {
        await env.LEAD_ASSIGNMENTS.put(
            `${lead.id}:${c.email}`,
            JSON.stringify({ lead, contractor: c.email })
        )

        c.lastAssignedAt = Date.now()
        await env.CONTRACTORS.put(c.email, JSON.stringify(c))
    }

    return new Response(JSON.stringify({ assigned }), {
        headers: { "Content-Type": "application/json" }
    })
}

