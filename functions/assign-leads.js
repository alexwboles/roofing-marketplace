export async function onRequestPost(context) {
    const { request, env } = context
    const lead = await request.json()

    if (!lead || !lead.id || !lead.zip) {
        return new Response("Invalid lead data", { status: 400 })
    }

    // Load all contractors
    const list = await env.CONTRACTORS.list()
    const contractors = []

    for (const item of list.keys) {
        const c = await env.CONTRACTORS.get(item.name, { type: "json" })
        if (c) contractors.push(c)
    }

    // Filter by service area
    const eligible = contractors.filter(c => {
        if (!c.serviceArea) return false
        const zips = c.serviceArea.split(",").map(z => z.trim())
        return zips.includes(lead.zip)
    })

    // Filter by approval
    const approved = eligible.filter(c => c.verificationStatus === "approved")

    // Filter by subscription
    const subscribed = approved.filter(c =>
        ["active", "trial"].includes(c.subscriptionStatus)
    )

    if (subscribed.length === 0) {
        return new Response(JSON.stringify({ assigned: null }), {
            headers: { "Content-Type": "application/json" }
        })
    }

    // Sort by least recently assigned
    subscribed.sort((a, b) => {
        return (a.lastAssignedAt || 0) - (b.lastAssignedAt || 0)
    })

    const assigned = subscribed[0]

    // Update contractor assignment timestamp
    assigned.lastAssignedAt = Date.now()
    await env.CONTRACTORS.put(assigned.email, JSON.stringify(assigned))

    // Store lead assignment
    await env.LEAD_ASSIGNMENTS.put(
        lead.id,
        JSON.stringify({
            lead,
            contractorEmail: assigned.email,
            assignedAt: Date.now()
        })
    )

    return new Response(JSON.stringify({ assigned }), {
        headers: { "Content-Type": "application/json" }
    })
}
