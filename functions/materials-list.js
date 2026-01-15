export async function onRequestPost(context) {
    try {
        const body = await context.request.json();
        const { rooferId, roofProfile } = body;

        const squares = roofProfile.totalAreaSqFt / 100;

        const materials = [
            { item: "Shingles", qty: Math.ceil(squares * 1.1), unit: "bundles" },
            { item: "Underlayment", qty: Math.ceil(squares / 4), unit: "rolls" },
            { item: "Drip Edge", qty: Math.ceil(roofProfile.ridges / 10), unit: "10ft sections" },
            { item: "Ridge Vent", qty: Math.ceil(roofProfile.ridges / 4), unit: "4ft sections" },
            { item: "Starter Strip", qty: Math.ceil(squares / 3), unit: "bundles" },
            { item: "Nails", qty: Math.ceil(squares * 2), unit: "boxes" },
            { item: "Ice & Water Shield", qty: roofProfile.valleys, unit: "rolls" }
        ];

        return new Response(JSON.stringify({ rooferId, materials }), {
            headers: { "Content-Type": "application/json" }
        });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
