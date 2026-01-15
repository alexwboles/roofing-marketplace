export async function onRequestPost(context) {
    try {
        const model = await context.request.json();

        const saved = {
            status: "success",
            message: "Pricing model saved.",
            model
        };

        return new Response(JSON.stringify(saved), {
            headers: { "Content-Type": "application/json" }
        });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
