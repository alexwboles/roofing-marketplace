export async function onRequestPost(context) {
    const { request, env } = context
    const { address, photoAnalysis } = await request.json()

    if (!address || !photoAnalysis) {
        return new Response("Missing fields", { status: 400 })
    }

    // Fetch satellite image (Mapbox Static Maps)
    const satUrl = `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${encodeURIComponent(address)}/600x600?access_token=${env.MAPBOX_TOKEN}`
    const satImage = await fetch(satUrl)
    const satBytes = await satImage.arrayBuffer()

    // Fuse satellite + photo analysis using OpenAI Vision
    const fusionRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-4o",
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: "Fuse this satellite image with the provided roof photo analysis. Return JSON with: roofType, pitchDegrees, estimatedSqFt, confidence, notes." },
                        { type: "input_image", image_url: "data:image/jpeg;base64," + Buffer.from(satBytes).toString("base64") },
                        { type: "text", text: JSON.stringify(photoAnalysis) }
                    ]
                }
            ],
            response_format: { type: "json_object" }
        })
    })

    const fusionJson = await fusionRes.json()

    return new Response(JSON.stringify({
        fused: fusionJson.choices?.[0]?.message?.parsed || {}
    }), {
        headers: { "Content-Type": "application/json" }
    })
}
