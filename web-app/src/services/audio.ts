/**
 * Web Audio and Haptics Adapters.
 * 
 * Generates synthetic game sounds via Web Audio API (or Howler.js) so no external sound files are required to run.
 * Handles haptic vibration via navigator.vibrate with safety checks and user preference gates.
 */

class AudioService {
  private ctx: AudioContext | null = null;
  private soundEnabled = true;
  private volume = 0.8;

  private initCtx() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public playTone(freq: number, type: OscillatorType, durationMs: number) {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(this.volume * 0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + durationMs / 1000);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + durationMs / 1000);
    } catch {
      // Audio autoplay policy or failure - ignore gracefully
    }
  }

  public playTap() {
    this.playTone(350, 'sine', 40);
  }

  public playPlace() {
    this.playTone(520, 'triangle', 70);
  }

  public playRemove() {
    this.playTone(280, 'triangle', 70);
  }

  public playConflict() {
    this.playTone(180, 'sawtooth', 120);
  }

  public playHint() {
    this.playTone(680, 'sine', 150);
  }

  public playWin() {
    const notes = [440, 554, 659, 880];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'triangle', 180), i * 110);
    });
  }

  public playLose() {
    const notes = [320, 280, 240, 200];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'sawtooth', 150), i * 110);
    });
  }
}

class HapticsService {
  private enabled = true;

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public vibrate(pattern: number | number[]) {
    if (!this.enabled || typeof window === 'undefined') return;
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Ignore haptic failures
      }
    }
  }

  public tap() {
    this.vibrate(15);
  }

  public error() {
    this.vibrate([30, 40, 30]);
  }

  public victory() {
    this.vibrate([40, 60, 40, 60, 100]);
  }
}

export const audioService = new AudioService();
export const hapticsService = new HapticsService();
