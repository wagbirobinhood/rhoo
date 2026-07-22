// Cyberpunk Generative Audio Synthesizer
let audioCtx = null;

const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
};

export const playHoverSound = () => {
  initAudio();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = 'square';
  osc.frequency.setValueAtTime(150, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.05);
  
  gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.05);
};

export const playGlitchSound = () => {
  initAudio();
  const bufferSize = audioCtx.sampleRate * 0.1; // 100ms
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1; // White noise
  }
  
  const noiseSource = audioCtx.createBufferSource();
  noiseSource.buffer = buffer;
  
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
  
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 1000;
  
  noiseSource.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);
  
  noiseSource.start();
};

const successAudio = new Audio('/Success.mp3');

export const playSuccessSound = () => {
  successAudio.currentTime = 0;
  successAudio.play().catch(e => console.error("Failed to play Success.mp3:", e));
};

const errorAudio = new Audio('/Wrong.mp3');

export const playErrorSound = () => {
  errorAudio.currentTime = 0;
  errorAudio.play().catch(e => console.error("Failed to play Wrong.mp3:", e));
};
