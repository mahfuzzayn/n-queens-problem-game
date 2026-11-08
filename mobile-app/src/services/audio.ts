/**
 * Native Audio Service using expo-audio with resilient runtime loading.
 * 
 * Provides game sound effects:
 * - tap, place, remove, conflict, hint, win, lose.
 * Includes in-memory generated PCM WAV sound cues.
 * 
 * Uses defensive dynamic loading so that if native audio bindings are missing in
 * the current runtime (e.g. Expo Go without native build), the app runs smoothly
 * with zero crashes or red-screen exceptions.
 */

type ExpoAudioModule = typeof import('expo-audio');
type AudioPlayerInstance = import('expo-audio').AudioPlayer;

let cachedAudioModule: ExpoAudioModule | null = null;
let isModuleChecked = false;

function getAudioModule(): ExpoAudioModule | null {
  if (isModuleChecked) {
    return cachedAudioModule;
  }
  isModuleChecked = true;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require('expo-audio');
    if (mod && typeof mod.createAudioPlayer === 'function') {
      cachedAudioModule = mod;
    }
  } catch {
    // Native audio module not bundled or supported in this client - fail gracefully
  }
  return cachedAudioModule;
}

/**
 * Creates a base64 encoded WAV mono data URI for a given frequency and duration.
 */
function generateWavDataUri(
  freq: number,
  durationMs: number,
  type: 'sine' | 'triangle' | 'square' | 'sawtooth' = 'sine'
): string {
  const sampleRate = 22050;
  const numSamples = Math.floor((durationMs / 1000) * sampleRate);
  const dataSize = numSamples * 2; // 16-bit mono
  const fileSize = 36 + dataSize;

  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  // RIFF identifier
  view.setUint32(0, 0x52494646, false); // "RIFF"
  view.setUint32(4, fileSize, true);
  view.setUint32(8, 0x57415645, false); // "WAVE"
  // format chunk identifier
  view.setUint32(12, 0x666d7420, false); // "fmt "
  view.setUint32(16, 16, true); // chunk length
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); // byte rate
  view.setUint16(32, 2, true); // block align
  view.setUint16(34, 16, true); // bits per sample
  // data chunk
  view.setUint32(36, 0x64617461, false); // "data"
  view.setUint32(40, dataSize, true);

  const amplitude = 0.3 * 32767;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let sample = 0;
    const phase = (freq * t) % 1;

    if (type === 'sine') {
      sample = Math.sin(2 * Math.PI * freq * t);
    } else if (type === 'triangle') {
      sample = 4 * Math.abs(phase - 0.5) - 1;
    } else if (type === 'square') {
      sample = phase < 0.5 ? 1 : -1;
    } else if (type === 'sawtooth') {
      sample = 2 * phase - 1;
    }

    // Apply linear fade-out envelope to avoid audio clicks
    const envelope = Math.max(0, 1 - i / numSamples);
    const intSample = Math.floor(sample * amplitude * envelope);
    view.setInt16(44 + i * 2, intSample, true);
  }

  // Base64 encoding
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  let base64 = '';
  if (typeof btoa === 'function') {
    base64 = btoa(binary);
  } else {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    for (let i = 0; i < len; i += 3) {
      const b1 = bytes[i];
      const b2 = i + 1 < len ? bytes[i + 1] : 0;
      const b3 = i + 2 < len ? bytes[i + 2] : 0;
      base64 += chars[b1 >> 2];
      base64 += chars[((b1 & 3) << 4) | (b2 >> 4)];
      base64 += i + 1 < len ? chars[((b2 & 15) << 2) | (b3 >> 6)] : '=';
      base64 += i + 2 < len ? chars[b3 & 63] : '=';
    }
  }

  return `data:audio/wav;base64,${base64}`;
}

export class NativeAudioService {
  private enabled = true;
  private volume = 0.8;
  private playerCache = new Map<string, AudioPlayerInstance>();
  private initializedMode = false;

  private async ensureAudioMode() {
    if (this.initializedMode) return;
    try {
      const mod = getAudioModule();
      if (mod && typeof mod.setAudioModeAsync === 'function') {
        await mod.setAudioModeAsync({
          playsInSilentMode: true,
          interruptionMode: 'duckOthers',
        });
        this.initializedMode = true;
      }
    } catch {
      // Ignore mode set errors
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  private async playTone(
    freq: number,
    durationMs: number,
    type: 'sine' | 'triangle' | 'square' | 'sawtooth' = 'sine'
  ) {
    if (!this.enabled) return;
    const mod = getAudioModule();
    if (!mod) return;

    try {
      await this.ensureAudioMode();
      const cacheKey = `${freq}_${durationMs}_${type}`;
      let player = this.playerCache.get(cacheKey);

      if (!player) {
        const uri = generateWavDataUri(freq, durationMs, type);
        player = mod.createAudioPlayer(uri);
        this.playerCache.set(cacheKey, player);
      }

      player.volume = this.volume;
      try {
        await player.seekTo(0);
      } catch {
        // seek may not be needed on first play
      }
      player.play();
    } catch {
      // Audio playback failed - ignore gracefully
    }
  }

  public playTap() {
    this.playTone(350, 40, 'sine');
  }

  public playPlace() {
    this.playTone(520, 70, 'triangle');
  }

  public playRemove() {
    this.playTone(280, 70, 'triangle');
  }

  public playConflict() {
    this.playTone(180, 120, 'sawtooth');
  }

  public playHint() {
    this.playTone(680, 150, 'sine');
  }

  public playWin() {
    const notes = [440, 554, 659, 880];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 180, 'triangle'), i * 110);
    });
  }

  public playLose() {
    const notes = [320, 280, 240, 200];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 150, 'sawtooth'), i * 110);
    });
  }
}

export const audioService = new NativeAudioService();
