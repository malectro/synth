/* @flow */

import React, {Component} from 'react';

import audio, {SAMPLE_RATE, createNoiseNode} from 'src/audio';
import css from './synth.css';

import Envelope from 'src/components/modules/envelope.jsx';
import Keyboard from 'src/components/modules/keyboard.jsx';
import WavePlot from 'src/components/modules/wave-plot.jsx';


export default class EnvelopeShaper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      osc: null,
      noise: null,
      gain: null,
      waveType: 'sine',
      points: [
        {x: 0, y: 1},
        {x: 1, y: 1},
      ],
    };

    this.handleEnvelopeChange = this.handleEnvelopeChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleKeyMove = this.handleKeyMove.bind(this);
    this.handleKeyRelease = this.handleKeyRelease.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
  }

  componentDidMount() {
    const osc = audio.createOscillator();
    osc.frequency.value = 440;
    osc.type = this.state.waveType;

    const noise = createNoiseNode();

    const gain = audio.createGain();
    gain.gain.value = 0;

    osc.connect(gain);

    gain.connect(audio.destination);

    osc.start();
    noise.start();

    this.setState({
      osc, gain, noise,
    });
  }

  componentWillUnmount() {
    const {osc, noise, gain} = this.state;
    osc.stop();
    osc.disconnect();
    noise.stop();
    noise.disconnect();
    gain.disconnect();
  }

  render() {
    const {points, osc, waveType} = this.state;

    return (
      <figure className={css.module}>
        <div className={css.container}>
          <Envelope points={points} onChange={this.handleEnvelopeChange} />
          <Keyboard onPress={this.handleKeyPress} onMove={this.handleKeyMove} onRelease={this.handleKeyRelease} />
          <div className={css.waveSelect}>
            { ['sine', 'sawtooth', 'square', 'noise'].map(type => (
              <WavePlot className={waveType === type ? css.waveSelected : css.wave} key={type} type={type} repeat={0.5} onClick={() => this.handleTypeChange(type)} />
            )) }
          </div>
          <figcaption>A frequency spectrum shows us the “loudness” of a sound at every audible frequency.</figcaption>
        </div>
      </figure>
    );
  }

  handleEnvelopeChange(points) {
    this.setState({
      points,
    });
  }

  handleKeyPress(freq) {
    const now = audio.currentTime;
    const {osc, gain, points} = this.state;
    const {x: attackDuration, y: attackAmp} = points[0];
    const {x: decayDuration, y: decayAmp} = points[1];

    const duration = 1;

    osc.frequency.linearRampToValueAtTime(freq, now + 0.001);

    gain.gain.cancelScheduledValues(0);

    const attackTime = now + duration * attackDuration;
    gain.gain.linearRampToValueAtTime(attackAmp, attackTime);
    gain.gain.linearRampToValueAtTime(decayAmp, now + duration * decayDuration);
    gain.gain.linearRampToValueAtTime(0, now + duration + 0.01);
  }

  handleKeyMove(freq) {
    return;
    const now = audio.currentTime;
    this.state.osc.frequency.linearRampToValueAtTime(freq, now + 0.01);
  }

  handleKeyRelease(freq) {
    return;
    const now = audio.currentTime;
    this.state.gain.gain.cancelScheduledValues(0);
    this.state.gain.gain.linearRampToValueAtTime(0, now + 0.2);
  }

  handleTypeChange(waveType) {
    const {noise, osc, gain} = this.state;

    if (waveType === 'noise') {
      osc.disconnect();
      noise.connect(gain);
    } else {
      noise.disconnect();
      osc.connect(gain);
      osc.type = waveType;
    }

    this.setState({osc, noise, waveType});
  }
}
