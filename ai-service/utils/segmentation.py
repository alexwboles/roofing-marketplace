import numpy as np

# Placeholder segmentation – replace with real deep learning model inference.

async def run_roof_segmentation(imagery: dict) -> np.ndarray:
    # For now, create a dummy binary mask (100x100) with a simple square.
    mask = np.zeros((100, 100), dtype=np.uint8)
    mask[30:70, 30:70] = 1
    return mask
