export type WaveType = 'square' | 'triangle' | 'sine' | 'sawtooth';


export const SAMPLE_RATE = 44100;

let ctx;

if (typeof AudioContext !== 'undefined') {
  ctx = new AudioContext();
} else if (typeof webkitAudioContext !== 'undefined') {
  ctx = new webkitAudioContext();
} else {
  ctx = null;
}

export default ctx;


export function createNoiseNode() {
  const noiseBufferSize = 2 * SAMPLE_RATE;
  const noiseBuffer = ctx.createBuffer(1, noiseBufferSize, SAMPLE_RATE);
  const output = noiseBuffer.getChannelData(0);

  for (let i = 0; i < noiseBufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  const noiseNode = ctx.createBufferSource();
  noiseNode.buffer = noiseBuffer;
  noiseNode.loop = true;

  return noiseNode;
}

