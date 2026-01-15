export async function onRequestGet(context) {
    const leads = [
        {
            id: "lead1",
            address: "123 Palm Drive, St Augustine, FL",
            material: "shingle",
            status: "new"
        },
        {
            id: "lead2",
            address: "88 Ocean Breeze Way, St Augustine, FL",
            material: "metal",
            status: "new"
        }
    ];

    return new Response(JSON.stringify(leads), {
        headers: { "Content-Type": "application/json" }
    });
}
