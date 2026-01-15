export async function onRequestPost(context) {
    const { request, env } = context
    const { contractorEmail, status } = await request.json()

    if (!contractorEmail || !status) {
        return new Response("Missing fields", { status: 400 })
    }

    const contractor = await env.CONTRACTORS.get(contractorEmail, { type: "json" })
    if (!contractor) {
        return new Response("Contractor not found", { status: 404 })
    }

    contractor.verificationStatus = status

    await env.CONTRACTORS.put(contractorEmail, JSON.stringify(contractor))

    return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" }
    })
}
