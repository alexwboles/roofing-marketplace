from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from utils.geocode import geocode_address
from utils.imagery import fetch_imagery_for_coordinates
from utils.segmentation import run_roof_segmentation
from utils.geometry import mask_to_multipolygon_geojson, estimate_sections_from_mask

router = APIRouter()


class AnalyzeRequest(BaseModel):
    address: str


@router.post("")
async def analyze(request: AnalyzeRequest):
    try:
        # 1) Geocode address
        coords = await geocode_address(request.address)

        # 2) Fetch imagery (placeholder)
        imagery = await fetch_imagery_for_coordinates(coords["lat"], coords["lng"])

        # 3) Run segmentation model → binary mask (placeholder)
        mask = await run_roof_segmentation(imagery)

        # 4) Convert mask → MultiPolygon GeoJSON
        multipolygon_geojson = mask_to_multipolygon_geojson(mask, coords)

        # 5) Estimate sections, area, pitch, etc. from mask
        sections, total_area = estimate_sections_from_mask(mask)

        # Example: simple max pitch placeholder
        max_pitch = max((s["pitch"] for s in sections), default=0)

        return {
            "address": request.address,
            "coordinates": coords,
            "totalArea": total_area,
            "maxPitch": max_pitch,
            "sections": sections,
            "roofGeometry": multipolygon_geojson,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
