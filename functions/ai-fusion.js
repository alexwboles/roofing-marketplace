export async function onRequestPost(context) {
    try {
        const formData = await context.request.formData();
        const photos = formData.getAll("photos");

        const roofProfile = {
            totalAreaSqFt: 2400,
            pitch: "6/12",
            facets: 8,
            valleys: 3,
            ridges: 120,
            complexityScore: 0.72,
            wasteFactor: 0.12,
            roofType: "shingle",
            aiVersion: "v1"
        };

        return new Response(JSON.stringify(roofProfile), {
            headers: { "Content-Type": "application/json" }
        });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
