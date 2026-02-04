# Placeholder geocoding – replace with real provider (Google, Mapbox, etc.)

async def geocode_address(address: str) -> dict:
    # TODO: call real geocoding API
    # For now, return dummy coordinates
    return {
        "lat": 29.9012,
        "lng": -81.3124,
    }
