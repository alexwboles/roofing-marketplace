export async function onRequestPost(context) {
    const { request } = context
    const { roof } = await request.json()

    if (!roof || !roof.estimatedSqFt) {
        return new Response("Missing roof model", { status: 400 })
    }

    const sq = roof.estimatedSqFt
    const wasteFactor = 1.12 // 12% waste

    const bundles = Math.ceil((sq * wasteFactor) / 33)
    const underlayment = Math.ceil((sq * wasteFactor) / 400)
    const ridgeCaps = Math.ceil((sq * wasteFactor) / 20)
    const nails = Math.ceil((sq * wasteFactor) / 100)

    return new Response(JSON.stringify({
        materials: {
            bundles,
            underlayment,
            ridgeCaps,
            nails
        }
    }), {
        headers: { "Content-Type": "application/json" }
    })
}
