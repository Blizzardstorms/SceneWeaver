import React, { useState, useEffect } from 'react';
import { Container, Card, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert, Typography } from '@mui/material';
import { generateImage } from '../services/aiImageService';

interface Scene {
  id: string;
  title: string;
  character: string;
  dialogue: string;
  action: string;
  visual: string;
  sound: string;
  music: string;
  type: 'scene' | 'text' | 'audio';
  imageData?: string;
}

interface ImageGeneratorProps {
  scenes: Scene[];
}

export default function ImageGenerator({ scenes }: ImageGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);

  // Load scenes from localStorage on mount
  useEffect(() => {
    if (!scenes || scenes.length === 0) {
      const savedScenes = localStorage.getItem('scenes');
      if (savedScenes) {
        const parsedScenes = JSON.parse(savedScenes);
        console.log('Loaded scenes from localStorage:', parsedScenes);
        localStorage.setItem('scenes', JSON.stringify([]));
      }
    }
  }, []);

  useEffect(() => {
    if (scenes && scenes.length > 0) {
      scenes.forEach(scene => {
        const imageData = localStorage.getItem(`scene_${scene.id}`);
        if (imageData) {
          const updatedScene = { ...scene, imageData };
          localStorage.setItem(`scene_${scene.id}`, imageData);
        }
      });
    }
  }, [scenes]);

  console.log('ImageGenerator received scenes:', scenes);

  if (!scenes || scenes.length === 0) {
    return (
      <Container>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', minHeight: '400px' }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Scene Images
          </Typography>
          <Typography variant="body1" color="text.secondary">
            No scenes found. Please create scenes in the Scene Editor first.
          </Typography>
        </Box>
      </Container>
    );
  }

  const handleGenerateImage = async (scene: Scene) => {
    try {
      setLoading(true);
      setError(null);

      // Generate detailed prompt for Hugging Face API
      const prompt = `A cinematic scene from a horror film with ${scene.title}. 
      Character: ${scene.character} in ${scene.action}.
      Visual elements: ${scene.visual}.
      
      Cinematic composition:
      - Dramatic lighting with deep shadows
      - High contrast between light and dark areas
      - 4K resolution with fine detail
      - Film grain for authenticity
      
      Color palette:
      - Cool blues and deep blacks for shadows
      - Warm highlights where light strikes
      - Subtle red accents for blood and glowing elements
      
      Composition:
      - Foreground: Character in motion
      - Midground: Environmental elements
      - Background: Atmospheric elements with subtle moonlight
      
      Mood:
      - Tension and foreboding
      - Mysterious and dangerous
      - Cinematic and dramatic
      
      Technical:
      - Depth of field with character in focus
      - Motion blur for movement
      - Subtle lens flare from light sources
      
      Style:
      - Cinematic horror film aesthetic
      - Gothic horror influences
      - Atmospheric lighting
      - Dynamic composition
      
      Notes:
      - Focus on dramatic composition
      - Emphasize mood and atmosphere
      - Maintain high visual quality
      - Include subtle horror elements
      - Create a sense of unease`;

      // Generate image using Hugging Face API
      const imageUrl = await generateImage(prompt);

      // Update scene with the generated image
      const updatedScene = { ...scene, imageData: imageUrl };
      const updatedScenes = scenes.map(s =>
        s.id === scene.id ? updatedScene : s
      );

      // Save to localStorage
      localStorage.setItem(`scene_${scene.id}`, imageUrl);
      localStorage.setItem('scenes', JSON.stringify(updatedScenes));

      // Force re-render
      window.location.reload();

    } catch (err) {
      console.error('Error generating image:', err);
      setError('Failed to generate image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = (scene: Scene) => {
    setSelectedScene(scene);
    setOpenDialog(true);
    setPrompt(`Character: ${scene.character}\nDialogue: ${scene.dialogue}\nAction: ${scene.action}`);
  };

  return (
    <Container>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Scene Images
        </Typography>
        {scenes.map((scene) => (
          <Card key={scene.id} sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="h6">{scene.title}</Typography>
              <Box sx={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', border: '1px solid #333' }}>
                {scene.imageData ? (
                  <img
                    src={scene.imageData}
                    alt={scene.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      backgroundColor: '#1a1a1a'
                    }}
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='; // 1x1 transparent pixel
                    }}
                  />
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => handleGenerateImage(scene)}
                    disabled={loading}
                    sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    {loading ? 'Generating...' : 'Generate Image'}
                  </Button>
                )}
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                <Typography variant="body1" color="text.secondary">
                  Character: {scene.character}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Dialogue: {scene.dialogue}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Action: {scene.action}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => handleRegenerate(scene)}
                  disabled={!scene.imageData}
                  sx={{ flex: 1 }}
                >
                  Regenerate
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => window.location.href = '/scene-editor'}
                  sx={{ flex: 1 }}
                >
                  Edit Scene
                </Button>
              </Box>
            </Box>
          </Card>
        ))}
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Regenerate Image</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Scene Details"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            multiline
            rows={4}
            placeholder="Enter scene details here..."
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={() => handleGenerateImage(selectedScene!)} variant="contained">
            Generate
          </Button>
        </DialogActions>
      </Dialog>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Container>
  );
}
