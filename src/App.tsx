import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

// Pages
import ScriptInput from './pages/ScriptInput';
import SceneEditor from './pages/SceneEditor';
import ImageGenerator from './pages/ImageGenerator';
import CharacterCreator from './pages/CharacterCreator';
import SoundManager from './pages/SoundManager';
import VideoCompiler from './pages/VideoCompiler';

// Types
import { Scene } from './types';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  // Load scenes from localStorage on mount
  const [scenes, setScenes] = useState<Scene[]>(() => {
    const savedScenes = localStorage.getItem('scenes');
    return savedScenes ? JSON.parse(savedScenes) : [];
  });

  // Save scenes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('scenes', JSON.stringify(scenes));
  }, [scenes]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<ScriptInput />} />
          <Route path="/scene-editor" element={<SceneEditor scenes={scenes} setScenes={setScenes} />} />
          <Route path="/image-generator" element={<ImageGenerator scenes={scenes} />} />
          <Route path="/character-creator" element={<CharacterCreator />} />
          <Route path="/sound-manager" element={<SoundManager />} />
          <Route path="/video-compiler" element={<VideoCompiler />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
