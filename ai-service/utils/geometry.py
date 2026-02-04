import numpy as np
from shapely.geometry import shape, mapping, Polygon, MultiPolygon
from shapely.ops import unary_union


def mask_to_multipolygon_geojson(mask: np.ndarray, coords: dict) -> dict:
    """
    Convert a binary mask into a simplified MultiPolygon GeoJSON.
    This is a placeholder that assumes a simple mapping from pixel space
    to a small bounding box around the given lat/lng.
    """

    # Define an arbitrary bounding box around the center point
    lat = coords["lat"]
    lng = coords["lng"]
    delta = 0.0005  # ~50m-ish, placeholder

    minx = lng - delta
    maxx = lng + delta
    miny = lat - delta
    maxy = lat + delta

    height, width = mask.shape

    def pixel_to_lonlat(x, y):
        # x: column index (0..width-1)
        # y: row index (0..height-1)
        lon = minx + (x / (width - 1)) * (maxx - minx)
        lat_ = maxy - (y / (height - 1)) * (maxy - miny)
        return lon, lat_

    # Find connected region bounding box as a simple polygon
    ys, xs = np.where(mask > 0)
    if len(xs) == 0 or len(ys) == 0:
        # No roof detected
        return {
            "type": "MultiPolygon",
            "coordinates": []
        }

    min_x_pix, max_x_pix = xs.min(), xs.max()
    min_y_pix, max_y_pix = ys.min(), ys.max()

    # Build a simple rectangle polygon around the detected region
    p1 = pixel_to_lonlat(min_x_pix, min_y_pix)
    p2 = pixel_to_lonlat(max_x_pix, min_y_pix)
    p3 = pixel_to_lonlat(max_x_pix, max_y_pix)
    p4 = pixel_to_lonlat(min_x_pix, max_y_pix)

    polygon = Polygon([p1, p2, p3, p4, p1])

    multipolygon = MultiPolygon([polygon])

    return mapping(multipolygon)


def estimate_sections_from_mask(mask: np.ndarray):
    """
    Placeholder: estimate roof sections and total area from mask.
    In a real implementation, you'd:
      - Run connected components
      - Approximate each component as a polygon
      - Estimate area and pitch per section
    """

    # Dummy: treat entire mask as one section if any pixels are set
    ys, xs = np.where(mask > 0)
    if len(xs) == 0 or len(ys) == 0:
        return [], 0

    # Fake area: number of pixels * arbitrary factor
    pixel_count = len(xs)
    area_per_pixel = 1.0  # placeholder square feet per pixel
    total_area = pixel_count * area_per_pixel

    sections = [
        {
            "id": 1,
            "areaSqFt": total_area,
            "pitch": 6,  # placeholder
            "obstructions": 0
        }
    ]

    return sections, total_area
