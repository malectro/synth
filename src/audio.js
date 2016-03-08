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

