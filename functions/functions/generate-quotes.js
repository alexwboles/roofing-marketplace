export async function onRequestPost(context) {
    try {
        const body = await context.request.json();
        const { roofProfile, material } = body;

        const roofers = [
            {
                id: "roofer1",
                name: "Sunshine Roofing",
                basePrice: 350,
                materialMultiplier: { shingle: 1, metal: 1.4, tile: 1.8 },
                complexityMultiplier: roofProfile.complexityScore + 1
            },
            {
                id: "roofer2",
                name: "Coastal Roof Pros",
                basePrice: 320,
                materialMultiplier: { shingle: 1, metal: 1.3, tile: 1.6 },
                complexityMultiplier: roofProfile.complexityScore + 0.8
            }
        ];

        const quotes = roofers.map(r => {
            const materialsCost = roofProfile.totalAreaSqFt / 100 * r.basePrice * r.materialMultiplier[material];
            const laborCost = materialsCost * 0.35;
            const totalPrice = Math.round(materialsCost + laborCost);

            return {
                rooferId: r.id,
                rooferName: r.name,
                materialsCost: Math.round(materialsCost),
                laborCost: Math.round(laborCost),
                totalPrice
            };
        });

        return new Response(JSON.stringify(quotes), {
            headers: { "Content-Type": "application/json" }
        });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
