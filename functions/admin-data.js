export async function onRequestGet(context) {
    const data = {
        totalUsers: 128,
        totalRoofers: 14,
        totalLeads: 312,
        totalQuotesGenerated: 904,
        aiModelVersion: "v1",
        systemStatus: "operational"
    };

    return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" }
    });
}
