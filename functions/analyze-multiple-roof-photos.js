export async function onRequestPost(context) {
    const { request, env } = context

    const form = await request.formData()
    const files = form.getAll("photos")

    if (!files || files.length === 0) {
        return new Response("No photos uploaded", { status: 400 })
    }

    const results = []

    for (const file of files) {
        const bytes = await file.arrayBuffer()

        // --- Cloudflare Workers AI (fast classification) ---
        const cfResult = await env.AI.run("@cf/vision/classification", {
            image: [...new Uint8Array(bytes)]
        })

        // --- OpenAI Vision (pitch + geometry) ---
        const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
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
                            { type: "text", text: "Analyze this roof photo. Return JSON with: roofType, pitchDegrees, estimatedSqFt, confidence." },
                            { type: "input_image", image_url: "data:image/jpeg;base64," + Buffer.from(bytes).toString("base64") }
                        ]
                    }
                ],
                response_format: { type: "json_object" }
            })
        })

        const openaiJson = await openaiRes.json()

        results.push({
            filename: file.name,
            cloudflare: cfResult,
            openai: openaiJson.choices?.[0]?.message?.parsed || {}
        })
    }

    return new Response(JSON.stringify({ photos: results }), {
        headers: { "Content-Type": "application/json" }
    })
}
