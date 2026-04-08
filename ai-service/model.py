from pydantic import BaseModel
import random

class ValuationResult(BaseModel):
    device_model: str
    confidence: float
    estimated_materials: dict

def analyze_image(image_bytes: bytes) -> ValuationResult:
    # In a real scenario, we'd load a PyTorch model and run inference:
    # tensor = preprocess(image_bytes)
    # output = model(tensor)
    
    # Mocking the AI model for this phase
    devices = ["iPhone 12", "ThinkPad T480", "Samsung Galaxy S21", "Dell XPS 13"]
    selected_device = random.choice(devices)
    
    materials = {
        "Gold (g)": round(random.uniform(0.01, 0.05), 3),
        "Copper (g)": round(random.uniform(5.0, 20.0), 3),
        "Lithium (g)": round(random.uniform(1.0, 5.0), 3)
    }
    
    # Let's say ECO token is roughly 1 token per 1g of Copper equivalent value
    # Very arbitrary mock math
    
    return ValuationResult(
        device_model=selected_device,
        confidence=round(random.uniform(0.85, 0.99), 2),
        estimated_materials=materials
    )
