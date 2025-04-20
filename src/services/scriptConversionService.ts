import { ScriptFormatter } from './scriptFormatter';

interface ScriptConversionRequest {
  text: string;
  style: string;
}

interface ScriptConversionResponse {
  script: string;
  suggestions: string[];
}

export class ScriptConversionService {
  private static instance: ScriptConversionService;

  private constructor() {}

  public static getInstance(): ScriptConversionService {
    if (!ScriptConversionService.instance) {
      ScriptConversionService.instance = new ScriptConversionService();
    }
    return ScriptConversionService.instance;
  }

  public async convertToScript(text: string, style: string = 'professional'): Promise<ScriptConversionResponse> {
    try {
      // Use our local formatter with enhanced rules
      const formattedScript = ScriptFormatter.formatScript(text, style);
      
      // Add some basic AI-like enhancements
      const enhancedScript = this.enhanceScript(formattedScript, style);
      
      return {
        script: enhancedScript,
        suggestions: []
      };
    } catch (error: any) {
      console.log('Error in script conversion:', error);
      return {
        script: ScriptFormatter.formatScript(text, style),
        suggestions: []
      };
    }
  }

  private enhanceScript(script: string, style: string): string {
    // Split text into paragraphs
    const paragraphs = script.split('\n\n').filter(p => p.trim());
    
    // Format each paragraph as a scene
    let formattedScript = '';
    paragraphs.forEach((paragraph, index) => {
      formattedScript += `
Scene: Scene ${index + 1}
Character: 
Dialogue: 
Action: ${paragraph.trim()}
`;
    });

    return formattedScript;
  }
}
