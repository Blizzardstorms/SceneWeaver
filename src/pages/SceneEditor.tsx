import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  Button,
  Grid,
  Box,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate, useLocation } from 'react-router-dom';

import { Scene } from '../types';

interface SceneEditorProps {
  scenes: Scene[];
  setScenes: React.Dispatch<React.SetStateAction<Scene[]>>;
}

interface SceneEditorProps {
  scenes: Scene[];
  setScenes: React.Dispatch<React.SetStateAction<Scene[]>>;
}

const SceneEditor: React.FC<SceneEditorProps> = ({ scenes: propsScenes, setScenes: propsSetScenes }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Use parent state directly
  const scenes = propsScenes;
  const setScenes = propsSetScenes;
  const [editingScene, setEditingScene] = useState<Scene | null>(null);
  const [editedScene, setEditedScene] = useState<Scene | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  useEffect(() => {
    // Get script from navigation state
    const scriptData = location.state?.script;
    if (scriptData) {
      // Parse script into scenes
      parseScriptIntoScenes(scriptData);
    }
  }, [location.state]);

  const parseScriptIntoScenes = (script: string) => {
    const scenes: Scene[] = [];
    let currentScene: Scene | null = null;
    let sceneNumber = 1;

    // Split script by lines
    const lines = script.split('\n').map(line => line.trim());

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Skip empty lines
      if (!line) continue;

      // Check for scene header
      if (line.startsWith('Scene:')) {
        if (currentScene) {
          scenes.push(currentScene);
        }
        currentScene = {
          id: `scene-${sceneNumber}`,
          title: line.replace('Scene:', '').trim(),
          character: '',
          dialogue: '',
          action: '',
          visual: '',
          sound: '',
          music: '',
          type: 'scene'
        };
        sceneNumber++;
      }
      // Check for character
      else if (line.startsWith('Character:')) {
        if (currentScene) {
          currentScene.character = line.replace('Character:', '').trim();
        }
      }
      // Check for dialogue
      else if (line.startsWith('Dialogue:')) {
        if (currentScene) {
          currentScene.dialogue = line.replace('Dialogue:', '').trim();
        }
      }
      // Check for visual elements
      else if (line.startsWith('Visual:')) {
        if (currentScene) {
          currentScene.visual = line.replace('Visual:', '').trim();
        }
      }
      // Check for sound effects
      else if (line.startsWith('Sound Effects:')) {
        if (currentScene) {
          currentScene.sound = line.replace('Sound Effects:', '').trim();
        }
      }
      // Check for music
      else if (line.startsWith('Music:')) {
        if (currentScene) {
          currentScene.music = line.replace('Music:', '').trim();
        }
      }
      // Check for action
      else if (line.startsWith('Action:')) {
        if (currentScene) {
          currentScene.action = line.replace('Action:', '').trim();
        }
      }
      // Check for text on screen
      else if (line.startsWith('Text on Screen:')) {
        scenes.push({
          id: `text-${sceneNumber}`,
          title: '',
          character: '',
          dialogue: '',
          action: line.replace('Text on Screen:', '').trim(),
          type: 'text',
          visual: '',
          sound: '',
          music: ''
        });
      }
      // Check for audio
      else if (line.startsWith('Audio:')) {
        scenes.push({
          id: `audio-${sceneNumber}`,
          title: '',
          character: '',
          dialogue: '',
          action: line.replace('Audio:', '').trim(),
          type: 'audio',
          visual: '',
          sound: '',
          music: ''
        });
      }
    }

    // Add the last scene if it exists
    if (currentScene) {
      scenes.push(currentScene);
    }

    setScenes(scenes);
  };

  const handleAddScene = () => {
    const newScene: Scene = {
      id: `scene-${scenes.length}`,
      title: `Scene ${scenes.length + 1}`,
      character: '',
      dialogue: '',
      action: '',
      type: 'scene',
      visual: '',
      sound: '',
      music: ''
    };
    setScenes([...scenes, newScene]);
  };

  const handleEditScene = (scene: Scene) => {
    setEditingScene(scene);
    setEditedScene({ ...scene });
    setOpenEditDialog(true);
  };

  const handleDeleteScene = (sceneId: string) => {
    setScenes(scenes.filter(scene => scene.id !== sceneId));
  };

  const handleSaveScene = () => {
    if (editingScene && editedScene) {
      setScenes(scenes.map(scene => 
        scene.id === editingScene.id ? editedScene : scene
      ));
      setOpenEditDialog(false);
    }
  };

  const handleCancelEdit = () => {
    setOpenEditDialog(false);
  };

  const handleSceneChange = (field: keyof Scene, value: string) => {
    if (editedScene) {
      setEditedScene({
        ...editedScene,
        [field]: value
      });
    }
  };

  const handleSceneTypeChange = (event: SelectChangeEvent<Scene['type']>) => {
    if (editedScene) {
      setEditedScene({
        ...editedScene,
        type: event.target.value as Scene['type']
      });
    }
  };

  return (
    <Box>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Scene Editor
        </Typography>

        <Typography variant="subtitle1" gutterBottom>
          Manage and edit your scenes here
        </Typography>

        <Grid container spacing={3} sx={{ mt: 4 }}>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddScene}
            >
              Add New Scene
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Scenes
            </Typography>
            <List>
              {scenes.map(scene => (
                <ListItem key={scene.id} sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {/* Scene Title */}
                    <Typography variant="h6" color="primary">
                      {scene.title}
                    </Typography>

                    {/* Character */}
                    {scene.character && (
                      <Typography variant="subtitle2" color="text.secondary">
                        Character: {scene.character}
                      </Typography>
                    )}

                    {/* Dialogue */}
                    {scene.dialogue && (
                      <Typography variant="subtitle2" color="text.secondary">
                        Dialogue: {scene.dialogue}
                      </Typography>
                    )}

                    {/* Action */}
                    {scene.action && (
                      <Typography variant="subtitle2" color="text.secondary">
                        Action: {scene.action}
                      </Typography>
                    )}

                    {/* Scene Type */}
                    <Typography variant="caption" color="text.secondary">
                      Type: {scene.type}
                    </Typography>
                  </Box>

                  {/* Scene Actions */}
                  <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                    <IconButton
                      color="primary"
                      onClick={() => handleEditScene(scene)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteScene(scene.id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/image-generator', { state: { scenes } })}
              sx={{ mt: 4 }}
            >
              Save & Continue to Image Generation
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>

    {/* Edit Scene Dialog */}
    <Dialog open={openEditDialog} onClose={handleCancelEdit} maxWidth="md" fullWidth>
      <DialogTitle>Edit Scene</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Scene Title"
            value={editedScene?.title || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSceneChange('title', e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Character"
            value={editedScene?.character || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSceneChange('character', e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Dialogue"
            value={editedScene?.dialogue || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSceneChange('dialogue', e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Action"
            value={editedScene?.action || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSceneChange('action', e.target.value)}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Scene Type</InputLabel>
            <Select
              value={editedScene?.type || 'scene'}
              onChange={handleSceneTypeChange}
              label="Scene Type"
            >
              <MenuItem value="scene">Scene</MenuItem>
              <MenuItem value="text">Text on Screen</MenuItem>
              <MenuItem value="audio">Audio</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancelEdit} color="error">
          Cancel
        </Button>
        <Button onClick={handleSaveScene} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  </Box>
  );
};

export default SceneEditor;
