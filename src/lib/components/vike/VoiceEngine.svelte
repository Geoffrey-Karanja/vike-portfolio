<script>
  import { onMount, onDestroy } from 'svelte';
  import { vikeState, voiceAvailable, transcript } from '$lib/stores/vike.js';
  import { parseCommand } from '$lib/actions/commandParser.js';

  export let analyser = null;

  let recognition;
  let stream;
  let audioCtx;

  export async function startListening() {
    if (!recognition) return;
    try {
      vikeState.set('listening');
      transcript.set('');

      // Get mic stream for waveform visualizer
      stream   = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source  = audioCtx.createMediaStreamSource(stream);
      const _analyser = audioCtx.createAnalyser();
      _analyser.fftSize = 256;
      source.connect(_analyser);
      analyser = _analyser;

      recognition.start();
    } catch (e) {
      console.warn('Mic error:', e);
      vikeState.set('idle');
    }
  }

  export function stopListening() {
    recognition?.stop();
    stream?.getTracks().forEach(t => t.stop());
    audioCtx?.close();
    analyser = null;
    vikeState.set('idle');
  }

  onMount(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      voiceAvailable.set(false);
      return;
    }

    recognition = new SR();
    recognition.continuous    = false;
    recognition.interimResults = true;
    recognition.lang          = 'en-US';

    recognition.onresult = (e) => {
      const result = e.results[e.results.length - 1];
      const text   = result[0].transcript.trim().toLowerCase();
      transcript.set(text);

      if (result.isFinal) {
        stopListening();
        vikeState.set('thinking');
        setTimeout(() => parseCommand(text), 300);
      }
    };

    recognition.onerror = (e) => {
      console.warn('Speech error:', e.error);
      stopListening();
    };

    recognition.onend = () => {
      if ($vikeState === 'listening') stopListening();
    };

    voiceAvailable.set(true);
  });

  onDestroy(() => stopListening());
</script>