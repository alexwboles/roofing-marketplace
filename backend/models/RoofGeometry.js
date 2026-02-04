import db from "../utils/db.js";

export async function updateRoofGeometry(leadId, geojson) {
  const { rows } = await db.query(
    `
    UPDATE roof_analysis
    SET roof_geom = ST_SetSRID(ST_GeomFromGeoJSON($1), 4326),
        updated_at = NOW()
    WHERE lead_id = $2
    RETURNING id, lead_id, ST_AsGeoJSON(roof_geom) AS geojson;
    `,
    [JSON.stringify(geojson), leadId]
  );

  return rows[0] || null;
}

export async function fetchRoofGeometry(leadId) {
  const { rows } = await db.query(
    `
    SELECT
      id,
      lead_id,
      ST_AsGeoJSON(roof_geom) AS geojson
    FROM roof_analysis
    WHERE lead_id = $1;
    `,
    [leadId]
  );

  return rows[0] || null;
}
