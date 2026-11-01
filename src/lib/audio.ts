/**
 * British English (en-GB) Audio Pronunciation Service
 * Uses Web Speech API SpeechSynthesis with preferred UK voices.
 */

class BritishAudioService {
  private voices: SpeechSynthesisVoice[] = [];
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private initialized = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    this.voices = window.speechSynthesis.getVoices();
    this.initialized = true;

    // Preference order for high quality British English voices
    const ukVoices = this.voices.filter(v => 
      v.lang.toLowerCase().startsWith('en-gb') || 
      v.lang.toLowerCase().replace('_', '-').startsWith('en-gb') ||
      v.name.toLowerCase().includes('united kingdom') ||
      v.name.toLowerCase().includes('british') ||
      v.name.toLowerCase().includes('uk english')
    );

    if (ukVoices.length > 0) {
      // Prefer natural or recognizable neural/high-quality voices
      const preferred = ukVoices.find(v => 
        v.name.includes('Natural') || 
        v.name.includes('Google') || 
        v.name.includes('Hazel') || 
        v.name.includes('George') ||
        v.name.includes('Daniel')
      );
      this.selectedVoice = preferred || ukVoices[0];
    } else {
      // Fallback to any English voice
      const anyEnglish = this.voices.find(v => v.lang.toLowerCase().startsWith('en'));
      this.selectedVoice = anyEnglish || null;
    }
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!this.initialized) {
      this.initVoices();
    }
    return this.voices.filter(v => v.lang.toLowerCase().startsWith('en'));
  }

  public getUkVoices(): SpeechSynthesisVoice[] {
    if (!this.initialized) {
      this.initVoices();
    }
    return this.voices.filter(v => 
      v.lang.toLowerCase().startsWith('en-gb') || 
      v.name.toLowerCase().includes('united kingdom') ||
      v.name.toLowerCase().includes('british') ||
      v.name.toLowerCase().includes('uk english')
    );
  }

  public setVoiceByUri(voiceUri: string) {
    const found = this.voices.find(v => v.voiceURI === voiceUri);
    if (found) {
      this.selectedVoice = found;
    }
  }

  public speak(
    text: string, 
    rate: number = 0.88, 
    onEnd?: () => void,
    onError?: (err: unknown) => void
  ) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onError) onError(new Error('SpeechSynthesis not supported'));
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop any pending speech

      const utterance = new SpeechSynthesisUtterance(text);
      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
        utterance.lang = this.selectedVoice.lang || 'en-GB';
      } else {
        utterance.lang = 'en-GB';
      }

      utterance.rate = rate; // 0.8 - 1.0 recommended for vocabulary learning
      utterance.pitch = 1.0;

      if (onEnd) {
        utterance.onend = () => onEnd();
      }
      if (onError) {
        utterance.onerror = (e) => onError(e);
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      if (onError) onError(e);
    }
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }
}

export const britishAudio = new BritishAudioService();
