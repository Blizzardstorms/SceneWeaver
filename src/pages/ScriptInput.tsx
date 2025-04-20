import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ScriptConversionService } from '../services/scriptConversionService';

interface ScriptInputProps {
  onScriptParsed?: (script: string) => void;
}

const conversionStyles = [
  { value: 'professional', label: 'Professional' },
  { value: 'creative', label: 'Creative' },
  { value: 'dramatic', label: 'Dramatic' },
  { value: 'comedy', label: 'Comedy' },
];

const ScriptInput: React.FC<ScriptInputProps> = ({ onScriptParsed }) => {
  const navigate = useNavigate();
  const [script, setScript] = useState('');
  const [convertedScript, setConvertedScript] = useState('');
  const [error, setError] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [conversionStyle, setConversionStyle] = useState('professional');
  const [conversionSuggestions, setConversionSuggestions] = useState<string[]>([]);

  const handleScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setScript(e.target.value);
    setError('');
    setConvertedScript('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setScript(event.target.result as string);
          setError('');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleConvertToScript = async () => {
    if (!script.trim()) {
      setError('Please enter a story or upload a script');
      return;
    }

    console.log('Environment variables:', {
      hasOpenAIKey: !!process.env.REACT_APP_OPENAI_API_KEY,
      keyStartsWithSk: process.env.REACT_APP_OPENAI_API_KEY?.startsWith('sk-')
    });

    setIsConverting(true);
    setError('');

    try {
      const service = ScriptConversionService.getInstance();
      
      // Add a loading message
      setError('Converting script... Please wait.');
      
      const result = await service.convertToScript(script, conversionStyle);
      
      setConvertedScript(result.script);
      setConversionSuggestions(result.suggestions);
      
      if (onScriptParsed) {
        onScriptParsed(result.script);
      }

      // Navigate to SceneEditor after successful conversion
      navigate('/scene-editor', {
        state: { script: result.script }
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      console.error('Conversion error:', err);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Script Input
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography variant="body1" gutterBottom>
            Enter your script, story, or upload a file:
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={10}
            value={script}
            onChange={handleScriptChange}
            placeholder="Enter your script or story here..."
            variant="outlined"
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Button
              variant="outlined"
              component="label"
            >
              Upload File
              <input
                type="file"
                hidden
                accept=".txt,.pdf,.doc,.docx"
                onChange={handleFileUpload}
              />
            </Button>

            <Select
              value={conversionStyle}
              onChange={(e) => setConversionStyle(e.target.value as string)}
              size="small"
              sx={{ width: 200 }}
            >
              {conversionStyles.map(style => (
                <MenuItem key={style.value} value={style.value}>
                  {style.label}
                </MenuItem>
              ))}
            </Select>
          </Box>

          {convertedScript && (
            <Paper sx={{ p: 2, mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Converted Script
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={10}
                value={convertedScript}
                variant="outlined"
                sx={{ mb: 2 }}
                disabled
              />
            </Paper>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleConvertToScript}
            disabled={isConverting || !script.trim()}
          >
            {isConverting ? (
              <>
                <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                Converting...
              </>
            ) : (
              'Convert to Script'
            )}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setScript('')}
            disabled={!script.trim()}
          >
            Clear
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Typography variant="subtitle1" gutterBottom>
          Features:
        </Typography>
        <ul>
          <li>Text-to-Script Conversion</li>
          <li>File Upload Support</li>
          <li>Real-time Preview</li>
        </ul>
      </Paper>
    </Container>
  );
};

export default ScriptInput;
