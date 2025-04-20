import { styled } from '@mui/material/styles';
import { Theme } from '@mui/material';
import { Container as MuiContainer, Paper as MuiPaper, Card as MuiCard } from '@mui/material';

export const Container = styled(MuiContainer)(({ theme }: { theme: Theme }) => ({
  marginTop: theme.spacing(4),
}));

export const PaperStyled = styled(MuiPaper)(({ theme }: { theme: Theme }) => ({
  padding: theme.spacing(4),
}));

export const CardStyled = styled(MuiCard)(({ theme }: { theme: Theme }) => ({
  height: '100%',
}));

export const ImageContainer = styled('div')(() => ({
  position: 'relative',
  height: '200px',
}));

export const LoadingIndicator = styled('div')(() => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
}));

export const CanvasStyled = styled('canvas')(() => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
}));

export const ImageStyled = styled('img')(() => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
}));

export const Actions = styled('div')(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(1),
}));

export const Caption = styled('div')(({ theme }: { theme: Theme }) => ({
  color: theme.palette.text.secondary,
}));

export const ErrorAlert = styled('div')(({ theme }: { theme: Theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  margin: '1rem',
}));

export const DialogContentWrapper = styled('div')(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
}));
