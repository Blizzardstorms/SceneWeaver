import React from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';

const CharacterCreator: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Character Creator
        </Typography>

        <Typography variant="subtitle1" gutterBottom>
          Create and manage your characters
        </Typography>

        <Grid container spacing={3} sx={{ mt: 4 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Character Name"
              placeholder="Enter character name"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Character Description"
              multiline
              rows={4}
              placeholder="Describe your character's appearance and personality..."
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
            >
              Create Character
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {/* Character cards will be displayed here */}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default CharacterCreator;
