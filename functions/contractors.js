export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Contractor auth
    if (url.pathname === '/api/contractor/signup' && request.method === 'POST') {
      return handleSignup(request, env);
    }

    if (url.pathname === '/api/contractor/login' && request.method === 'POST') {
      return handleLogin(request, env);
    }

    // Contractor profile save
    if (url.pathname === '/api/contractor/profile' && request.method === 'POST') {
      return handleSaveProfile(request, env);
    }

    // Matching engine
    if (url.pathname === '/api/contractor/match' && request.method === 'POST') {
      return handleMatchContractors(request, env);
    }

    // Admin endpoints
    if (url.pathname === '/api/admin/contractors' && request.method === 'GET') {
      return handleListContractors(env);
    }

    if (url.pathname === '/api/admin/contractors/approve' && request.method === 'POST') {
      return handleApproveContractor(request, env);
    }

    return new Response('Not found', { status: 404 });
  }
};

// ===============================
// CONTRACTOR SIGNUP
// ===============================
async function handleSignup(request, env) {
  const body = await request.json();
  const { email, password, companyName } = body;

  if (!email || !password || !companyName) {
    return new Response('Missing fields', { status: 400 });
  }

  const id = `contractor:${email.toLowerCase()}`;
  const existing = await env.CONTRACTORS.get(id);
  if (existing) {
    return new Response('Account already exists', { status: 400 });
  }

  const contractor = {
    id,
    email,
    passwordHash: password, // TODO: hash in production
    companyName,
    approved: false,
    pricing: null,
    serviceArea: '',
    availability: null,
    createdAt: new Date().toISOString()
  };

  await env.CONTRACTORS.put(id, JSON.stringify(contractor));

  return json({
    success: true,
    contractor: {
      id,
      email,
      companyName,
      approved: false
    }
  });
}

// ===============================
// CONTRACTOR LOGIN
// ===============================
async function handleLogin(request, env) {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return new Response('Missing fields', { status: 400 });
  }

  const id = `contractor:${email.toLowerCase()}`;
  const raw = await env.CONTRACTORS.get(id);
  if (!raw) return new Response('Invalid credentials', { status: 401 });

  const contractor = JSON.parse(raw);
  if (contractor.passwordHash !== password) {
    return new Response('Invalid credentials', { status: 401 });
  }

  return json({
    success: true,
    contractor: {
      id: contractor.id,
      email: contractor.email,
      companyName: contractor.companyName,
      approved: contractor.approved
    }
  });
}

// ===============================
// SAVE CONTRACTOR PROFILE
// ===============================
async function handleSaveProfile(request, env) {
  const body = await request.json();
  const { email, pricing, serviceArea, availability } = body;

  if (!email) return new Response('Missing email', { status: 400 });

  const id = `contractor:${email.toLowerCase()}`;
  const raw = await env.CONTRACTORS.get(id);
  if (!raw) return new Response('Not found', { status: 404 });

  const contractor = JSON.parse(raw);

  contractor.pricing = pricing || contractor.pricing;
  contractor.serviceArea = serviceArea ?? contractor.serviceArea;
  contractor.availability = availability || contractor.availability;

  await env.CONTRACTORS.put(id, JSON.stringify(contractor));

  return json({ success: true });
}

// ===============================
// MATCHING ENGINE
// ===============================
async function handleMatchContractors(request, env) {
  const body = await request.json();
  const { zip, materialType, estimatedSquareFootage } = body;

  const list = await listAllContractors(env);
  const candidates = list.filter(c => c.approved && c.pricing && c.serviceArea);

  const matches = candidates
    .filter(c => isInServiceArea(c.serviceArea, zip))
    .map(c => {
      const pricePerSq = getPriceForMaterial(c.pricing, materialType);
      const squares = estimatedSquareFootage / 100;
      const base = pricePerSq * squares;

      return {
        contractorId: c.id,
        companyName: c.companyName,
        email: c.email,
        estimatedPriceLow: Math.round(base * 0.9),
        estimatedPriceHigh: Math.round(base * 1.1)
      };
    })
    .sort((a, b) => a.estimatedPriceLow - b.estimatedPriceLow)
    .slice(0, 5);

  return json({ matches });
}

// ===============================
// ADMIN: LIST CONTRACTORS
// ===============================
async function handleListContractors(env) {
  const list = await listAllContractors(env);
  return json({ contractors: list });
}

// ===============================
// ADMIN: APPROVE CONTRACTOR
// ===============================
async function handleApproveContractor(request, env) {
  const body = await request.json();
  const { id, approved } = body;

  if (!id) return new Response('Missing id', { status: 400 });

  const raw = await env.CONTRACTORS.get(id);
  if (!raw) return new Response('Not found', { status: 404 });

  const contractor = JSON.parse(raw);
  contractor.approved = !!approved;

  await env.CONTRACTORS.put(id, JSON.stringify(contractor));

  return json({ success: true });
}

// ===============================
// HELPERS
// ===============================
async function listAllContractors(env) {
  const list = await env.CONTRACTORS.list({ prefix: 'contractor:' });
  const contractors = [];

  for (const key of list.keys) {
    const raw = await env.CONTRACTORS.get(key.name);
    if (!raw) continue;
    contractors.push(JSON.parse(raw));
  }

  return contractors;
}

function isInServiceArea(serviceArea, zip) {
  if (!serviceArea || !zip) return false;
  const tokens = serviceArea.split(/[,;\n]/).map(t => t.trim());
  return tokens.includes(zip);
}

function getPriceForMaterial(pricing, materialType) {
  if (!pricing) return 400;

  if (materialType === 'Architectural Shingle') return Number(pricing.arch || 350);
  if (materialType === '3-Tab Shingle') return Number(pricing.tab || 300);
  if (materialType === 'Metal') return Number(pricing.metal || 550);

  return Number(pricing.arch || 400);
}

function json(obj) {
  return new Response(JSON.stringify(obj), {
    status: 200,
    headers: { 'content-type': 'application/json' }
  });
}
