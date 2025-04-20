import axios from 'axios';

interface SceneDetails {
  title: string;
  character: string;
  dialogue: string;
  action: string;
  visual: string;
  sound: string;
  music: string;
}

interface AnimationOptions {
  width: number;
  height: number;
  frames: number;
  duration: number;
  style: string;
  motionType: 'deforum' | 'animatediff' | 'svd';
  seed?: number;
  cfgScale?: number;
  steps?: number;
}

// Using local FastAPI server for image generation
export const generateImage = async (scene: string, options: AnimationOptions): Promise<string> => {
  try {
    // Parse the scene details
    const details: SceneDetails = {
      title: '',
      character: '',
      dialogue: '',
      action: '',
      visual: '',
      sound: '',
      music: ''
    };

    // Split scene into lines
    const lines = scene.split('\n');
    lines.forEach(line => {
      if (line.startsWith('Scene:')) details.title = line.replace('Scene:', '').trim();
      if (line.startsWith('Character:')) details.character = line.replace('Character:', '').trim();
      if (line.startsWith('Dialogue:')) details.dialogue = line.replace('Dialogue:', '').trim();
      if (line.startsWith('Action:')) details.action = line.replace('Action:', '').trim();
      if (line.startsWith('Visual:')) details.visual = line.replace('Visual:', '').trim();
      if (line.startsWith('Sound Effects:')) details.sound = line.replace('Sound Effects:', '').trim();
      if (line.startsWith('Music:')) details.music = line.replace('Music:', '').trim();
    });

    // Construct detailed prompt
    const prompt = `A cinematic horror scene with ${details.title}. 
    Character: ${details.character} in ${details.action}.
    Visual elements: ${details.visual}.
    
    Cinematic horror style with:
    - Dramatic lighting and shadows
    - Gothic horror elements
    - Mysterious atmosphere
    - Tension and suspense
    - Dark and moody color palette
    - Character in dramatic pose
    - Environmental details
    - Atmospheric effects`;

    // Use local FastAPI server
    const response = await axios.post('http://localhost:8000/generate/animation', {
      prompt: prompt,
      width: options.width,
      height: options.height,
      frames: options.frames,
      duration: options.duration,
      style: options.style,
      motion_type: options.motionType,
      seed: options.seed,
      cfg_scale: options.cfgScale || 7.5,
      steps: options.steps || 20
    });

    // Get the video URL from the response
    const videoUrl = response.data.videoUrl;
    return videoUrl;
  } catch (error: unknown) {
    console.error('Error generating animation:', error);
    throw new Error('Failed to generate animation. Please check your settings and try again.');
  }
};
