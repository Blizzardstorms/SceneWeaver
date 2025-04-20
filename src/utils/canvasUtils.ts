import { Scene } from '../types';

export function drawSceneCanvas(canvas: HTMLCanvasElement, scene: Scene) {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not create canvas context');
  }

  // Set canvas size
  const width = 800;
  const height = 600;
  canvas.width = width;
  canvas.height = height;

  // Draw dark background
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, width, height);

  // Draw scene elements with larger spacing
  ctx.font = 'bold 28px Arial';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';

  // Draw title
  ctx.fillText(scene.title || 'Scene', 20, 60);

  // Draw character
  ctx.font = '20px Arial';
  ctx.fillStyle = '#4CAF50';
  ctx.fillText(`Character: ${scene.character}`, 20, 120);

  // Draw dialogue
  ctx.font = '20px Arial';
  ctx.fillStyle = '#2196F3';
  ctx.fillText(`Dialogue: ${scene.dialogue}`, 20, 180);

  // Draw action
  ctx.font = '20px Arial';
  ctx.fillStyle = '#FFC107';
  ctx.fillText(`Action: ${scene.action}`, 20, 240);

  // Draw character if present
  if (scene.character) {
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#4CAF50';
    ctx.fillText('Character:', 20, 180);
    ctx.font = '14px Arial';
    ctx.fillStyle = '#666';
    ctx.fillText(scene.character, 120, 180);
  }

  // Draw dialogue if present
  if (scene.dialogue) {
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#2196F3';
    ctx.fillText('Dialogue:', 20, 220);
    ctx.font = '14px Arial';
    ctx.fillStyle = '#666';
    ctx.fillText(scene.dialogue, 120, 220);
  }

  // Draw action if present
  if (scene.action) {
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#FF9800';
    ctx.fillText('Action:', 20, 260);
    ctx.font = '14px Arial';
    ctx.fillStyle = '#666';
    ctx.fillText(scene.action, 120, 260);
  }

  // Add decorative elements
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(20, 50);
  ctx.lineTo(20, height - 20);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(20, 50);
  ctx.lineTo(width - 20, 50);
  ctx.stroke();

  return canvas;
}
