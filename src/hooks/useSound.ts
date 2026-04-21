import { useCallback } from 'react';

export const useSound = () => {
  const playFlipSound = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Creating a "Soft Papery Swish" sound
      const bufferSize = audioContext.sampleRate * 0.4; // 400ms rustle
      const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const data = buffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        // Brown noise (lower frequency noise) for a softer, textured paper sound
        let lastOut = 0;
        const white = Math.random() * 2 - 1;
        const brown = (lastOut + (0.02 * white)) / 1.02;
        lastOut = brown;
        
        data[i] = brown * Math.exp(-6 * i / bufferSize);
      }
      
      const noise = audioContext.createBufferSource();
      noise.buffer = buffer;
      
      const filter = audioContext.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1500, audioContext.currentTime); // Lower cutoff for "softness"
      
      const gain = audioContext.createGain();
      gain.gain.setValueAtTime(0.25, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioContext.destination);
      
      noise.start();
    } catch (err) {
      console.log("Synthetic audio failed", err);
    }
  }, []);

  return { playFlipSound };
};
