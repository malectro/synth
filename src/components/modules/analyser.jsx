/* @flow */

import _ from 'lodash';
import React, {PureComponent} from 'react';

import audio, {SAMPLE_RATE} from '../../audio.ts';

import Canvas from '../ui/canvas.tsx';


export default class Module extends PureComponent {
  constructor(props) {
    super(props);

    this.handleResize = this.handleResize.bind(this);
    this.draw = this.draw.bind(this);
  }

  componentDidMount() {
    this.analyser = audio.createAnalyser();
    this.analyser.fftSize = 2048;
    this.analyser.maxDecibels = -10;

    this.bufferLength = this.analyser.frequencyBinCount;
    this.buffer = new Float32Array(this.bufferLength);

    this.animationFrame = requestAnimationFrame(this.draw);
  }

  componentDidUpdate(prevProps) {
    const {source} = this.props;
    if (source && source !== prevProps.source) {
      source.connect(this.analyser);
    }
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  draw() {
    const {canvas, unmounted} = this;

    if (unmounted || !canvas) {
      return;
    }

    this.animationFrame = requestAnimationFrame(this.draw);

    const {ctx} = this.canvas;
    const {width, height} = this.canvas.el;

    this.analyser.getFloatFrequencyData(this.buffer);

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = 'white';

    const scalar = 1 / (this.analyser.maxDecibels - this.analyser.minDecibels);
    const margin = 2;
    const length = this.bufferLength;
    const stepWidth = width / length;
    for (let i = 0; i < length; i++) {
      const size = (this.buffer[i] - this.analyser.minDecibels) * scalar * height;
      ctx.fillRect(stepWidth * i, height - size, stepWidth - margin, size);
    }

    /*
    const scalar = 1 / (this.analyser.maxDecibels - this.analyser.minDecibels);
    const margin = 2;
    const resolution = 1000;
    const length = this.buffer.length;
    const stepWidth = width / resolution;
    for (let i = 0; i < resolution; i++) {
      const sample = Math.floor(Math.pow(1.008, i));
      //const sample = Math.floor(Math.log2(i));
      if (sample > length) {
        break;
      }
      const size = (this.buffer[sample] - this.analyser.minDecibels) * scalar * height;
      ctx.fillRect(stepWidth * i, height - size, stepWidth - margin, size);
    }
    */
  }

  render() {
    const {source, ...props} = this.props;
    return (
      <Canvas {...props} ref={canvas => this.canvas = canvas} onResize={this.handleResize} />
    );
  }

  handleResize() {
    this.draw();
  }
}

