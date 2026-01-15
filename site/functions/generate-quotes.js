export async function onRequest(context) {
  const { request } = context;

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const body = await request.json();
    const jobId = body.job_id;
    if (!jobId) return json({ error: "job_id is required" }, 400);

    const job = await loadJob(jobId);
    const roofers = await loadEligibleRoofers(job);

    const quotes = roofers.map(r => generateQuoteForRoofer(job, r));
    return json({ quotes }, 200);
  } catch (e) {
    console.error(e);
    return json({ error: "Failed to generate quotes" }, 500);
  }
}

// Stub job
async function loadJob(jobId) {
  return {
    id: jobId,
    finalSqft: 2400,
    pitch: "medium",
    material: "asphalt",
    tearoff: true,
    complexity_score: 0.2,
    zip: "32084"
  };
}

// Stub roofers
async function loadEligibleRoofers(job) {
  return [
    {
      id: "roofer_1",
      company_name: "Sunshine Roofing Co.",
      years_in_business: 12,
      rating: 4.8,
      distance_miles: 8,
      pricing: {
        base_price_per_sqft: 4.0,
        pitch_multipliers: { low: 1.0, medium: 1.15, high: 1.3 },
        material_multipliers: { asphalt: 1.0, metal: 1.4, tile: 1.6 },
        tearoff_multiplier: 1.2,
        minimum_job_price: 6500
      }
    },
    {
      id: "roofer_2",
      company_name: "Coastal Roof Pros",
      years_in_business: 7,
      rating: 4.5,
      distance_miles: 15,
      pricing: {
        base_price_per_sqft: 3.6,
        pitch_multipliers: { low: 1.0, medium: 1.1, high: 1.25 },
        material_multipliers: { asphalt: 1.0, metal: 1.35, tile: 1.5 },
        tearoff_multiplier: 1.15,
        minimum_job_price: 5800
      }
    }
  ];
}

function generateQuoteForRoofer(job, roofer) {
  const sqft = job.finalSqft || 2000;
  const p = roofer.pricing;

  const base = sqft * p.base_price_per_sqft;

  const pitchMult = p.pitch_multipliers[job.pitch] || 1.0;
  const materialMult = p.material_multipliers[job.material] || 1.0;
  const tearoffMult = job.tearoff ? p.tearoff_multiplier : 1.0;
  const complexityMult = 1.0 + (job.complexity_score || 0);

  let total = base * pitchMult * materialMult * tearoffMult * complexityMult;
  if (total < p.minimum_job_price) total = p.minimum_job_price;

  const material_cost = total * 0.55;
  const labor_cost = total * 0.4;
  const tearoff_cost = total * 0.05;

  return {
    id: `${job.id}_${roofer.id}`,
    job_id: job.id,
    roofer_id: roofer.id,
    roofer: {
      company_name: roofer.company_name,
      years_in_business: roofer.years_in_business,
      rating: roofer.rating,
      distance_miles: roofer.distance_miles
    },
    total_price: Math.round(total),
    material_cost: Math.round(material_cost),
    labor_cost: Math.round(labor_cost),
    tearoff_cost: Math.round(tearoff_cost),
    extras: []
  };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
