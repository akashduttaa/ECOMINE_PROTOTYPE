from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from model import analyze_image

app = FastAPI(title="EcoMine AI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze_endpoint(file: UploadFile = File(...)):
    # Read image contents
    contents = await file.read()
    
    # Run the image through the "AI model"
    result = analyze_image(contents)
    
    # Calculate an arbitrary token reward based on the materials
    # E.g. 1 ECO token per gram of estimated valuable material weight mock
    total_valuable_weight = sum(result.estimated_materials.values())
    eco_reward_estimate = round(total_valuable_weight * 0.5, 2)
    
    return {
        "success": True,
        "device_model": result.device_model,
        "confidence": result.confidence,
        "materials": result.estimated_materials,
        "eco_reward_estimate": eco_reward_estimate
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
