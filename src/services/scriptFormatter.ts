export class ScriptFormatter {
  static formatScript(text: string, style: string = 'professional'): string {
    // Split text into paragraphs
    const paragraphs = text.split('\n').map(p => p.trim()).filter(p => p.length > 0);

    // Initialize the formatted script
    let formattedScript = '';

    // Process each paragraph
    paragraphs.forEach((paragraph, index) => {
      // Add scene description if it looks like a location
      if (paragraph.toUpperCase().includes('INT.') || paragraph.toUpperCase().includes('EXT.')) {
        formattedScript += `\n\n${paragraph.toUpperCase()}\n\n`;
      }
      // Check for dialogue (lines with a colon)
      else if (paragraph.includes(':')) {
        const [character, dialogue] = paragraph.split(':', 2);
        formattedScript += `\n\n${character.trim().toUpperCase()}: ${dialogue.trim()}\n\n`;
      }
      // Handle action descriptions
      else {
        formattedScript += `\n\n${paragraph}\n\n`;
      }
    });

    // Add style-specific formatting
    switch (style.toLowerCase()) {
      case 'professional':
        // Add proper indentation for dialogue
        formattedScript = formattedScript.replace(/\n\n([A-Z]+):\s+/g, '\n\n$1:    ');
        // Add proper spacing between scenes
        formattedScript = formattedScript.replace(/\n\n([A-Z]+\s+INT\.)/g, '\n\n\n$1');
        break;
      case 'creative':
        // Add more dramatic line breaks
        formattedScript = formattedScript.replace(/\./g, '.\n\n');
        formattedScript = formattedScript.replace(/\!/g, '!\n\n');
        formattedScript = formattedScript.replace(/\?/g, '?\n\n');
        break;
      case 'dramatic':
        // Add more emphasis
        formattedScript = formattedScript.replace(/\./g, '.\n\n');
        formattedScript = formattedScript.replace(/\!/g, '!\n\n');
        formattedScript = formattedScript.replace(/\?/g, '?\n\n');
        formattedScript = formattedScript.replace(/\n\n([A-Z]+):\s+/g, '\n\n$1:    ');
        break;
      case 'comedy':
        // Add more playful formatting
        formattedScript = formattedScript.replace(/\./g, '.\n\n');
        formattedScript = formattedScript.replace(/\!/g, '!\n\n');
        formattedScript = formattedScript.replace(/\?/g, '?\n\n');
        formattedScript = formattedScript.replace(/\n\n([A-Z]+):\s+/g, '\n\n$1:    ');
        formattedScript = formattedScript.replace(/\n\nINT\./g, '\n\nINT. (COMEDY)\n\n');
        formattedScript = formattedScript.replace(/\n\nEXT\./g, '\n\nEXT. (COMEDY)\n\n');
        break;
      default:
        // Add basic formatting
        formattedScript = formattedScript.replace(/\n\n([A-Z]+):\s+/g, '\n\n$1:    ');
        formattedScript = formattedScript.replace(/\n\nINT\./g, '\n\nINT.\n\n');
        formattedScript = formattedScript.replace(/\n\nEXT\./g, '\n\nEXT.\n\n');
    }

    // Clean up extra newlines at the start and end
    formattedScript = formattedScript.trim();
    formattedScript = formattedScript.replace(/^\n+/g, '');
    formattedScript = formattedScript.replace(/\n+$/g, '');

    return formattedScript;
  }

  // Helper method to format text into a scene description
  static formatSceneDescription(text: string): string {
    return text.trim().toUpperCase();
  }

  // Helper method to format dialogue
  static formatDialogue(character: string, dialogue: string): string {
    return `${character.toUpperCase()}:    ${dialogue}`;
  }

  // Helper method to format action descriptions
  static formatAction(text: string): string {
    return text.trim();
  }
}
