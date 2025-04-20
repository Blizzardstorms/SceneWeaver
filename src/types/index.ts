export interface Scene {
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
