<script>
  import { onMount } from 'svelte';
  import { vikeState, muted, voiceAvailable } from '$lib/stores/vike.js';

  let synth;
  let voice = null;

  export function speak(text) {
    if (!synth || $muted) return;

    // Cancel anything currently speaking
    synth.cancel();

    const utter = new SpeechSynthesisUtterance(text);

    // Find the best available voice
    utter.voice  = voice;
    utter.rate   = 0.88;   // Slightly slower — more deliberate
    utter.pitch  = 0.95;   // Slightly lower — more authoritative
    utter.volume = 0.9;

    utter.onstart = () => vikeState.set('speaking');
    utter.onend   = () => vikeState.set('idle');
    utter.onerror = () => vikeState.set('idle');

    synth.speak(utter);
  }

  export function cancel() {
    synth?.cancel();
    vikeState.set('idle');
  }

  onMount(() => {
    if (!('speechSynthesis' in window)) {
      voiceAvailable.set(false);
      return;
    }

    synth = window.speechSynthesis;
    voiceAvailable.set(true);

    // Voices load async — pick best one when ready
    const pickVoice = () => {
      const voices = synth.getVoices();

      // Preference order — deep, clear English voices
      const preferred = [
        'Google UK English Male',
        'Google US English',
        'Microsoft Guy Online (Natural) - English (United States)',
        'Alex',
        'Daniel',
      ];

      for (const name of preferred) {
        const found = voices.find(v => v.name === name);
        if (found) { voice = found; return; }
      }

      // Fallback — first English voice
      voice = voices.find(v => v.lang.startsWith('en')) ?? voices[0];
    };

    pickVoice();
    synth.onvoiceschanged = pickVoice;
  });
</script>