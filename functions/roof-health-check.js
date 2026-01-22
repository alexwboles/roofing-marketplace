export async function onRequestPost(context) {
  const { projectId, address, photos } = await context.request.json();

  // 1. Geocode
  const geoRes = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${context.env.GOOGLE_MAPS_KEY}`
  );
  const geo = await geoRes.json();
  const { lat, lng } = geo.results[0].geometry.location;

  // 2. Reverse geocode → county/state
  const revRes = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${context.env.GOOGLE_MAPS_KEY}`
  );
  const rev = await revRes.json();
  const county = rev.results.find((r) =>
    r.types.includes("administrative_area_level_2")
  ).address_components[0].long_name;
  const state = rev.results.find((r) =>
    r.types.includes("administrative_area_level_1")
  ).short_name;

  // 3. NOAA hail lookup
  const hailRes = await fetch(
    `https://www.ncdc.noaa.gov/stormevents/csv?eventType=Hail&beginDate=2019-01-01&endDate=2024-12-31&location=${state}`
  );
  const hailCsv = await hailRes.text();
  const hailEvents = hailCsv.split("\n").filter((line) => line.includes(county));
  const severe = hailEvents.filter((e) => parseFloat(e.split(",")[10] || "0") >= 1.0);
  const hailScore = Math.min(100, severe.length * 10);

  // 
