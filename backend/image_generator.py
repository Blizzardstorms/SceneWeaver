from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import requests
import os
from dotenv import load_dotenv
import base64
from PIL import Image
from io import BytesIO
import tempfile
import json
import subprocess

load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow requests from React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnimationRequest(BaseModel):
    prompt: str
    width: int
    height: int
    frames: int = 30  # Number of frames for the animation
    duration: float = 2.0  # Duration in seconds
    style: str = "cinematic"  # Style of animation
    motion_type: str = "deforum"  # deforum, animatediff, or svd
    seed: Optional[int] = None  # Optional seed for reproducibility
    cfg_scale: float = 7.5  # Configuration scale
    steps: int = 20  # Number of sampling steps

@app.post("/generate/animation")
async def generate_animation(request: AnimationRequest):
    try:
        # Prepare the animation prompt with style
        animation_prompt = f"Create a {request.style} animation of {request.prompt}"
        
        # Get the correct API endpoint based on motion_type
        if request.motion_type == "deforum":
            api_url = f"http://localhost:7860/sdapi/v1/txt2img"
            payload = {
                "prompt": animation_prompt,
                "width": request.width,
                "height": request.height,
                "steps": request.steps,
                "cfg_scale": request.cfg_scale,
                "seed": request.seed,
                "motion_type": "deforum",
                "frames": request.frames,
                "duration": request.duration,
                "model": "stable-diffusion-xl",
                "extensions": ["Deforum"]
            }
        elif request.motion_type == "animatediff":
            api_url = f"http://localhost:7860/sdapi/v1/txt2img"
            payload = {
                "prompt": animation_prompt,
                "width": request.width,
                "height": request.height,
                "steps": request.steps,
                "cfg_scale": request.cfg_scale,
                "seed": request.seed,
                "motion_type": "animatediff",
                "frames": request.frames,
                "duration": request.duration,
                "model": "stable-diffusion-xl",
                "extensions": ["AnimateDiff"]
            }
        else:  # svd
            api_url = f"http://localhost:7860/sdapi/v1/txt2img"
            payload = {
                "prompt": animation_prompt,
                "width": request.width,
                "height": request.height,
                "steps": request.steps,
                "cfg_scale": request.cfg_scale,
                "seed": request.seed,
                "motion_type": "svd",
                "frames": request.frames,
                "duration": request.duration,
                "model": "stable-diffusion-xl",
                "extensions": ["StableVideoDiffusion"]
            }
        
        # Make request to AUTOMATIC1111 server
        response = requests.post(api_url, json=payload)
        response.raise_for_status()
        
        # Get video data from response
        video_data = response.json()['result']['video']
        
        # Save the video temporarily
        temp_dir = tempfile.mkdtemp()
        video_path = os.path.join(temp_dir, f"animation_{hash(request.prompt)}.mp4")
        
        # Write video data to file
        with open(video_path, 'wb') as f:
            f.write(base64.b64decode(video_data))
            
        # Convert video to GIF if needed
        gif_path = os.path.join(temp_dir, f"animation_{hash(request.prompt)}.gif")
        
        # Return both video and GIF URLs
        return {
            "videoUrl": f"/videos/{os.path.basename(video_path)}",
            "gifUrl": f"/gifs/{os.path.basename(gif_path)}",
            "motionType": request.motion_type,
            "frames": request.frames,
            "duration": request.duration
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate/image")
async def generate_image(request: AnimationRequest):
    try:
        # Use AUTOMATIC1111 for image generation
        api_url = f"http://localhost:7860/sdapi/v1/txt2img"
        
        # Prepare the request for AUTOMATIC1111
        payload = {
            "prompt": request.prompt,
            "width": request.width,
            "height": request.height,
            "steps": request.steps,
            "cfg_scale": request.cfg_scale,
            "seed": request.seed,
            "model": "stable-diffusion-xl"
        }
        
        # Make request to AUTOMATIC1111 server
        response = requests.post(api_url, json=payload)
        response.raise_for_status()
        
        # Get image data from response
        image_data = response.json()['result']['image']
        
        # Convert base64 image data to PIL Image
        image = Image.open(BytesIO(base64.b64decode(image_data)))
        
        # Save the image temporarily
        image_path = f"temp_image_{hash(request.prompt)}.png"
        image.save(image_path)
        
        # Return the image URL
        return {
            "imageUrl": f"/images/{image_path}",
            "motionType": "static",
            "seed": request.seed
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
