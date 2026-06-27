from __future__ import annotations

import random
from typing import Any


FABRIC_TYPES = [
    "Plain Weave Cotton",
    "Twill Weave Polyester",
    "Satin Weave Silk",
    "Denim Twill",
    "Linen Plain Weave",
    "Jacquard Pattern",
    "Knit Jersey",
    "Oxford Weave",
]

SUGGESTIONS_POOL = [
    "Consider increasing warp tension for more uniform thread spacing.",
    "Weft density appears slightly below industry standard for this fabric type.",
    "Recommend quality check on edge selvage for potential fraying.",
    "Thread count suggests medium-weight fabric suitable for apparel.",
    "Minor irregularities detected in weave pattern — inspect loom calibration.",
    "Fabric structure indicates good tensile strength potential.",
    "Consider pre-shrinking treatment before cutting operations.",
    "Color consistency across sample appears within acceptable tolerance.",
]


def analyze_fabric_image(file_name: str, file_size_kb: int) -> dict[str, Any]:
    """Mock AI fabric analysis based on image metadata."""
    seed = sum(ord(c) for c in file_name) + file_size_kb
    random.seed(seed)

    warp = random.randint(40, 120)
    weft = random.randint(35, 110)
    density = round((warp + weft) / 2 + random.uniform(-5, 5), 1)
    confidence = round(random.uniform(0.82, 0.98), 2)
    fabric_type = random.choice(FABRIC_TYPES)
    suggestions = random.sample(SUGGESTIONS_POOL, k=random.randint(3, 5))

    return {
        "thread_density": density,
        "warp_count": warp,
        "weft_count": weft,
        "fabric_type": fabric_type,
        "confidence_score": confidence,
        "ai_suggestions": suggestions,
        "raw_analysis": {
            "model_version": "ThreadCounty-v1.0-mock",
            "processing_time_ms": random.randint(800, 2500),
            "image_quality": random.choice(["excellent", "good", "fair"]),
            "weave_pattern": random.choice(["plain", "twill", "satin", "jacquard"]),
            "thread_uniformity": round(random.uniform(0.75, 0.99), 2),
        },
    }
