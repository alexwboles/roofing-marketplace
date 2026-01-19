export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/api/analyze-multiple-roof-photos' && request.method === 'POST') {
      return handleAnalyzePhotos(request, env);
    }

    return new Response('Not found', { status: 404 });
  }
};

async function handleAnalyzePhotos(request, env) {
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('multipart/form-data')) {
    return new Response('Expected multipart/form-data', { status: 400 });
  }

  const formData = await request.formData();
  const files = formData.getAll('photos'); // <input name="photos" multiple>

  if (!files || files.length === 0) {
    return new Response('No photos uploaded', { status: 400 });
  }

  // 1) Call your vision models (OpenAI / Workers AI) to extract features
  const features = await extractRoofFeaturesFromImages(files, env);

  // 2) Compute health score
  const roofHealthScore = computeRoofHealthScore(features);

  // 3) Compute estimates
  const estimates = computeEstimates(features);

  // 4) Compute lifespan + condition + recommended actions + timeline
  const condition = roofHealthScore >= 80 ? 'Good' : roofHealthScore >= 60 ? 'Fair' : 'Poor';
  const lifespanYearsRemaining = Math.max(0, 30 - (features.ageEstimateYears || 0));

  const recommendedActions = buildRecommendedActions(features, roofHealthScore);
  const maintenanceTimeline = buildMaintenanceTimeline(features, lifespanYearsRemaining);

  const responseBody = {
    roofHealthScore,
    condition,
    materialType: features.materialType,
    estimatedSquareFootage: features.estimatedSquareFootage,
    valleyCount: features.valleyCount,
    stackCount: features.stackCount,
    pitch: features.pitchLabel,
    complexity: features.complexityLabel,
    damageLevel: features.damageLevelLabel,
    ageEstimateYears: features.ageEstimateYears,
    lifespanYearsRemaining,
    repairEstimate: estimates.repairEstimate,
    replacementEstimate: estimates.replacementEstimate,
    recommendedActions,
    maintenanceTimeline
  };

  return new Response(JSON.stringify(responseBody), {
    status: 200,
    headers: { 'content-type': 'application/json' }
  });
}

// --- AI FEATURE EXTRACTION (stub – replace with real model calls) ---
async function extractRoofFeaturesFromImages(files, env) {
  // TODO: wire to OpenAI Vision / Workers AI / satellite fusion.
  // Stubbed values so the pipeline works end-to-end.

  return {
    materialType: 'Architectural Shingle',
    estimatedSquareFootage: 2450,
    valleyCount: 4,
    stackCount: 3,
    pitchRatio: 6, // 6/12
    pitchLabel: '6/12',
    complexityLevel: 2, // 0–5
    complexityLabel: 'Moderate',
    damageSeverity: 20, // 0–100 (0 = severe, 100 = none)
    damageLevelLabel: 'Low',
    ageEstimateYears: 12,
    debrisLevel: 20, // 0–100
    materialCondition: 80 // 0–100
  };
}

// --- SCORING ---
function computeRoofHealthScore(features) {
  let score = 0;

  const materialCondition = features.materialCondition ?? 70;
  const damageSeverity = features.damageSeverity ?? 40;
  const ageEstimateYears = features.ageEstimateYears ?? 15;
  const complexityLevel = features.complexityLevel ?? 2;
  const pitchRatio = features.pitchRatio ?? 6;
  const debrisLevel = features.debrisLevel ?? 30;

  // Material condition (0–100)
  score += materialCondition * 0.35;

  // Damage severity (0–100, where 0 = severe, 100 = none)
  const damageScore = 100 - damageSeverity;
  score += damageScore * 0.30;

  // Age (normalize to 0–100)
  const ageScore = Math.max(0, 100 - ageEstimateYears * 3);
  score += ageScore * 0.15;

  // Complexity (0–5, higher = more complex)
  const complexityScore = 100 - complexityLevel * 15;
  score += complexityScore * 0.10;

  // Pitch (ideal around 6/12)
  const pitchScore = 100 - Math.abs(pitchRatio - 6) * 8;
  score += pitchScore * 0.05;

  // Cleanliness / debris (0–100)
  const debrisScore = 100 - debrisLevel;
  score += debrisScore * 0.05;

  return Math.round(score);
}

// --- ESTIMATES ---
function computeEstimates(features) {
  const materialType = features.materialType || 'Architectural Shingle';

  const basePricePerSq =
    materialType === 'Architectural Shingle' ? 350 :
    materialType === '3-Tab Shingle' ? 300 :
    materialType === 'Metal' ? 550 :
    400;

  const squares = (features.estimatedSquareFootage ?? 2000) / 100;

  const complexityMultiplier = 1 + (features.complexityLevel ?? 2) * 0.05;
  const pitchMultiplier = 1 + Math.abs((features.pitchRatio ?? 6) - 6) * 0.03;
  const valleyMultiplier = 1 + (features.valleyCount ?? 0) * 0.02;
  const stackMultiplier = 1 + (features.stackCount ?? 0) * 0.01;

  const multiplier = complexityMultiplier * pitchMultiplier * valleyMultiplier * stackMultiplier;

  const replacementBase = basePricePerSq * squares * multiplier;
  const repairBase = replacementBase * 0.25; // e.g. 25% of replacement

  return {
    repairEstimate: {
      low: Math.round(repairBase * 0.9),
      high: Math.round(repairBase * 1.1)
    },
    replacementEstimate: {
      low: Math.round(replacementBase * 0.9),
      high: Math.round(replacementBase * 1.1)
    }
  };
}

// --- RECOMMENDED ACTIONS ---
function buildRecommendedActions(features, score) {
  const actions = [];

  if ((features.debrisLevel ?? 30) > 20) {
    actions.push('Clean gutters to improve water flow');
  }

  if ((features.damageSeverity ?? 40) > 30) {
    actions.push('Replace damaged shingles on affected slopes');
  }

  if ((features.ageEstimateYears ?? 15) > 15) {
    actions.push('Schedule a full inspection within 6–12 months');
  } else {
    actions.push('Schedule a full inspection within 12–18 months');
  }

  if (actions.length === 0) {
    actions.push('Continue routine visual inspections annually');
  }

  return actions;
}

// --- MAINTENANCE TIMELINE ---
function buildMaintenanceTimeline(features, lifespanYearsRemaining) {
  const currentYear = new Date().getFullYear();
  const timeline = [];

  timeline.push({
    year: currentYear,
    action: 'Clean gutters & inspect flashing'
  });

  timeline.push({
    year: currentYear + 2,
    action: 'Spot-check for shingle wear and sealant cracks'
  });

  timeline.push({
    year: currentYear + 5,
    action: 'Full roof inspection recommended'
  });

  timeline.push({
    year: currentYear + Math.max(8, lifespanYearsRemaining - 5),
    action: 'Begin planning for replacement'
  });

  return timeline;
}
